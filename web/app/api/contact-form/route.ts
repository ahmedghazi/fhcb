import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactFormBody = {
  to?: string;
  subject?: string;
  data?: Record<string, any>;
};

const _escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char] as string,
  );

export async function POST(req: Request) {
  const body: ContactFormBody = await req.json();
  const { to, subject, data = {} } = body;

  if (!to) {
    return NextResponse.json(
      { ok: false, error: "Missing recipient" },
      { status: 400 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const rows = Object.entries(data)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:4px 8px;font-weight:bold">${_escapeHtml(key)}</td><td style="padding:4px 8px">${_escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const emailSubject = subject
    ? `[FHCB] ${subject}`
    : "[FHCB] Nouveau message du formulaire de contact";
  console.log(emailSubject);
  console.log(to);
  console.log(emailSubject);
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to,
      // to: "hello@ahmedghazi.com",
      subject: emailSubject,
      html: `
        <h2>${_escapeHtml(emailSubject)}</h2>
        <table>${rows}</table>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
