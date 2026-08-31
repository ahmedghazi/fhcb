import {
  cardRefArticle,
  cardRefArtist,
  cardRefEvent,
  cardRefExhibition,
  cardRefPageModulaire,
  cardRefProduct,
  cardTypesRessources,
} from "./fragments-cards";

/*****************************************************************************************************
 * Fragments used to resolve a `rebond` document's `items` (see studio/schemaTypes/documents/rebond.ts).
 * Called from inside a `rebondsAuto[]->{ ${rebondsResolver} }` projection (each host document has an
 * array of `rebond` references, rendered as one auto block each — see rebondsAutoField.ts), so `^.^` is
 * the host document (artist, exhibition, event, product, feuilletage, pageModulaire, ...) — one hop for
 * the `->` dereference, one more for the nested `*[]` filter itself. `^.items` is the `rebond` document's own
 * `items` array (one hop, since each fragment's `*[]` filter is itself a new scope — bare `items`
 * inside it would wrongly resolve to the *candidate* document's own field, which doesn't exist on
 * product/exhibition/etc. and silently matches nothing). See relatedByArtist / relatedByExhibition in
 * fragments.ts for the single-hop version of this same `references(^._id)` pattern used elsewhere.
 *
 * Grouped by TARGET DOCUMENT TYPE rather than by `items` scenario: each scenario is gated inline as
 * `"scenario-key" in ^.items && ...` within a single filter per type, so every card shape (artist,
 * product, exhibition, event, article, ressources) appears exactly once in the generated union —
 * concatenating N `select(cond => bigUnion, [])` branches per scenario (one per type-shape, repeated
 * per near-duplicate scenario) blew the TS union up combinatorially and produced a multi-million-line
 * sanity.types.ts / OOM'd `sanity typegen generate` even at an 8GB heap.
 *
 * Naming of `items` values mirrors: `<doc>[-related][-futur|-past]` — "related" filters to the host
 * document, "futur"/"past" filters by date; either qualifier is optional.
 */

// scenarios: "docs-hcb-related" / "docs-mf-related" — everything connected to one specific founding
// artist (Henri Cartier-Bresson / Martine Franck), picked by slug rather than by reference so editors
// don't need to hold the artist document's _id. Unlike "artist-related" (pivots on the HOST's own
// artist(s)), this pivots on a fixed artist regardless of what the host document is — usable on any
// page to pull in "everything about HCB/MF" specifically. \`references()\` checks the whole candidate
// document for a match, so this works across every type-shape fragment below without needing to name
// each one's \`artists[]\` field individually.
const HCB_ARTIST_ID = `*[_type == "artist" && slug.current == "henri-cartier-bresson"][0]._id`;
const MF_ARTIST_ID = `*[_type == "artist" && slug.current == "martine-franck"][0]._id`;

// scenario: "page-branche-ressources" — same fixed-pivot idea as HCB_ARTIST_ID/MF_ARTIST_ID above,
// but for the "branches ressources" tag (studio/schemaTypes/documents/pageModulaire.ts also hardcodes
// this same tag's _id, as BRANCHES_RESSOURCES_TAG_ID, to toggle imageCover/videoCover visibility) —
// picked by slug so editors don't need to hold the tag document's _id. This tag is only ever put on
// the 4 "branche" landing pageModulaire docs (images, feuilletages, focus, paroles).
const BRANCHES_RESSOURCES_TAG_ID = `*[_type == "tag" && slug.current == "branches-ressources"][0]._id`;

// "docs-hcb-related" / "docs-mf-related" are capped per type-shape (2 each) rather than folded as an
// OR branch into the shared rebondBooks/rebondExhibitions/rebondEvents/rebondArticles/rebondRessources
// filters below — same reasoning as rebondExhibitionsByArtist's [0...4] cap further down: the cap must
// apply only to THIS scenario's own matches, not to the combined result of every scenario sharing that
// type-shape (e.g. picking both "exhibition-related" and "docs-hcb-related" shouldn't let the cap on
// one scenario limit the other). One literal fragment per (type, artist) pair below — NOT generated via
// a helper function: \`sanity typegen\`'s query extractor statically inlines top-level \`const\` string
// bindings, it doesn't evaluate function calls, so a parametrized helper fails with "Could not find
// binding for node" for the function's own parameters.
const DOCS_RELATED_CAP = 2;

