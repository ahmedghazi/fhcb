import { createHmac } from "crypto";
import { createClient, type SanityClient } from "@sanity/client";
import { descriptionHtmlToBlocks } from "../../../lib/utils";

let _sanity: SanityClient | null = null;
function getSanityClient(): SanityClient {
  if (!_sanity) {
    _sanity = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      token: process.env.SANITY_API_WRITE_TOKEN!,
      apiVersion: "2024-01-01",
      useCdn: false,
    });
  }
  return _sanity;
}

const SHOPIFY_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ||
  "https://fondation-henri-cartier-bresson.myshopify.com";
const SHOPIFY_STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;
const DEBUG_SYNC = process.env.SHOPIFY_SYNC_DEBUG === "true";
const DEBUG_LIMIT = 3;

const PRODUCTS_QUERY = `
  query getProducts($cursor: String) {
    products(first: 50, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          handle
          title
          descriptionHtml
          totalInventory
          isbn: metafield(namespace: "custom", key: "isbn") {
            value
          }
          metas: metafield(namespace: "custom", key: "fiche_technique") {
            value
          }
          editeur: metafield(namespace: "custom", key: "editeur") {
            value
          }
          auteurs: metafield(namespace: "custom", key: "auteurs") {
            value
          }
          publicationDate: metafield(namespace: "custom", key: "date_de_publication") {
            value
          }
          languages: metafield(namespace: "custom", key: "languages") {
            value
          }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount }
          }
          images(first: 10) {
            edges {
              node { url altText width height }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id title sku availableForSale
                price { amount }
                compareAtPrice { amount }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`;

