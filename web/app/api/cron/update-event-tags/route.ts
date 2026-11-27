import { NextResponse } from "next/server";
import {
  getWriteClient,
  randomKey,
  sendCronReport as sendReport,
  writeAndPublish,
} from "@/app/lib/cron";

/**
 * curl -H "Authorization: Bearer TEST" http://localhost:3000/api/cron/update-event-tags
 */
const TAG_CURRENT_SLUG = "evenement-en-cours";
const TAG_PAST_SLUG = "evenement-passe";
const TAG_UPCOMING_SLUG = "evenement-a-venir";

const sendCronReport = (args: {
  updated: number;
  log: string[];
  error?: string;
}) => sendReport({ job: "update-event-tags", label: "événement(s)", ...args });

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Guard on the secret itself: if CRON_SECRET were unset, the header
  // "Bearer undefined" would otherwise match.
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let client: ReturnType<typeof getWriteClient>;
  try {
    client = getWriteClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await sendCronReport({ updated: 0, log: [], error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }

  try {
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
        tagType: "event",
        visible: true,
        title: { fr: titleFr, en: titleEn },
        slug: { _type: "slug", current: slug },
      });
      return doc._id;
    };

    const [currentTagId, pastTagId, upcomingTagId] = await Promise.all([
      resolve(TAG_CURRENT_SLUG, "Événement en cours", "Current event"),
      resolve(TAG_PAST_SLUG, "Événement passé", "Past event"),
      resolve(TAG_UPCOMING_SLUG, "Événement à venir", "Upcoming event"),
    ]);

    const events: {
      _id: string;
      dates: { du?: string; au?: string }[] | null;
      tags: { _key: string; _ref: string }[] | null;
    }[] = await client.fetch(
      `*[_type == "event" && !(_id in path("drafts.**"))] {
      _id,
      "dates": dates[]{ du, au },
      "tags": tags[]{ _key, _ref }
    }`,
    );

    const managedIds = new Set([currentTagId, pastTagId, upcomingTagId]);
    let updated = 0;
    const log: string[] = [];

    // Use date-only string for comparison with YYYY-MM-DD date fields
    const nowDate = new Date().toISOString().slice(0, 10);

    for (const event of events) {
      // No "already past" shortcut: an editor may add new dates to a past
      // event, and unchanged ones are skipped by the managed-tags check below.
      // "au" is left empty for single-day events: the range ends on "du"
      const ranges = (event.dates || [])
        .filter((d) => d.du)
        .map((d) => ({ du: d.du as string, au: d.au || (d.du as string) }));
      if (!ranges.length) continue;

      const lastEnd = ranges
        .map((r) => r.au)
        .sort()
        .reverse()[0];

      const isCurrent = ranges.some((r) => r.du <= nowDate && r.au >= nowDate);
      const isPast = lastEnd < nowDate;
      const isUpcoming = ranges.some((r) => r.du > nowDate);

      const currentManaged = (event.tags || [])
        .filter((t) => managedIds.has(t._ref))
        .map((t) => t._ref)
        .sort()
        .join(",");
      const nextManaged = [
        isCurrent && currentTagId,
        isPast && pastTagId,
        isUpcoming && upcomingTagId,
      ]
        .filter(Boolean)
        .sort()
        .join(",");
      // Nothing changed since the last run: skip the write/publish
      if (currentManaged === nextManaged) continue;

      const otherTags = (event.tags || []).filter(
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

      // pastille is editorial on events ("COMPLET"…), leave it untouched
      const written = await writeAndPublish(client, event._id, {
        tags: tagRefs,
      });
      if (!written) continue;

      updated++;
      log.push(
        `${event._id}: ${[isCurrent && "current", isPast && "past", isUpcoming && "upcoming"].filter(Boolean).join("+") || "none"}`,
      );
    }

    // await sendCronReport({ updated, log });
    return NextResponse.json({ updated, log });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await sendCronReport({ updated: 0, log: [], error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