// "prize-related" is capped per type-shape (2 each), same reasoning as DOCS_RELATED_CAP above: pulled
// out into its own fragment per type rather than left as an OR branch inside the shared
// rebondArtistRelated/rebondExhibitions/rebondArticles filters, so the cap applies only to THIS
// scenario's own matches (e.g. combining "prize-related" with "tags-related" on the same exhibition
// filter shouldn't let one scenario's cap constrain the other).
const PRIZE_RELATED_CAP = 2;

// scenario: "artist" (self, via host's \`artists[]\`) — also fires for "artist-related": editors expect
// artist-related to include the host's own artist(s) directly (e.g. a book's own listed artist), not
// only other, separately-connected artists (that part is rebondArtistRelated below). Kept as its own
// fragment rather than merged into rebondArtistRelated's filter: merging them into one OR'd filter
// makes the whole filter's inferred type collapse to \`never\` on host types without an \`artists\` field
// (e.g. artist itself), which then poisons the entire concatenated resolvedItems type. Two same-shape
// arrays concatenated with \`+\` don't have that problem — an invalid/never operand is just dropped
// from the union. rebondArtistRelated excludes the host's own artist(s) from its own results, so
// there's no duplicate card when both scenarios are selected together.
// "product-related" — the artist(s) of the host's own linked `product` (e.g. a feuilletage's
// `product` field, see studio/schemaTypes/documents/feuilletage.ts) — pivots through that reference
// rather than the host's own `artists[]` field, unlike the "artist"/"artist-related" branch above.
export const rebondArtistSelf = `
  *[
    _type == "artist" &&
    _id != ^.^._id &&
    (
      (("artist" in ^.items || "artist-related" in ^.items) && _id in ^.^.artists[]._ref)
      || ("product-related" in ^.items && _id in ^.^.product->artists[]._ref)
    )
  ] {
    ${cardRefArtist}
  }
`;

// scenario: "artist-related" — other artists appearing in content genuinely tied to the host's own
// artist(s). Pivots on the host's ARTIST (coalesce(^.^.^.artists[]._ref, [^.^.^._id]) — falls back to
// the host's own _id when it has no \`artists\` field, i.e. the host IS an artist), not the host
// DOCUMENT's own _id: every content type (product, feuilletage, imageImages, serieThematique,
// conversation, event, pageModulaire...) has a generic, editor-curated "see also" \`rebonds\` reference
// field, so "anything referencing this host document" catches unrelated cross-links through that field
// (e.g. one feuilletage manually linked to another via \`rebonds\`, no shared artist at all) — pivoting
// on the artist instead only matches through a REAL editorial connection (shared conversation, book,
// resource, etc). Excludes "exhibition" and "event" from the candidate type list: cross-exhibition
// links and generic multi-exhibition events (guided tours, etc.) are both too weak/noisy a signal.
// The exclusion of the host's OWN artist(s) from the result must go through the same coalesce() —
// comparing directly against ^.^._id (the host DOCUMENT's id) never matches an artist's _id.
export const rebondArtistRelated = `
  *[
    _type == "artist" &&
    !(_id in coalesce(^.^.artists[]._ref, [^.^._id])) &&
    "artist-related" in ^.items && _id in *[
      _type in ["product", "feuilletage", "imageImages", "serieThematique", "conversation"] &&
      references(coalesce(^.^.^.artists[]._ref, [^.^.^._id]))
    ].artists[]._ref
  ] | order(name asc) {
    ${cardRefArtist}
  }
`;

