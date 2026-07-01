import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Only available in development
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
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

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: "hello@ahmedghazi.com",
      subject: "[TEST] FHCB Cron Email",
      html: `
        <h2>Test email — FHCB Cron</h2>
        <p>Si vous recevez cet email, la configuration SMTP fonctionne correctement.</p>
        <hr />
        <p style="font-family:monospace;font-size:12px;color:#888">
          SMTP_HOST: ${process.env.SMTP_HOST}<br/>
          SMTP_PORT: ${process.env.SMTP_PORT}<br/>
          SMTP_USER: ${process.env.SMTP_USER}<br/>
          Envoyé le : ${new Date().toISOString()}
        </p>
      `,
    });

    return NextResponse.json({ ok: true, message: "Email sent to hello@ahmedghazi.com" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