async function fetchShopifyProducts() {
  const allProducts: any[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const res: Response = await fetch(
      `${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({ query: PRODUCTS_QUERY, variables: { cursor } }),
      },
    );

    if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);

    const { data, errors } = await res.json();
    if (errors) throw new Error(JSON.stringify(errors));

    const { edges, pageInfo } = data.products;
    allProducts.push(...edges.map((e: any) => e.node));

    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;

    if (DEBUG_SYNC && allProducts.length >= DEBUG_LIMIT) break;
  }
  // const allProductsWithISBN = allProducts.filter((p) => p.isbn?.value);
  // return DEBUG_SYNC
  //   ? allProductsWithISBN.slice(0, DEBUG_LIMIT)
  //   : allProductsWithISBN;
  return DEBUG_SYNC ? allProducts.slice(0, DEBUG_LIMIT) : allProducts;
}

async function uploadShopifyImage(url: string): Promise<string> {
  const client = getSanityClient();

  const existingId: string | null = await client.fetch(
    `*[_type == "sanity.imageAsset" && source.id == $url][0]._id`,
    { url },
  );
  if (existingId) return existingId;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  const asset = await client.assets.upload("image", buffer, {
    filename: url.split("/").pop()?.split("?")[0],
    source: { name: "shopify", id: url },
  });
  return asset._id;
}

type ArtistRef = { _id: string; name: string };

function findArtistRefByText(text: string, artists: ArtistRef[]) {
  const lower = text.toLowerCase();
  return artists.find((a) => a.name && lower.includes(a.name.toLowerCase()));
}

function matchArtist(p: any, artists: ArtistRef[]) {
  const auteurs = p.auteurs?.value;
  return (
    (auteurs && findArtistRefByText(auteurs, artists)) ||
    findArtistRefByText(p.title, artists)
  );
}

function parseMetafieldList(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // not JSON — fall back to comma-separated string
  }
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * `synced` fields are owned by Shopify and overwritten on every sync.
 * `initial` fields are editorial — pre-filled from Shopify on first creation
 * (via setIfMissing) but never overwritten once an editor has set them.
 */
async function buildProductFields(p: any, artists: ArtistRef[]) {
  const numericId = p.id.split("/").pop();
  const id = `shopify-product-${numericId}`;

  const images = await Promise.all(
    p.images.edges.map(async ({ node: img }: any, i: number) => ({
      _type: "image",
      _key: `img-${i}`,
      asset: { _type: "reference", _ref: await uploadShopifyImage(img.url) },
      alt: { fr: img.altText ?? "" },
    })),
  );
  const [{ _key: _coverKey, ...imageCover } = {}, ...restImages] = images;

  const matchedArtist = matchArtist(p, artists);

  const descriptionBlocks = descriptionHtmlToBlocks(p.descriptionHtml ?? "");
  const plainDescription = descriptionBlocks
    .map((b) => b.children[0].text)
    .join(" ")
    .trim();

  const synced = {
    shopifyId: p.id,
    shopifyHandle: p.handle,
    price: parseFloat(p.priceRange.minVariantPrice.amount),
    compareAtPrice:
      parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount ?? "0") ||
      undefined,
    inStock: (p.totalInventory ?? 0) > 0,
    totalInventory: p.totalInventory ?? 0,
    syncedAt: new Date().toISOString(),
    ...(p.isbn?.value ? { isbn: p.isbn.value } : {}),
    ...(p.editeur?.value ? { editeur: p.editeur.value } : {}),
    ...(p.publicationDate?.value
      ? { publicationDate: p.publicationDate.value.slice(0, 10) }
      : {}),
    ...(p.languages?.value
      ? { languages: parseMetafieldList(p.languages.value) }
      : {}),
    ...(p.metas?.value
      ? {
          metas: [
            {
              _type: "keyVal",
              _key: "fiche-technique",
              text: { fr: p.metas.value },
            },
          ],
        }
      : {}),
    variants: p.variants.edges.map(({ node: v }: any) => ({
      _type: "productVariant",
      _key: v.id.split("/").pop(),
      shopifyVariantId: v.id,
      title: v.title,
      sku: v.sku,
      price: parseFloat(v.price.amount),
      compareAtPrice: v.compareAtPrice
        ? parseFloat(v.compareAtPrice.amount)
        : undefined,
      inStock: v.availableForSale,
      selectedOptions: v.selectedOptions.map((o: any, i: number) => ({
        _key: `option-${i}`,
        ...o,
      })),
    })),
  };

  const initial = {
    title: { fr: p.title },
    slug: { _type: "slug", current: p.handle },
    text: { fr: descriptionBlocks },
    ...(matchedArtist
      ? { artist: { _type: "reference", _ref: matchedArtist._id } }
      : {}),
    seo: {
      metaTitle: p.title,
      ...(plainDescription
        ? { metaDescription: plainDescription.slice(0, 155) }
        : {}),
      ...(imageCover._type
        ? { metaImage: { _type: "image", asset: imageCover.asset } }
        : {}),
    },
    ...(imageCover._type ? { imageCover } : {}),
    images: restImages,
  };

  return { id, synced, initial };
}

async function syncProducts() {
  const products = await fetchShopifyProducts();
  const artists: ArtistRef[] = await getSanityClient().fetch(
    `*[_type == "artist" && defined(name)]{ _id, name }`,
  );
  const BATCH_SIZE = 20;

  let failed = 0;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const transaction = getSanityClient().transaction();
    let queued = 0;

    for (const p of batch) {
      try {
        const { id, synced, initial } = await buildProductFields(p, artists);
        transaction
          .createIfNotExists({
            _type: "product",
            _id: id,
            ...initial,
            ...synced,
          })
          .patch(id, { set: synced, setIfMissing: initial });
        queued++;
      } catch (err) {
        failed++;
        console.error(`[shopify-sync] failed to map product ${p.handle}:`, err);
      }
    }

    if (queued > 0) await transaction.commit();
  }

  if (failed > 0)
    console.error(`[shopify-sync] ${failed} product(s) failed to sync`);
}

export async function POST(req: Request) {
  const body = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256");
  const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[shopify-sync] SHOPIFY_WEBHOOK_SECRET is not configured");
    return new Response("Server misconfigured", { status: 500 });
  }

  const digest = createHmac("sha256", webhookSecret)
    .update(body)
    .digest("base64");

  if (!hmac || digest !== hmac) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await syncProducts();
    // const products = await fetchShopifyProducts();
    // return new Response(
    //   JSON.stringify({
    //     total: products.length,
    //     products: products,
    //   }),
    // );
  } catch (err) {
    console.error("[shopify-sync] sync failed:", err);
    return new Response("Sync failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
