# Sanity → Next.js caching (ISR)

## What was wrong

`sanityFetch` (`web/app/sanity-api/sanity.client.ts`) used `cache: "no-store"` on every query. That meant:

- No Next.js Data Cache — every query re-fetched from Sanity on every request.
- Next.js treats any route using `no-store` as **fully dynamic** — no static generation, no ISR. Every page render was a live SSR round-trip through every Sanity query on that page.
- Vercel's CDN doesn't cache dynamic SSR responses by default, so nothing was cached anywhere in the chain.
- The `tags` already being passed to every `sanityFetch` call were dead weight — there was no cache to invalidate, and no `revalidateTag`/`revalidatePath` call anywhere in the codebase.

This didn't affect live preview/Visual Editing — that path never went through `sanityFetch` to begin with (see below).

## What changed

**1. `sanityFetch` now uses ISR** (`web/app/sanity-api/sanity.client.ts`):

```ts
return client.fetch<QueryResponse>(query, qParams, {
  next: { revalidate, tags },
});
```

- `revalidate` defaults to `3600` (1h) — a safety-net TTL, overridable per call.
- Pages are now statically rendered/cached and served from Vercel's edge instead of hitting Sanity on every request.

**2. On-demand revalidation webhook** — `web/app/api/sanity/revalidate/route.ts`:

- Sanity calls this on document publish.
- Verifies the request signature via `parseBody` from `next-sanity/webhook` (wraps `@sanity/webhook`, already a transitive dep — no new package needed).
- Calls `revalidateTag(doc._type)`, so the specific page(s) using that tag refresh immediately instead of waiting for the 1h TTL.
- A `FANOUT_TAGS` map also revalidates aggregator pages that embed other types (e.g. a `product` change also revalidates `library`; `exhibition`/`event` changes also revalidate `home`). This is a manual list, not automatic — if a new aggregator page/reference relationship is added, add it there too.

## Setup required (not done here — needs a value you choose)

1. Set `SANITY_REVALIDATE_SECRET` in `.env.local` and in Vercel env vars (any random string).
2. In Sanity → Project → API → Webhooks, add a webhook:
   - URL: `https://fhcb-preprod.vercel.app/api/sanity/revalidate`
   - Trigger: on Create/Update/Delete, all document types (or scope to the types listed in `FANOUT_TAGS`/used as tags)
   - Secret: same value as `SANITY_REVALIDATE_SECRET`
   - Payload: default (must include `_type`)

Without the secret set, the route rejects all requests (fails closed).

## Why preview still works

Every content `page.tsx` branches on `draftMode()`:

```ts
const { isEnabled } = await draftMode();
data = isEnabled
  ? await getClient({ token: ... }).fetch(QUERY, { slug })  // preview — bypasses sanityFetch entirely
  : await sanityFetch({ query: QUERY, tags: [...] });        // published — now ISR-cached
```

The preview branch never used `sanityFetch`/`no-store` — it calls `getClient({ token }).fetch()` directly (`useCdn: false`, `perspective: "previewDrafts"`, stega enabled). `draftMode()` itself forces per-request dynamic rendering regardless of any fetch cache config, so editors always see live drafts. Only the _published_ path's caching strategy changed.

## Known limitation

Cross-reference fan-out (e.g. an `artist` name changing should refresh exhibition cards that display it) isn't fully covered by tag-based revalidation — only the relationships listed in `FANOUT_TAGS` are wired up. Everything else falls back to the 1h safety-net TTL. Extend `FANOUT_TAGS` if a specific staleness case becomes a problem.
