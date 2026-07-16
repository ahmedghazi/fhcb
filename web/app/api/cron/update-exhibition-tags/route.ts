import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";
import { projectId, dataset } from "@/app/sanity-api/sanity.api";
import { isInSiteLocationType } from "@/app/lib/utils";

/**
 * curl -H "Authorization: Bearer TEST" http://localhost:3000/api/cron/update-exhibition-tags

 */
const TAG_CURRENT_SLUG = "exposition-en-cours";
const TAG_PAST_SLUG = "exposition-passee";
const TAG_UPCOMING_SLUG = "exposition-a-venir";
const TAG_HORS_LES_MURS_SLUG = "hors-les-murs";

const OFF_SITE_LOCATION_TYPES = ["offSite", "travelling"];

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

async function sendCronReport({
  updated,
  log,
  error,
}: {
  updated: number;
  log: string[];
  error?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = error
    ? `[CRON] update-exhibition-tags — ERREUR`
    : `[CRON] update-exhibition-tags — ${updated} doc(s) mis à jour`;

  const bodyLines = error
    ? [`<p style="color:red"><strong>Erreur :</strong> ${error}</p>`]
    : [
        `<p><strong>${updated}</strong> exposition(s) mise(s) à jour.</p>`,
        updated > 0
          ? `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:monospace;font-size:13px">
              <thead><tr><th>Document ID</th><th>Tags assignés</th></tr></thead>
              <tbody>${log.map((l) => `<tr>${l.split(": ").map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
            </table>`
          : `<p>Aucun document modifié.</p>`,
      ];

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: "hello@ahmedghazi.com",
    subject,
    html: `
      <h2>Rapport CRON — update-exhibition-tags</h2>
      <p>Date : ${new Date().toISOString()}</p>
      ${bodyLines.join("\n")}
    `,
  });
}

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
        isInSiteLocationType(d.locationType) &&
        d.du &&
        d.au &&
        d.du <= nowDate &&
        d.au >= nowDate,
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
    const isUpcoming = firstStart > nowDate;

    // Compute pastille and countdown based on exhibition status
    const todayMs = new Date().setHours(0, 0, 0, 0);
    let pastilleText = { fr: "", en: "" };
    let countdown: number | null = null;

    if (isCurrent) {
      const daysUntilEnd = Math.ceil(
        (new Date(lastEnd).setHours(0, 0, 0, 0) - todayMs) / 86400000,
      );
      if (daysUntilEnd >= 0 && daysUntilEnd <= 10) {
        pastilleText =
          daysUntilEnd < 5
            ? { fr: "derniers jours", en: "last days" }
            : { fr: `J-${daysUntilEnd}`, en: `J-${daysUntilEnd}` };
      }
    } else if (isUpcoming) {
      const daysUntilStart = Math.ceil(
        (new Date(firstStart).setHours(0, 0, 0, 0) - todayMs) / 86400000,
      );
      if (daysUntilStart <= 30) {
        countdown = daysUntilStart;
        pastilleText = { fr: `J-${daysUntilStart}`, en: `J-${daysUntilStart}` };
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

    const draftId = `drafts.${exhibition._id}`;

    // Fetch the full published document to seed the draft
    const fullDoc = await client.getDocument<Record<string, unknown>>(
      exhibition._id,
    );
    if (!fullDoc) continue;

    // Write a draft with updated tags (create or replace)
    await client.createOrReplace({
      ...fullDoc,
      _id: draftId,
      tags: tagRefs,
      pastille: pastilleText,
      countdown,
    });

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
      `${exhibition._id}: ${[isCurrent && "current", isHorsLesMurs && "hors-les-murs", isPast && "past", isUpcoming && "upcoming"].filter(Boolean).join("+") || "none"}`,
    );
  }

  await sendCronReport({ updated, log });
  return NextResponse.json({ updated, log });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await sendCronReport({ updated: 0, log: [], error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
