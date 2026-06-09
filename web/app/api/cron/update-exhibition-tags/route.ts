import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { projectId, dataset } from "@/app/sanity-api/sanity.api";
import { isInSiteLocationType } from "@/app/lib/utils";

/**
 * curl -H "Authorization: Bearer TEST" http://localhost:3000/api/cron/update-exhibition-tags

 */
const TAG_CURRENT_SLUG = "exposition-en-cours";
const TAG_PAST_SLUG = "exposition-passee";
const TAG_UPCOMING_SLUG = "exposition-a-venir";

// Actions API requires apiVersion >= 2023-08-04
function getWriteClient() {
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  if (!writeToken) throw new Error("SANITY_API_WRITE_TOKEN is not set");
  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-10-01",
    useCdn: false,
    token: writeToken,
  });
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getWriteClient();
  const now = new Date().toISOString();

  // Resolve or create managed tags
  const existingTags: { _id: string; slug: string }[] = await client.fetch(
    `*[_type == "tag" && slug.current in [$current, $past, $upcoming]]{ _id, "slug": slug.current }`,
    {
      current: TAG_CURRENT_SLUG,
      past: TAG_PAST_SLUG,
      upcoming: TAG_UPCOMING_SLUG,
    },
  );

  const resolve = async (
    slug: string,
    titleFr: string,
    titleEn: string,
  ): Promise<string> => {
    const found = existingTags.find((t) => t.slug === slug);
    if (found) return found._id;
    const doc = await client.create({
      _type: "tag",
      title: { fr: titleFr, en: titleEn },
      slug: { _type: "slug", current: slug },
    });
    return doc._id;
  };

  const [currentTagId, pastTagId, upcomingTagId] = await Promise.all([
    resolve(TAG_CURRENT_SLUG, "Exposition en cours", "Current exhibition"),
    resolve(TAG_PAST_SLUG, "Exposition passée", "Past exhibition"),
    resolve(TAG_UPCOMING_SLUG, "Exposition à venir", "Upcoming exhibition"),
  ]);

  // Fetch all published exhibitions with dates and tags
  const exhibitions: {
    _id: string;
    dates: { du?: string; au?: string; locationType?: string }[] | null;
    tags: { _key: string; _ref: string }[] | null;
  }[] = await client.fetch(
    `*[_type == "exhibition" && !(_id in path("drafts.**"))] {
      _id,
      "dates": dates[]{ du, au, locationType },
      "tags": tags[]{ _key, _ref }
    }`,
  );

  const managedIds = new Set([currentTagId, pastTagId, upcomingTagId]);
  let updated = 0;
  const log: string[] = [];

  // Use date-only string for comparison with YYYY-MM-DD date fields
  const nowDate = now.slice(0, 10);

  for (const exhibition of exhibitions) {
    if (!exhibition.dates?.length) continue;

    const allStarts = exhibition.dates
      .map((d) => d.du)
      .filter(Boolean) as string[];
    const allEnds = exhibition.dates
      .map((d) => d.au)
      .filter(Boolean) as string[];
    if (!allStarts.length || !allEnds.length) continue;

    const firstStart = allStarts.sort()[0];
    const lastEnd = allEnds.sort().reverse()[0];

    const isCurrent = exhibition.dates.some(
      (d) =>
        isInSiteLocationType(d.locationType) && d.du && d.au && d.du <= nowDate && d.au >= nowDate,
    );
    const isPast = lastEnd < nowDate;
    const isUpcoming = firstStart > nowDate;

    const otherTags = (exhibition.tags || []).filter(
      (t) => !managedIds.has(t._ref),
    );
    const nextTags = [...otherTags];
    if (isCurrent) nextTags.push({ _key: randomKey(), _ref: currentTagId });
    if (isPast) nextTags.push({ _key: randomKey(), _ref: pastTagId });
    if (isUpcoming) nextTags.push({ _key: randomKey(), _ref: upcomingTagId });

    const tagRefs = nextTags.map((t) => ({
      _type: "reference" as const,
      _key: t._key || randomKey(),
      _ref: t._ref,
    }));

    const draftId = `drafts.${exhibition._id}`;

    // Fetch the full published document to seed the draft
    const fullDoc = await client.getDocument<Record<string, unknown>>(
      exhibition._id,
    );
    if (!fullDoc) continue;

    // Write a draft with updated tags (create or replace)
    await client.createOrReplace({ ...fullDoc, _id: draftId, tags: tagRefs });

    // Publish the draft immediately via Actions API (bypasses direct-mutation ACL)
    await client.request({
      method: "POST",
      url: `/data/actions/${dataset}`,
      body: {
        actions: [
          {
            actionType: "sanity.action.document.publish",
            draftId,
            publishedId: exhibition._id,
          },
        ],
      },
    });

    updated++;
    log.push(
      `${exhibition._id}: ${isCurrent ? "current" : isPast ? "past" : "upcoming"}`,
    );
  }

  return NextResponse.json({ updated, log });
}
