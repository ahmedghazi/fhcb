import { createHmac } from "crypto";
import { createClient, type SanityClient } from "@sanity/client";

let _sanity: SanityClient | null = null;
function getSanityClient(): SanityClient {
  if (!_sanity) {
    _sanity = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      token: process.env.SANITY_WRITE_TOKEN!,
      apiVersion: "2024-01-01",
      useCdn: false,
    });
  }
  return _sanity;
}

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;

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
      `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`,
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
  }

  return allProducts;
}

function mapProductToSanityDoc(p: any) {
  const numericId = p.id.split("/").pop();

  return {
    _type: "product",
    _id: `shopify-product-${numericId}`,
    shopifyId: p.id,
    shopifyHandle: p.handle,
    "title.fr": p.title,
    price: parseFloat(p.priceRange.minVariantPrice.amount),
    compareAtPrice:
      parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount ?? "0") ||
      undefined,
    inStock: (p.totalInventory ?? 0) > 0,
    totalInventory: p.totalInventory ?? 0,
    syncedAt: new Date().toISOString(),
    images: p.images.edges.map(({ node: img }: any, i: number) => ({
      _type: "image",
      _key: `img-${i}`,
      asset: { _type: "reference", _ref: img.url },
      alt: { fr: img.altText ?? "" },
    })),
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
      selectedOptions: v.selectedOptions,
    })),
  };
}

async function syncProducts() {
  const products = await fetchShopifyProducts();
  const BATCH_SIZE = 20;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const transaction = getSanityClient().transaction();
    for (const p of batch) transaction.createOrReplace(mapProductToSanityDoc(p));
    await transaction.commit();
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256");

  const digest = createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET!)
    .update(body)
    .digest("base64");

  if (digest !== hmac) {
    return new Response("Unauthorized", { status: 401 });
  }

  await syncProducts();
  return new Response("OK", { status: 200 });
}
