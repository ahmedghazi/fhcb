import { syncProducts } from "../_utils";

/**
 * POST /api/shopify/sync/products
 *
 * Batch sync of Shopify products to Sanity (all locales).
 *
 * Query params:
 *   ?length=N   Limit to N products — useful for testing a subset.
 *               Omit for a full go-live batch.
 *
 * Auth: requires Authorization: Bearer <SHOPIFY_WEBHOOK_SECRET> header.
 *
 * Returns JSON: { synced, failed, ids }
 */
export async function POST(req: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  const auth = req.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const lengthParam = searchParams.get("length");
  const limit = lengthParam ? parseInt(lengthParam, 10) : undefined;
  const upsert = searchParams.get("upsert") === "true";
  const sortByUpdated = searchParams.get("sort") === "updated";

  if (limit !== undefined && (isNaN(limit) || limit < 1)) {
    return new Response("Invalid length param", { status: 400 });
  }

  try {
    const result = await syncProducts({ limit, upsert, sortByUpdated });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[shopify-sync] products batch sync failed:", err);
    return new Response("Sync failed", { status: 500 });
  }
}
