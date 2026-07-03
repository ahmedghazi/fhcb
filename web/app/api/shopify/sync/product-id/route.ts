import nodemailer from "nodemailer";
import { syncProduct, verifyShopifyHmac } from "../_utils";

/**
 * POST /api/shopify/sync/product-id
 *
 * Syncs a single product from Shopify to Sanity (all locales).
 * Covers two Shopify webhook use cases:
 *   - products/create, products/update  → full product data sync
 *   - orders/paid (stock after checkout) → inventory + stock fields updated
 *
 * Shopify webhook body must contain a top-level `id` field (numeric or GID).
 * Can also be called manually: POST { "id": "gid://shopify/Product/123" }
 */

async function sendDebugEmail(info: {
  shopifyId: string;
  payload: Record<string, unknown>;
  success: boolean;
  error?: unknown;
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

  const subject = info.success
    ? `[Shopify Sync] ✓ product-id — ${info.payload.handle ?? info.shopifyId}`
    : `[Shopify Sync] ✗ ERREUR — ${info.payload.handle ?? info.shopifyId}`;

  const errorHtml = info.error
    ? `<h3 style="color:red">Erreur</h3>
       <pre style="background:#fee;padding:12px;border-radius:4px">${
         info.error instanceof Error
           ? `${info.error.message}\n\n${info.error.stack ?? ""}`
           : JSON.stringify(info.error, null, 2)
       }</pre>`
    : "";

  const payloadFields = [
    ["id", info.payload.id],
    ["handle", info.payload.handle],
    ["title", info.payload.title],
    ["status", info.payload.status],
    ["updated_at", info.payload.updated_at],
    ["GID résolu", info.shopifyId],
  ];

  const payloadHtml = `
    <table border="1" cellpadding="6" cellspacing="0"
           style="border-collapse:collapse;font-family:monospace;font-size:13px">
      <thead><tr><th>Champ</th><th>Valeur</th></tr></thead>
      <tbody>
        ${payloadFields
          .map(
            ([k, v]) =>
              `<tr><td><strong>${k}</strong></td><td>${v ?? "<em>vide</em>"}</td></tr>`,
          )
          .join("")}
      </tbody>
    </table>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: "hello@ahmedghazi.com",
    subject,
    html: `
      <h2>Shopify → Sanity — product-id webhook</h2>
      <p>Date : ${new Date().toISOString()}</p>
      <p>Statut : <strong style="color:${info.success ? "green" : "red"}">${info.success ? "Succès" : "Échec"}</strong></p>
      <h3>Payload reçu</h3>
      ${payloadHtml}
      ${errorHtml}
    `,
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256");
  const hmacOk = verifyShopifyHmac(body, hmac);

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(body);
  } catch {
    // keep payload empty
  }

  if (!hmacOk) {
    sendDebugEmail({
      shopifyId: String(payload.id ?? "unknown"),
      payload,
      success: false,
      error: new Error(
        `HMAC verification failed — secret configured: ${!!process.env.SHOPIFY_WEBHOOK_SECRET} / received hmac: ${hmac ?? "none"}`,
      ),
    }).catch(console.error);
    return new Response("Unauthorized", { status: 401 });
  }

  let shopifyId: string;

  try {
    const rawId = payload.id ?? payload.shopifyId;
    if (!rawId) {
      return new Response("Missing product id in body", { status: 400 });
    }
    shopifyId = String(rawId).startsWith("gid://")
      ? String(rawId)
      : `gid://shopify/Product/${rawId}`;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  try {
    await syncProduct(shopifyId);
    sendDebugEmail({ shopifyId, payload, success: true }).catch(console.error);
  } catch (err) {
    console.error(`[shopify-sync] product-id sync failed (${shopifyId}):`, err);
    sendDebugEmail({ shopifyId, payload, success: false, error: err }).catch(
      console.error,
    );
    return new Response("Sync failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
