import { NextResponse } from "next/server";
import { isInSiteLocationType } from "@/app/lib/utils";
import {
  getWriteClient,
  randomKey,
  sendCronReport as sendReport,
  writeAndPublish,
} from "@/app/lib/cron";

/**
 * curl -H "Authorization: Bearer TEST" http://localhost:3000/api/cron/update-exhibition-tags

 */
const TAG_CURRENT_SLUG = "exposition-en-cours";
const TAG_PAST_SLUG = "exposition-passee";
const TAG_UPCOMING_SLUG = "exposition-a-venir";
const TAG_HORS_LES_MURS_SLUG = "hors-les-murs";

const OFF_SITE_LOCATION_TYPES = ["offSite", "travelling"];

const sendCronReport = (args: {
  updated: number;
  log: string[];
  error?: string;
}) =>
  sendReport({ job: "update-exhibition-tags", label: "exposition(s)", ...args });

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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

  const now = new Date().toISOString();

  try {
    // Resolve or create managed tags
    const existingTags: { _id: string; slug: string }[] = await client.fetch(
      `*[_type == "tag" && slug.current in [$current, $past, $upcoming, $horsLesMurs]]{ _id, "slug": slug.current }`,
      {
        current: TAG_CURRENT_SLUG,
        past: TAG_PAST_SLUG,
        upcoming: TAG_UPCOMING_SLUG,
        horsLesMurs: TAG_HORS_LES_MURS_SLUG,
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

    const [currentTagId, pastTagId, upcomingTagId, horsLesMursTagId] =
      await Promise.all([
        resolve(TAG_CURRENT_SLUG, "Exposition en cours", "Current exhibition"),
        resolve(TAG_PAST_SLUG, "Exposition passée", "Past exhibition"),
        resolve(TAG_UPCOMING_SLUG, "Exposition à venir", "Upcoming exhibition"),
        resolve(TAG_HORS_LES_MURS_SLUG, "Hors les murs", "Off-site"),
      ]);

    // Fetch all published exhibitions with dates and tags
    const exhibitions: {
      _id: string;
      dates: { du?: string; au?: string; locationType?: string }[] | null;
      tags: { _key: string; _ref: string }[] | null;
      countdown: number | null;
    }[] = await client.fetch(
      `*[_type == "exhibition" && !(_id in path("drafts.**"))] {
      _id,
      "dates": dates[]{ du, au, locationType },
      "tags": tags[]{ _key, _ref },
      countdown
    }`,
    );

    const managedIds = new Set([
      currentTagId,
      pastTagId,
      upcomingTagId,
      horsLesMursTagId,
    ]);
    let updated = 0;
    const log: string[] = [];

    // Use date-only string for comparison with YYYY-MM-DD date fields
    const nowDate = now.slice(0, 10);

    for (const exhibition of exhibitions) {
      if (!exhibition.dates?.length) continue;

      // Already marked as past: it stays past forever, no need to re-tag it
      const alreadyPast = (exhibition.tags || []).some(
        (t) => t._ref === pastTagId,
      );
      if (alreadyPast) continue;

      const allEnds = exhibition.dates
        .map((d) => d.au)
        .filter(Boolean) as string[];
      const anyStart = exhibition.dates.some((d) => d.du);
      if (!anyStart || !allEnds.length) continue;

      const lastEnd = allEnds.sort().reverse()[0];

      // "current" (and its pastille) only cares about the Foundation's own dates — a touring/
      // hors-les-murs leg shouldn't make an exhibition look "current" once its Foundation run is
      // over. "past" stays location-agnostic: whether the whole exhibition's run has ended doesn't
      // depend on where any one leg took place. "upcoming" is also location-agnostic: a future
      // touring/hors-les-murs leg counts even after the Foundation run has ended, so the exhibition
      // keeps surfacing in upcoming lists until its last leg (anywhere) is done.
      const inSiteDates = exhibition.dates.filter((d) =>
        isInSiteLocationType(d.locationType),
      );

      const isCurrent = inSiteDates.some(
        (d) => d.du && d.au && d.du <= nowDate && d.au >= nowDate,
      );
      const isHorsLesMurs = exhibition.dates.some(
        (d) =>
          d.locationType &&
          OFF_SITE_LOCATION_TYPES.includes(d.locationType) &&
          d.du &&
          d.au &&
          d.du <= nowDate &&
          d.au >= nowDate,
      );
      const isPast = lastEnd < nowDate;

      const upcomingStarts = exhibition.dates
        .filter((d) => d.du && d.du > nowDate)
        .map((d) => d.du as string)
        .sort();
      const isUpcoming = upcomingStarts.length > 0;

      // Compute pastille and countdown based on exhibition status
      const todayMs = new Date().setHours(0, 0, 0, 0);
      let pastilleText = { fr: "", en: "" };
      let countdown: number | null = null;

      if (isCurrent) {
        const currentInSiteEnd = inSiteDates
          .filter((d) => d.du && d.au && d.du <= nowDate && d.au >= nowDate)
          .map((d) => d.au as string)
          .sort()
          .reverse()[0];
        const daysUntilEnd = Math.ceil(
          (new Date(currentInSiteEnd).setHours(0, 0, 0, 0) - todayMs) / 86400000,
        );
        if (daysUntilEnd >= 0 && daysUntilEnd <= 10) {
          pastilleText =
            daysUntilEnd < 5
              ? { fr: "derniers jours", en: "last days" }
              : { fr: `J-${daysUntilEnd}`, en: `J-${daysUntilEnd}` };
        }
      } else if (isUpcoming) {
        const nextStart = upcomingStarts[0];
        const daysUntilStart = Math.ceil(
          (new Date(nextStart).setHours(0, 0, 0, 0) - todayMs) / 86400000,
        );
        if (daysUntilStart <= 30) {
          countdown = daysUntilStart;
          pastilleText = {
            fr: `J-${daysUntilStart}`,
            en: `J-${daysUntilStart}`,
          };
        }
      }

      const otherTags = (exhibition.tags || []).filter(
        (t) => !managedIds.has(t._ref),
      );
      const nextTags = [...otherTags];
      if (isCurrent) nextTags.push({ _key: randomKey(), _ref: currentTagId });
      if (isHorsLesMurs)
        nextTags.push({ _key: randomKey(), _ref: horsLesMursTagId });
      if (isPast) nextTags.push({ _key: randomKey(), _ref: pastTagId });
      if (isUpcoming) nextTags.push({ _key: randomKey(), _ref: upcomingTagId });

      const tagRefs = nextTags.map((t) => ({
        _type: "reference" as const,
        _key: t._key || randomKey(),
        _ref: t._ref,
      }));

      const written = await writeAndPublish(client, exhibition._id, {
        tags: tagRefs,
        pastille: pastilleText,
        countdown,
      });
      if (!written) continue;

      updated++;
      log.push(
        `${exhibition._id}: ${[isCurrent && "current", isHorsLesMurs && "hors-les-murs", isPast && "past", isUpcoming && "upcoming"].filter(Boolean).join("+") || "none"}`,
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