// "prize-related" — other artists sharing a \`prix\` with the host, capped (see PRIZE_RELATED_CAP
// above) — same idea as "tags-related" in rebondExhibitions/rebondEvents/rebondArticles/rebondRessources
// below, but \`prix\` is only a field on artist/exhibition/pageModulaire (see
// studio/schemaTypes/documents/prix.ts), so it only applies here (candidate _type == "artist") and in
// rebondExhibitionsPrizeRelated/rebondArticlesPrizeRelated, not in every "-related" fragment.
// NB the extra \`^\` in \`^.^.^.prix\`: the \`[@ in ...]\` array-membership filter is its own scope, same as
// any \`*[]\` filter (see the file-level comment above on hop counting), so reaching the host from inside
// it needs one more hop than the surrounding \`*[]\` filter's own conditions (which only need \`^.^\`).
export const rebondArtistPrizeRelated = `
  *[
    _type == "artist" &&
    !(_id in coalesce(^.^.artists[]._ref, [^.^._id])) &&
    "prize-related" in ^.items &&
    count((prix[]._ref)[@ in ^.^.^.prix[]._ref]) > 0
  ] | order(name asc) [0...${PRIZE_RELATED_CAP}] {
    ${cardRefArtist}
  }
`;

// scenarios: "book-related" — books directly linked to the host (via product.exhibition, etc.), not
// broadened via the host's artist(s): otherwise a prolific artist's entire catalog shows up instead
// of just the book tied to this specific exhibition/content. Exception: a pageModulaire whose whole
// purpose is representing an artist (e.g. a tribute page with no exhibition/event of its own to
// distinguish itself from) has nothing that would ever reference it directly — broadened via its own
// \`artists[]\` there instead (added specifically for that case, see pageModulaire.ts's \`artists\` field).
//
// Checks the candidate product's own \`exhibition\` and \`rebonds[]\` fields rather than a blanket
// \`references(^.^._id)\` — a blanket scan also matches incidental references like
// \`modules[].sidebar.products\` (product pages have the same \`modules\`/sidebarGenerique shape as
// resources), which has no editorial "these books are related" meaning. \`exhibition\` covers the
// "via product.exhibition" case named above (host is the exhibition); \`rebonds\` covers a book curated
// as related to another book/event/pageModulaire host.
// "product-related" — the host's own linked \`product\` itself (e.g. a feuilletage's embedded book,
// see studio/schemaTypes/documents/feuilletage.ts), displayed as a card in its own right.
export const rebondBooks = `
  *[
    _type == "product" &&
    _id != ^.^._id &&
    (
      ("book-related" in ^.items && (exhibition._ref == ^.^._id || ^.^._id in rebonds[]._ref || (^.^._type == "pageModulaire" && references(^.^.artists[]._ref))))
      || ("product-related" in ^.items && _id == ^.^.product._ref)
    )
  ] | order(_createdAt desc) {
    ${cardRefProduct}
  }
`;

// "docs-hcb-related" / "docs-mf-related" — books tied to that fixed artist, capped (see
// DOCS_RELATED_CAP above).
export const rebondBooksHcb = `
  *[
    _type == "product" &&
    _id != ^.^._id &&
    "docs-hcb-related" in ^.items &&
    references(${HCB_ARTIST_ID})
  ] | order(_createdAt desc) [0...${DOCS_RELATED_CAP}] {
    ${cardRefProduct}
  }
`;
export const rebondBooksMf = `
  *[
    _type == "product" &&
    _id != ^.^._id &&
    "docs-mf-related" in ^.items &&
    references(${MF_ARTIST_ID})
  ] | order(_createdAt desc) [0...${DOCS_RELATED_CAP}] {
    ${cardRefProduct}
  }
`;

// A date range counts as "at the Foundation" the same way isInSiteLocationType (app/lib/utils.ts) and
// the cron job's `isCurrent` (app/api/cron/update-exhibition-tags/route.ts) treat it: absent
// locationType counts as in-site (backward compat with the old inSite boolean field). "futur"/"current"
// scenarios must only count in-site dates — an itinerant/hors-les-murs leg shouldn't make an exhibition
// show up as "upcoming at the Foundation" (e.g. Les Européens touring after its Foundation run ends is
// NOT an upcoming Foundation show). "past" scenarios are intentionally left location-agnostic: whether
// the whole exhibition's run has ended doesn't depend on where any one leg of it took place.
const IN_SITE_DATE = `(!defined(locationType) || locationType in ["inSite", "inSite-cube", "inSite-tube"])`;

