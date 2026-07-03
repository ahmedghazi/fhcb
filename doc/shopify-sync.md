# Shopify ↔ Sanity Sync

## Routes

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/shopify/sync` | POST | HMAC | Legacy webhook entry point (kept for compatibility) |
| `/api/shopify/sync/product-id` | POST | HMAC | Sync a single product (create or update) |
| `/api/shopify/sync/products` | POST | Bearer token | Batch sync — update-only by default |

---

## `/api/shopify/sync/product-id`

Triggered by Shopify webhooks: `products/create`, `products/update`, or manually after a checkout to refresh stock.

**Auth:** `x-shopify-hmac-sha256` header (Shopify webhook signature).

**Body:** Shopify webhook payload. Must contain a top-level `id` field (numeric or full GID).

```json
{ "id": "gid://shopify/Product/15184282452354" }
```

Numeric ID is also accepted:
```json
{ "id": 15184282452354 }
```

**Behavior:** Always upserts — creates the Sanity document if it doesn't exist, updates it if it does.

---

## `/api/shopify/sync/products`

Admin-triggered batch sync. Fetches all products from Shopify and updates their Sanity documents.

**Auth:** `Authorization: Bearer <SHOPIFY_WEBHOOK_SECRET>` header.

**Query params:**

| Param | Default | Description |
|---|---|---|
| `length` | all | Limit to N products — useful for testing a subset |
| `upsert` | `false` | `true` = create missing documents (go-live import) |

**Response:**
```json
{ "synced": 42, "failed": 0, "ids": ["gid://shopify/Product/…", …] }
```

**Default behavior (`upsert=false`):** Only patches documents that already exist in Sanity. Documents deleted in Sanity will **not** be recreated. Use this for ongoing syncs.

**Go-live import (`upsert=true`):** Creates all products from Shopify, even if they don't exist in Sanity yet. Use once for the initial batch.

```bash
# Test with 5 products
curl -X POST \
  -H "Authorization: Bearer $SHOPIFY_WEBHOOK_SECRET" \
  "https://fhcb-preprod.vercel.app/api/shopify/sync/products?length=5"

# Full go-live import
curl -X POST \
  -H "Authorization: Bearer $SHOPIFY_WEBHOOK_SECRET" \
  "https://fhcb-preprod.vercel.app/api/shopify/sync/products?upsert=true"
```

---

## Localization

Products are fetched in all configured locales (see `LOCALES` in `_utils.ts`).

Default: `FR` (store default, no `@inContext`) and `EN` (`@inContext(language: EN, country: GB)`).

**Localized Sanity fields:** `title`, `text` (description), `metas[].text`, image `alt`.

**SEO fields** use the primary locale (`LOCALES[0]` = `fr`) as the source.

Adding a new locale only requires adding an entry to `LOCALES`:
```ts
{ language: "DE", country: "DE", key: "de" }
```

---

## Field mapping

| Shopify | Sanity | Notes |
|---|---|---|
| `id` | `shopifyId`, `_id` | `_id` = `shopify-product-{numericId}` |
| `handle` | `shopifyHandle`, `slug.current` | slug is `setIfMissing` |
| `title` | `title.fr / .en` | localized, `setIfMissing` |
| `descriptionHtml` | `text.fr / .en` | converted to Portable Text, `setIfMissing` |
| `priceRange.minVariantPrice` | `price` | overwritten on every sync |
| `compareAtPriceRange` | `compareAtPrice` | overwritten on every sync |
| `totalInventory` | `totalInventory`, `inStock` | overwritten on every sync |
| `variants[].selectedOptions` where name matches `/lang/i` | `languages` | used to detect variable (multi-language) products |
| `metafield custom.isbn` | `isbn` | overwritten on every sync |
| `metafield custom.editeur` | `editeur` | overwritten on every sync |
| `metafield custom.date_de_publication` | `publicationDate` | overwritten on every sync |
| `metafield custom.fiche_technique` | `metas[]` | overwritten on every sync |
| `images[0]` | `imageCover` | uploaded to Sanity, `setIfMissing` |
| `images[1…]` | `images[]` | uploaded to Sanity, `setIfMissing` |
| `auteurs` metafield / `title` | `artists[]` | matched by name against Sanity artists, `setIfMissing` |

**`synced` fields** (overwritten on every sync): `shopifyId`, `shopifyHandle`, `price`, `compareAtPrice`, `inStock`, `totalInventory`, `syncedAt`, `isbn`, `editeur`, `publicationDate`, `languages`, `metas`, `variants`.

**`initial` / editorial fields** (`setIfMissing` — set once, never overwritten): `title`, `slug`, `text`, `artists`, `seo`, `imageCover`, `images`.

---

## Shared utilities (`_utils.ts`)

| Export | Description |
|---|---|
| `getSanityClient()` | Singleton Sanity write client |
| `LOCALES` | Locale config array — add entries here to support new languages |
| `shopifyFetch(query, variables)` | Storefront API POST wrapper |
| `fetchShopifyProduct(id)` | Fetch a single product in all locales |
| `fetchShopifyProducts(opts)` | Paginated batch fetch in all locales |
| `uploadShopifyImage(url)` | Upload to Sanity (deduped by source URL) |
| `parseMetafieldList(value)` | Parse JSON array or comma-separated metafield string |
| `buildProductFields(base, localeData, artists)` | Build `synced` + `initial` Sanity document fields |
| `syncProduct(shopifyId)` | Upsert a single product |
| `syncProducts(opts)` | Batch sync with update-only / upsert modes |
| `verifyShopifyHmac(body, hmac)` | Validate Shopify webhook signature |

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SHOPIFY_DOMAIN` | Yes | Shopify store URL |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | Yes | Storefront API access token |
| `SHOPIFY_WEBHOOK_SECRET` | Yes | Used for HMAC validation and Bearer auth |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | No | Defaults to `production` |
| `SANITY_API_WRITE_TOKEN` | Yes | Sanity write token |
