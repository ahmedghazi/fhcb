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
export async function POST(req: Request) {
  const body = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256");

  if (!verifyShopifyHmac(body, hmac)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let shopifyId: string;

  try {
    const payload = JSON.parse(body);

    // Accept either a full GID or a numeric ID
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
  } catch (err) {
    console.error(`[shopify-sync] product-id sync failed (${shopifyId}):`, err);
    return new Response("Sync failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