// scenario: "exhibition-current-or-futur" (global, any exhibition) — currently-running exhibitions if
// any exist anywhere at the Foundation, else upcoming ones; never both together (a block shouldn't mix
// a show that's already open with one that hasn't opened yet — pick one state and stick to it). Exported
// so any other GROQ query needing this same "what's on / what's next" rule (e.g. a listing page, not
// just rebondsResolver below) reuses this exact condition instead of reimplementing the fallback.
export const EXHIBITION_CURRENT_OR_FUTUR = `
  select(
    count(*[_type == "exhibition" && count(dates[du <= now() && coalesce(au, du) >= now() && ${IN_SITE_DATE}]) > 0]) > 0 =>
      count(dates[du <= now() && coalesce(au, du) >= now() && ${IN_SITE_DATE}]) > 0,
    count(dates[coalesce(au, du) >= now() && ${IN_SITE_DATE}]) > 0
  )
`;

// scenarios: "exhibition-related", "exhibition-related-current-or-futur", "exhibition-related-past" (filtered to
// the host), "exhibition-futur", "exhibition-past", "exhibition-current", "exhibition-current-or-futur" (global,
// any exhibition), "tags-related" (any exhibition sharing a tag with the host), "prize-related" (any
// exhibition sharing a `prix` with the host — see rebondArtistRelated above for why only artist/exhibition
// carry this branch), and "product-related" (the exhibition of the host's own linked `product`)
// NB: \`au\` (end date) is intentionally left blank for single-day exhibitions/events (see
// studio/schemaTypes/objects/fhcbDate.ts) — always fall back to \`du\` via coalesce(), otherwise
// single-day entries never match "futur" (au undefined >= now() is false) and always match "past".
export const rebondExhibitions = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    (
      ("exhibition-related" in ^.items && (references(^.^._id) || references(^.^.artists[]._ref)))
      || ("exhibition-related-current-or-futur" in ^.items && (references(^.^._id) || references(^.^.artists[]._ref)) && count(dates[coalesce(au, du) >= now() && ${IN_SITE_DATE}]) > 0)
      || ("exhibition-related-past" in ^.items && (references(^.^._id) || references(^.^.artists[]._ref)) && count(dates[coalesce(au, du) >= now()]) == 0)
      || ("exhibition-futur" in ^.items && count(dates[coalesce(au, du) >= now() && ${IN_SITE_DATE}]) > 0)
      || ("exhibition-past" in ^.items && count(dates[coalesce(au, du) >= now()]) == 0)
      || ("exhibition-current" in ^.items && count(dates[du <= now() && coalesce(au, du) >= now() && ${IN_SITE_DATE}]) > 0)
      || ("exhibition-current-or-futur" in ^.items && ${EXHIBITION_CURRENT_OR_FUTUR})
      || ("tags-related" in ^.items && count((tags[]._ref)[@ in ^.^.^.tags[]._ref]) > 0)
      || ("product-related" in ^.items && defined(^.^.product) && _id == ^.^.product->exhibition._ref)
    )
  ] | order(dates[0].du desc) {
    ${cardRefExhibition}
  }
`;

// "docs-hcb-related" / "docs-mf-related" — exhibitions tied to that fixed artist, capped (see
// DOCS_RELATED_CAP above).
export const rebondExhibitionsHcb = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    "docs-hcb-related" in ^.items &&
    references(${HCB_ARTIST_ID})
  ] | order(dates[0].du desc) [0...${DOCS_RELATED_CAP}] {
    ${cardRefExhibition}
  }
`;
export const rebondExhibitionsMf = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    "docs-mf-related" in ^.items &&
    references(${MF_ARTIST_ID})
  ] | order(dates[0].du desc) [0...${DOCS_RELATED_CAP}] {
    ${cardRefExhibition}
  }
