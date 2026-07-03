import { createHmac } from "crypto";
import { createClient, type SanityClient } from "@sanity/client";
import { descriptionHtmlToBlocks } from "../../../lib/utils";

// ─── Sanity ───────────────────────────────────────────────────────────────────

let _sanity: SanityClient | null = null;
export function getSanityClient(): SanityClient {
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

// ─── Shopify config ───────────────────────────────────────────────────────────

export const SHOPIFY_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ||
  "https://fondation-henri-cartier-bresson.myshopify.com";

const SHOPIFY_STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

// ─── Locales ──────────────────────────────────────────────────────────────────

export const LOCALES = [
  { language: "FR", country: "FR", key: "fr" },
  { language: "EN", country: "GB", key: "en" },
] as const;

export type LocaleKey = (typeof LOCALES)[number]["key"];

export type LocaleData = {
  title: string;
  descriptionHtml: string;
  category?: { id: string; name: string } | null;
};

// ─── GraphQL queries ──────────────────────────────────────────────────────────

// Full product fields (used for both batch/FR and single-product)
const PRODUCT_FULL_FIELDS = `
  id handle totalInventory
  title descriptionHtml
  category { id name }
  isbn: metafield(namespace: "custom", key: "isbn") { value }
  metas: metafield(namespace: "custom", key: "fiche_technique") { value }
  editeur: metafield(namespace: "custom", key: "editeur") { value }
  auteurs: metafield(namespace: "custom", key: "auteurs") { value }
  publicationDate: metafield(namespace: "custom", key: "date_de_publication") { value }
  langues: metafield(namespace: "custom", key: "langues") { value }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount } }
  images(first: 10) { edges { node { url altText width height } } }
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
`;

// Batch query — no @inContext, uses store default (FR)
const PRODUCTS_BATCH_QUERY = `
  query getProducts($cursor: String) {
    products(first: 50, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      edges { node { ${PRODUCT_FULL_FIELDS} } }
    }
  }
`;

// Batch locale query — only locale-sensitive fields, with @inContext
const PRODUCTS_LOCALE_BATCH_QUERY = `
  query getProductsLocale($cursor: String, $language: LanguageCode!, $country: CountryCode!)
  @inContext(language: $language, country: $country) {
    products(first: 50, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      edges { node { id title descriptionHtml category { id name } } }
    }
  }
`;

// Single product query — full data per locale
const PRODUCT_QUERY = `
  query getProduct($id: ID!, $language: LanguageCode!, $country: CountryCode!)
  @inContext(language: $language, country: $country) {
    product(id: $id) { ${PRODUCT_FULL_FIELDS} }
  }
`;

// Metaobject resolution (for langues GID references)
const METAOBJECT_QUERY = `
  query getMetaobject($id: ID!) {
    metaobject(id: $id) {
      id
      handle
      type
      fields { key value }
    }
  }
`;

// ─── Shopify fetch ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function shopifyFetch(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<any> {
  const res = await fetch(`${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

// ─── Fetch single product (all locales) ──────────────────────────────────────

export async function fetchShopifyProduct(id: string): Promise<{
  base: any;
  locale: Record<LocaleKey, LocaleData>;
}> {
  const results = await Promise.all(
    LOCALES.map(({ language, country, key }) =>
      shopifyFetch(PRODUCT_QUERY, {
        id,
        language,
        country,
      }).then((d) => ({ key, data: d.product })),
    ),
  );

  const base = results.find((r) => r.key === "fr")!.data;
  const locale = Object.fromEntries(
    results.map(({ key, data }) => [
      key,
      {
        title: data?.title ?? "",
        descriptionHtml: data?.descriptionHtml ?? "",
        category: data?.category ?? null,
      },
    ]),
  ) as Record<LocaleKey, LocaleData>;

  return { base, locale };
}

// ─── Fetch all products (paginated, all locales) ──────────────────────────────

export async function fetchShopifyProducts(
  opts: { limit?: number } = {},
): Promise<Array<{ base: any; locale: Record<LocaleKey, LocaleData> }>> {
  // 1. Fetch all products in store default locale (FR) — includes all core fields
  const frById = new Map<string, any>();
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await shopifyFetch(PRODUCTS_BATCH_QUERY, {
      cursor,
    });
    const { edges, pageInfo } = page.products;
    for (const { node } of edges) {
      frById.set(node.id, node);
    }
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
    if (opts.limit && frById.size >= opts.limit) break;
  }

  // 2. Fetch each secondary locale's title + description
  const secondaryLocales = LOCALES.slice(1);
  const localeById = new Map<LocaleKey, Map<string, LocaleData>>();

  for (const { key, language, country } of secondaryLocales) {
    const byId = new Map<string, LocaleData>();
    let lCursor: string | null = null;
    let lHasNextPage = true;

    while (lHasNextPage) {
      const page = await shopifyFetch(PRODUCTS_LOCALE_BATCH_QUERY, {
        cursor: lCursor,
        language,
        country,
      });
      const { edges, pageInfo } = page.products;
      for (const { node } of edges) {
        if (frById.has(node.id)) {
          byId.set(node.id, {
            title: node.title ?? "",
            descriptionHtml: node.descriptionHtml ?? "",
            category: node.category ?? null,
          });
        }
      }
      lHasNextPage = pageInfo.hasNextPage;
      lCursor = pageInfo.endCursor;
      if (byId.size >= frById.size) break;
    }
    localeById.set(key, byId);
  }

  const primaryKey = LOCALES[0].key;
  const products = Array.from(frById.values()).slice(0, opts.limit);

  return products.map((base) => {
    const primaryData: LocaleData = {
      title: base.title ?? "",
      descriptionHtml: base.descriptionHtml ?? "",
      category: base.category ?? null,
    };
    const locale = Object.fromEntries(
      LOCALES.map(({ key }) => [
        key,
        key === primaryKey
          ? primaryData
          : (localeById.get(key)?.get(base.id) ?? primaryData),
      ]),
    ) as Record<LocaleKey, LocaleData>;
    return { base, locale };
  });
}

// ─── Image upload ─────────────────────────────────────────────────────────────

export async function uploadShopifyImage(url: string): Promise<string> {
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

// ─── Artist matching ──────────────────────────────────────────────────────────

type ArtistRef = { _id: string; name: string };

function findArtistRefByText(
  text: string,
  artists: ArtistRef[],
): ArtistRef | undefined {
  const lower = text.toLowerCase();
  return artists.find((a) => a.name && lower.includes(a.name.toLowerCase()));
}

export function matchArtist(
  p: any,
  artists: ArtistRef[],
): ArtistRef | undefined {
  const auteurs = p.auteurs?.value;
  return (
    (auteurs && findArtistRefByText(auteurs, artists)) ||
    findArtistRefByText(p.title ?? "", artists)
  );
}

// ─── Metafield utils ──────────────────────────────────────────────────────────

export function parseMetafieldList(value: string): string[] {
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

// Resolve Shopify Metaobject GIDs to human-readable labels.
// Falls back to handle, then raw GID if the object can't be fetched.
async function resolveMetaobjectGids(gids: string[]): Promise<string[]> {
  return Promise.all(
    gids.map(async (gid) => {
      if (!gid.startsWith("gid://shopify/Metaobject/")) return gid;
      try {
        const res = await shopifyFetch(METAOBJECT_QUERY, { id: gid });
        const obj = res?.metaobject;
        if (!obj) return gid;
        const nameField = obj.fields?.find((f: any) =>
          ["name", "label", "titre", "title"].includes(f.key),
        );
        return nameField?.value ?? obj.handle ?? gid;
      } catch {
        return gid;
      }
    }),
  );
}

// ─── Build Sanity product document ───────────────────────────────────────────

/**
 * `synced` fields are owned by Shopify and overwritten on every sync.
 * `initial` fields are editorial — pre-filled from Shopify on first creation
 * (via setIfMissing) but never overwritten once an editor has set them.
 */
export async function buildProductFields(
  base: any,
  localeData: Record<LocaleKey, LocaleData>,
  artists: ArtistRef[],
) {
  const numericId = base.id.split("/").pop();
  const id = `shopify-product-${numericId}`;

  const images = await Promise.all(
    base.images.edges.map(async ({ node: img }: any, i: number) => ({
      _type: "image",
      _key: `img-${i}`,
      asset: { _type: "reference", _ref: await uploadShopifyImage(img.url) },
      alt: Object.fromEntries(LOCALES.map(({ key }) => [key, img.altText ?? ""])),
    })),
  );
  const [{ _key: _coverKey, ...imageCover } = {} as any, ...restImages] =
    images;

  const matchedArtist = matchArtist(base, artists);

  // Build localized portable text blocks from each locale's descriptionHtml
  const blocksByLocale = Object.fromEntries(
    LOCALES.map(({ key }) => [
      key,
      descriptionHtmlToBlocks(localeData[key].descriptionHtml ?? ""),
    ]),
  ) as Record<LocaleKey, any[]>;
  const primaryKey = LOCALES[0].key;
  const primaryPlain = blocksByLocale[primaryKey]
    .map((b: any) => b.children[0].text)
    .join(" ")
    .trim();

  const synced = {
    shopifyId: base.id,
    shopifyHandle: base.handle,
    price: parseFloat(base.priceRange.minVariantPrice.amount),
    compareAtPrice:
      parseFloat(base.compareAtPriceRange?.minVariantPrice?.amount ?? "0") ||
      undefined,
    inStock: (base.totalInventory ?? 0) > 0,
    totalInventory: base.totalInventory ?? 0,
    syncedAt: new Date().toISOString(),
    ...(base.isbn?.value ? { isbn: base.isbn.value } : {}),
    ...(base.editeur?.value ? { editeur: base.editeur.value } : {}),
    ...(base.publicationDate?.value
      ? { publicationDate: base.publicationDate.value.slice(0, 10) }
      : {}),
    // Fix: metafield alias is `langues`, Sanity field is `languages`.
    // GID references (gid://shopify/Metaobject/…) are resolved to labels.
    ...(base.langues?.value
      ? {
          languages: await resolveMetaobjectGids(
            parseMetafieldList(base.langues.value),
          ),
        }
      : {}),
    ...(base.metas?.value
      ? {
          metas: [
            {
              _type: "keyVal",
              _key: "fiche-technique",
              text: Object.fromEntries(LOCALES.map(({ key }) => [key, base.metas.value])),
            },
          ],
        }
      : {}),
    variants: base.variants.edges.map(({ node: v }: any) => ({
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
    title: Object.fromEntries(LOCALES.map(({ key }) => [key, localeData[key].title])),
    slug: { _type: "slug", current: base.handle },
    text: Object.fromEntries(LOCALES.map(({ key }) => [key, blocksByLocale[key]])),
    ...(matchedArtist
      ? {
          artists: [
            {
              _type: "reference",
              _key: matchedArtist._id,
              _ref: matchedArtist._id,
            },
          ],
        }
      : {}),
    seo: {
      metaTitle: localeData[primaryKey].title,
      ...(primaryPlain ? { metaDescription: primaryPlain.slice(0, 155) } : {}),
      ...(imageCover._type
        ? { metaImage: { _type: "image", asset: imageCover.asset } }
        : {}),
    },
    ...(imageCover._type ? { imageCover } : {}),
    images: restImages,
  };

  return { id, synced, initial };
}

// ─── Sync all products ────────────────────────────────────────────────────────

export async function syncProducts(opts: { limit?: number } = {}): Promise<{
  synced: number;
  failed: number;
  ids: string[];
}> {
  const products = await fetchShopifyProducts(opts);
  const artists: ArtistRef[] = await getSanityClient().fetch(
    `*[_type == "artist" && defined(name)]{ _id, name }`,
  );

  const BATCH_SIZE = 20;
  let synced = 0;
  let failed = 0;
  const ids: string[] = [];

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const transaction = getSanityClient().transaction();
    let queued = 0;

    for (const { base, locale } of batch) {
      try {
        const { id, synced: s, initial } = await buildProductFields(
          base,
          locale,
          artists,
        );
        transaction
          .createIfNotExists({ _type: "product", _id: id, ...initial, ...s })
          .patch(id, { set: s, setIfMissing: initial });
        ids.push(base.id);
        queued++;
      } catch (err) {
        failed++;
        console.error(
          `[shopify-sync] failed to map product ${base.handle}:`,
          err,
        );
      }
    }

    if (queued > 0) {
      await transaction.commit();
      synced += queued;
    }
  }

  if (failed > 0)
    console.error(`[shopify-sync] ${failed} product(s) failed to sync`);

  return { synced, failed, ids };
}

// ─── Sync single product ──────────────────────────────────────────────────────

export async function syncProduct(shopifyId: string): Promise<void> {
  const artists: ArtistRef[] = await getSanityClient().fetch(
    `*[_type == "artist" && defined(name)]{ _id, name }`,
  );

  const { base, locale } = await fetchShopifyProduct(shopifyId);
  if (!base) throw new Error(`Product not found in Shopify: ${shopifyId}`);

  const { id, synced, initial } = await buildProductFields(base, locale, artists);

  await getSanityClient()
    .transaction()
    .createIfNotExists({ _type: "product", _id: id, ...initial, ...synced })
    .patch(id, { set: synced, setIfMissing: initial })
    .commit();
}

// ─── HMAC validation ──────────────────────────────────────────────────────────

export function verifyShopifyHmac(
  body: string,
  hmac: string | null,
): boolean {
  const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[shopify-sync] SHOPIFY_WEBHOOK_SECRET is not configured");
    return false;
  }
  const digest = createHmac("sha256", webhookSecret)
    .update(body)
    .digest("base64");
  return !!hmac && digest === hmac;
}
