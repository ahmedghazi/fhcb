import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";
import { projectId, dataset } from "@/app/sanity-api/sanity.api";

// Shared helpers for the tag-updating cron routes (exhibitions, events)

// Actions API requires apiVersion >= 2023-08-04
export function getWriteClient() {
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

export function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

export async function sendCronReport({
  job,
  label,
  updated,
  log,
  error,
}: {
  job: string;
  label: string;
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
    ? `[CRON] ${job} — ERREUR`
    : `[CRON] ${job} — ${updated} doc(s) mis à jour`;

  const bodyLines = error
    ? [`<p style="color:red"><strong>Erreur :</strong> ${error}</p>`]
    : [
        `<p><strong>${updated}</strong> ${label} mis à jour.</p>`,
        updated > 0
          ? `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:monospace;font-size:13px">
              <thead><tr><th>Document ID</th><th>Tags assignés</th></tr></thead>
              <tbody>${log
                .map(
                  (l) =>
                    `<tr>${l
                      .split(": ")
                      .map((c) => `<td>${c}</td>`)
                      .join("")}</tr>`,
                )
                .join("")}</tbody>
            </table>`
          : `<p>Aucun document modifié.</p>`,
      ];

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: "hello@ahmedghazi.com",
    subject,
    html: `
      <h2>Rapport CRON — ${job}</h2>
      <p>Date : ${new Date().toISOString()}</p>
      ${bodyLines.join("\n")}
    `,
  });
}

// Write the published doc + overrides as a draft, then publish it via the
// Actions API (bypasses direct-mutation ACL). Returns false if the doc is gone.
export async function writeAndPublish(
  client: ReturnType<typeof getWriteClient>,
  publishedId: string,
  overrides: Record<string, unknown>,
): Promise<boolean> {
  const fullDoc = await client.getDocument<Record<string, unknown>>(
    publishedId,
  );
  if (!fullDoc) return false;

  const draftId = `drafts.${publishedId}`;
  await client.createOrReplace({ ...fullDoc, _id: draftId, ...overrides });
  await client.request({
    method: "POST",
    url: `/data/actions/${dataset}`,
    body: {
      actions: [
        {
          actionType: "sanity.action.document.publish",
          draftId,
          publishedId,
        },
      ],
    },
  });
  return true;
}