`;

// scenario: "exhibition-related-by-artist" — other exhibitions featuring the same artist(s) as the
// host, capped at 4. Kept as its own fragment rather than folded into rebondExhibitions' OR branches
// above: the [0...4] cap needs to apply only to this scenario's own matches, not to the combined
// result of every exhibition scenario selected at once.
export const rebondExhibitionsByArtist = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    "exhibition-related-by-artist" in ^.items &&
    references(^.^.artists[]._ref)
  ] | order(dates[0].du desc) [0...4] {
    ${cardRefExhibition}
  }
`;

// "prize-related" — other exhibitions sharing a \`prix\` with the host, capped (see
// PRIZE_RELATED_CAP above; see rebondArtistPrizeRelated for why this is its own fragment).
export const rebondExhibitionsPrizeRelated = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    "prize-related" in ^.items &&
    count((prix[]._ref)[@ in ^.^.^.prix[]._ref]) > 0
  ] | order(dates[0].du desc) [0...${PRIZE_RELATED_CAP}] {
    ${cardRefExhibition}
  }
`;

// scenarios: "event-related-current-or-futur" (filtered to the host), "event-futur" (global, any event),
// "tags-related" (any event sharing a tag with the host), and "product-related" (events tied to the same
// exhibition as the host's own linked `product`)
export const rebondEvents = `
  *[
    _type == "event" &&
    _id != ^.^._id &&
    (
      ("event-related-current-or-futur" in ^.items && (references(^.^._id) || references(^.^.artists[]._ref)) && count(dates[coalesce(au, du) >= now()]) > 0)
      || ("event-futur" in ^.items && count(dates[coalesce(au, du) >= now()]) > 0)
      || ("tags-related" in ^.items && count((tags[]._ref)[@ in ^.^.^.tags[]._ref]) > 0)
      || ("product-related" in ^.items && defined(^.^.product->exhibition._ref) && exhibition._ref == ^.^.product->exhibition._ref)
    )
  ] | order(dates[0].du asc) {
    ${cardRefEvent}
  }
`;

// "docs-hcb-related" / "docs-mf-related" — events tied to that fixed artist, capped (see
// DOCS_RELATED_CAP above).
export const rebondEventsHcb = `
  *[
    _type == "event" &&
    _id != ^.^._id &&
    "docs-hcb-related" in ^.items &&
    references(${HCB_ARTIST_ID})
  ] | order(dates[0].du asc) [0...${DOCS_RELATED_CAP}] {
    ${cardRefEvent}
  }
`;
export const rebondEventsMf = `
  *[
    _type == "event" &&
    _id != ^.^._id &&
    "docs-mf-related" in ^.items &&
    references(${MF_ARTIST_ID})
  ] | order(dates[0].du asc) [0...${DOCS_RELATED_CAP}] {
    ${cardRefEvent}
  }
`;

// scenario: "exhibition-discover-past" — Block 2 ("À découvrir aussi") for exhibitions: past
// exhibitions, prioritizing ones sharing an artist with the host, backfilled with others. GROQ has no
// random() — `isSameArtist` is computed here so the priority split can happen deterministically, and
// the actual random shuffle-then-cap(2) happens in JS (see _pickWithPriorityFill in app/lib/utils.ts),
// mirroring getRandomArtists' fetch-a-pool-then-shuffle pattern. Capped at 12 candidates so the pool
// stays small regardless of how many past exhibitions exist.
export const rebondExhibitionsDiscoverPast = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    "exhibition-discover-past" in ^.items &&
    count(dates[coalesce(au, du) >= now()]) == 0
  ] {
    ${cardRefExhibition},
    "isSameArtist": count(artists[@._ref in ^.^.artists[]._ref]) > 0
  } | order(isSameArtist desc, dates[0].du desc) [0...12]
`;

// scenario: "exhibition-discover-current-or-futur" — Block 2 ("À découvrir en ce moment") for pages
// with no natural relation to a specific exhibition (e.g. the "Missions" / Tarifs / Accès pages): any
// exhibition currently on or about to open AT THE FOUNDATION — hors-les-murs/itinerant legs don't
// count (see IN_SITE_DATE above), even for an exhibition that also has an in-site run. Random-filled,
// capped at 2, via JS shuffle (see _shuffle in app/lib/utils.ts) since GROQ has no random().
export const rebondExhibitionsDiscoverCurrent = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    "exhibition-discover-current-or-futur" in ^.items &&
    count(dates[coalesce(au, du) >= now() && ${IN_SITE_DATE}]) > 0
  ] {
    ${cardRefExhibition}
  } | order(dates[0].du asc) [0...12]
