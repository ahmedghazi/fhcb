import { syncProducts, verifyShopifyHmac } from "./_utils";

export async function POST(req: Request) {
  const body = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256");

  if (!verifyShopifyHmac(body, hmac)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await syncProducts();
  } catch (err) {
    console.error("[shopify-sync] sync failed:", err);
    return new Response("Sync failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
