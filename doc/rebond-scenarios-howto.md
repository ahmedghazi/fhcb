# How to add a new `rebond` scenario

Worked example: adding `prize-related` ("Prix liés") — 2026-08-27.

## The pieces, in order

1. **`studio/schemaTypes/documents/rebond.ts`** — add `{title: '...', value: '...-related'}` to the
   `items` list options. This is the only editor-facing surface; the value is the scenario key used
   everywhere else below.

2. **Decide the behavior pattern** (see below) and add/extend a fragment in
   **`web/app/sanity-api/fragments-rebonds.ts`**.

3. **`web/app/sanity-api/utils.ts`** — add an entry to `REBOND_SCENARIO_MATCHERS` so
   `_orderRebondsByItems` can rank the resolved card by which scenario produced it (affects display
   order only, not whether it appears).

4. **Regenerate types**: `cd studio && pnpm run typegen` (needs `schema.json` to already reflect the
   new scenario — it's derived from the schema automatically when the studio is running/built, but if
   editing by hand check `studio/schema.json` contains the new value before running typegen).

5. **`cd web && npx tsc --noEmit -p tsconfig.json`** — must be clean.

6. **Verify against real data before trusting it** — see "Verification" below. Do this *before*
   declaring done; the bug that prompted this memo passed typecheck fine and looked correct on read,
   but silently returned zero results.

## Two behavior patterns — pick the right one

- **Self/pivot pattern** (like `rebondArtistSelf`, `rebondBooks`): the host document directly
  references the candidates, or the candidates directly reference the host
  (`references(^.^._id)`). Use this when the field is a genuine "this document's own X" relationship.

- **Shared-field / tag-style pattern** (like `tags-related`, and now `prize-related`): the field
  (`tags`, `prix`) exists on *both* host and candidate as parallel taxonomy-style reference arrays, and
  the scenario should surface *other* documents that share an entry with the host — not the taxonomy
  entities themselves as cards. Only add this branch to fragments whose candidate `_type` actually has
  the field in its schema — check with `grep -rln "type: '<fieldName>'" studio/schemaTypes/` rather
  than trusting a summary/memory of which types have it: `prix` turned out to exist on
  `artist`/`exhibition`/`pageModulaire`/**and `article`** — the article one was missed on the first
  pass (a subagent's grep didn't surface it) and only caught because the user reported a specific
  missing article. Needed branches in `rebondArtistRelated`, `rebondExhibitions`, and `rebondArticles`
  in the end, not events/ressources.

Ask the user which pattern applies if the field's shape is ambiguous — it changes which fragment(s)
need touching and whether a new card component is needed at all (self/pivot patterns whose candidate
type doesn't already render as a card need a new `Card*` component + `CardType.tsx` branch +
`*Expanded` type; shared-field patterns reuse existing card types).

## The GROQ `^` hop-counting gotcha (read this before writing a shared-field branch)

Every fragment runs inside `rebondsAuto[]->{ ${rebondsResolver} }`. From directly inside the outer
`*[...]` filter's own conditions, `^.items` (1 hop) = the rebond document, `^.^` (2 hops) = the host
document — this is documented at the top of `fragments-rebonds.ts` and is correct for plain conditions
like `references(^.^._id)`.

**But** `count((field[]._ref)[@ in X])` — the `[@ in X]` array-membership filter is *itself* a new GROQ
scope, exactly like a `*[]` filter. So `X` needs **one more hop than usual**: `^.^.^` (3 hops) to reach
the host, not `^.^`. Using `^.^` there doesn't error and doesn't obviously look wrong — it silently
resolves to nothing, so the condition is always false and the scenario just returns zero results.

This bit us twice: `prize-related` was written wrong first, and the pre-existing `tags-related`
branches (in `rebondExhibitions`/`rebondEvents`/`rebondArticles`/`rebondRessources`) turned out to have
the exact same bug, undetected because no rebond had ever actually used `tags-related` with real
overlapping data. Both are now fixed to `^.^.^`.

## Verification (don't skip this)

Reading the GROQ is not enough — hop-count bugs look correct on inspection. Verify against real
content:

```bash
curl -sG "https://<projectId>.api.sanity.io/v2023-01-01/data/query/<dataset>" \
  --data-urlencode 'query=*[_id=="<host-id>"][0]{
    rebondsAuto[]->{
      items,
      "resolvedItems": <paste the exact fragment GROQ here>
    }
  }'
```

Project id / dataset are in `web/.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`,
`NEXT_PUBLIC_SANITY_DATASET`) — the content API is public-read for the published dataset, no token
needed for this kind of check.

Then confirm end-to-end in the browser: `curl localhost:3000/<the-page-slug>` and grep for the
expected candidate's name/slug (dev server must already be running).

## Files touched for `prize-related` (reference)

- `studio/schemaTypes/documents/rebond.ts` — added the scenario option.
- `web/app/sanity-api/fragments-rebonds.ts` — extended `rebondArtistRelated`, `rebondExhibitions`, and
  `rebondArticles` with a `prize-related` OR-branch (shared-field pattern); also fixed the `^.^.^` hop
  count on all `tags-related` branches in the same file.
- `web/app/sanity-api/utils.ts` — added `"prize-related"` to `REBOND_SCENARIO_MATCHERS`.
- `web/app/sanity-api/types/sanity.types.ts` — regenerated via `pnpm run typegen`.