`;

// scenarios: "articles-related" — articles directly linked to the host, not broadened via the host's
// artist(s), except for a pageModulaire artist page (see rebondBooks above for why) — and
// "tags-related" — articles sharing a tag with the host.
export const rebondArticles = `
  *[
    _type == "article" &&
    _id != ^.^._id &&
    (
      ("articles-related" in ^.items && (references(^.^._id) || (^.^._type == "pageModulaire" && references(^.^.artists[]._ref))))
      || ("tags-related" in ^.items && count((tags[]._ref)[@ in ^.^.^.tags[]._ref]) > 0)
    )
  ] | order(_createdAt desc) {
    ${cardRefArticle}
  }
`;

// "docs-hcb-related" / "docs-mf-related" — articles tied to that fixed artist, capped (see
// DOCS_RELATED_CAP above).
export const rebondArticlesHcb = `
  *[
    _type == "article" &&
    _id != ^.^._id &&
    "docs-hcb-related" in ^.items &&
    references(${HCB_ARTIST_ID})
  ] | order(_createdAt desc) [0...${DOCS_RELATED_CAP}] {
    ${cardRefArticle}
  }
`;
export const rebondArticlesMf = `
  *[
    _type == "article" &&
    _id != ^.^._id &&
    "docs-mf-related" in ^.items &&
    references(${MF_ARTIST_ID})
  ] | order(_createdAt desc) [0...${DOCS_RELATED_CAP}] {
    ${cardRefArticle}
  }
`;

// "prize-related" — other articles sharing a \`prix\` with the host (article also carries a \`prix\`
// field, alongside artist/exhibition/pageModulaire — see studio/schemaTypes/documents/article.ts),
// capped (see PRIZE_RELATED_CAP above; see rebondArtistPrizeRelated for why this is its own fragment).
export const rebondArticlesPrizeRelated = `
  *[
    _type == "article" &&
    _id != ^.^._id &&
    "prize-related" in ^.items &&
    count((prix[]._ref)[@ in ^.^.^.prix[]._ref]) > 0
  ] | order(_createdAt desc) [0...${PRIZE_RELATED_CAP}] {
    ${cardRefArticle}
  }
`;

// scenarios: "ressources-related" — imageImages / feuilletage / serieThematique / conversation
// directly linked to the host, not broadened via the host's artist(s), except for a pageModulaire
// artist page (see rebondBooks above for why) — and "tags-related" — feuilletage / conversation
// sharing a tag with the host (imageImages / serieThematique have no \`tags\` field, so
// \`tags[]._ref\` is empty for them and this branch never matches those two).
//
// NB: the "ressources-related" branch checks the candidate's own \`exhibition\`/\`rebonds[]\` fields
// rather than a blanket \`references(^.^._id)\`. A blanket scan also matches incidental, non-editorial
// references buried elsewhere in the candidate's document — e.g. \`modules[].sidebar.products\` (see
// studio/schemaTypes/objects/sidebarGenerique.ts), a "shop this product" cross-sell widget with no
// relation to "this resource is about that book" — which is what let an unrelated feuilletage show up
// as "related" on a product page it merely cross-sold from a sidebar. \`exhibition\` covers the (most
// common) case of the host being the exhibition a resource belongs to; \`rebonds\` covers a resource
// curated as related to a product/pageModulaire/event host directly.
export const rebondRessources = `
  *[
    _id != ^.^._id &&
    _type in ["imageImages", "feuilletage", "serieThematique", "conversation"] &&
    (
      ("ressources-related" in ^.items && (exhibition._ref == ^.^._id || ^.^._id in rebonds[]._ref || (^.^._type == "pageModulaire" && references(^.^.artists[]._ref))))
      || ("tags-related" in ^.items && count((tags[]._ref)[@ in ^.^.^.tags[]._ref]) > 0)
    )
  ] | order(_createdAt desc) {
    ${cardTypesRessources}
  }
`;

// "docs-hcb-related" / "docs-mf-related" — imageImages / feuilletage / serieThematique / conversation
// tied to that fixed artist, capped (see DOCS_RELATED_CAP above); all four types have an
// \`artists[]\` field.
export const rebondRessourcesHcb = `
  *[
    _id != ^.^._id &&
    _type in ["imageImages", "feuilletage", "serieThematique", "conversation"] &&
    "docs-hcb-related" in ^.items &&
    references(${HCB_ARTIST_ID})
  ] | order(_createdAt desc) [0...${DOCS_RELATED_CAP}] {
    ${cardTypesRessources}
  }
`;
export const rebondRessourcesMf = `
  *[
    _id != ^.^._id &&
    _type in ["imageImages", "feuilletage", "serieThematique", "conversation"] &&
    "docs-mf-related" in ^.items &&
    references(${MF_ARTIST_ID})
  ] | order(_createdAt desc) [0...${DOCS_RELATED_CAP}] {
    ${cardTypesRessources}
  }
`;

// scenario: "page-branche-ressources" — the 4 fixed "branche" pageModulaire landing pages (images,
// feuilletages, focus, paroles — see CardBranche.tsx) tagged with BRANCHES_RESSOURCES_TAG_ID above.
// A fixed pivot like docs-hcb-related/docs-mf-related, not a shared-field comparison against the
// host, so no \`^.^.^\` hop-counting gotcha here: \`references()\` just takes a literal id.
export const rebondPageBrancheRessources = `
  *[
    _type == "pageModulaire" &&
    _id != ^.^._id &&
    "page-branche-ressources" in ^.items &&
    references(${BRANCHES_RESSOURCES_TAG_ID})
  ] | order(_createdAt asc) {
    ${cardRefPageModulaire}
  }
`;

// body of a \`rebondsAuto[]->{ ... }\` projection — resolves \`items\` (the scenario keys picked by
// the editor on each \`rebond\` document in the host's \`rebondsAuto\` array) into a single array of
// cards, grouped by document type. Used the same way from any host document type — see rebondsAuto
// field usage across the schemas.
//
// Concatenation order here is also the DISPLAY order for a given scenario's own results: Rebonds.tsx's
// _orderRebondsByItems (sanity-api/utils.ts) re-sorts resolvedItems by the position of each card's
// matching scenario in the editor's \`items[]\` picklist, but "docs-hcb-related" / "docs-mf-related"
// span every type-shape under that SAME single picklist entry, so they all tie on that rank — and ties
// break by this GROQ-side order. Hence rebondExhibitionsHcb/Mf sit right after rebondExhibitions
// (exhibitions first) while rebondBooksHcb/Mf are pushed to the very end (books last), instead of
// sitting next to rebondBooks like every other type-shape pair above.
export const rebondsResolver = `
  title,
  items,
  "resolvedItems":
    ${rebondArtistSelf}
    + ${rebondArtistRelated}
    + ${rebondArtistPrizeRelated}
    + ${rebondBooks}
    + ${rebondExhibitions}
    + ${rebondExhibitionsHcb}
    + ${rebondExhibitionsMf}
    + ${rebondExhibitionsByArtist}
    + ${rebondExhibitionsPrizeRelated}
    + ${rebondExhibitionsDiscoverPast}
    + ${rebondExhibitionsDiscoverCurrent}
    + ${rebondEvents}
    + ${rebondEventsHcb}
    + ${rebondEventsMf}
    + ${rebondArticles}
    + ${rebondArticlesHcb}
    + ${rebondArticlesMf}
    + ${rebondArticlesPrizeRelated}
    + ${rebondRessources}
    + ${rebondRessourcesHcb}
    + ${rebondRessourcesMf}
    + ${rebondPageBrancheRessources}
    + ${rebondBooksHcb}
    + ${rebondBooksMf}
`;
