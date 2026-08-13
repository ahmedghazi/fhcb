import {
  cardRefArticle,
  cardRefArtist,
  cardRefEvent,
  cardRefExhibition,
  cardRefProduct,
  cardTypesRessources,
} from "./fragments-cards";

/*****************************************************************************************************
 * Fragments used to resolve a `rebond` document's `items` (see studio/schemaTypes/documents/rebond.ts).
 * Called from inside a `rebondsType->{ ${rebondsResolver} }` projection, so `^.^` is the host document
 * (artist, exhibition, event, product, feuilletage, pageModulaire, ...) — one hop for the `rebondsType->`
 * dereference, one more for the nested `*[]` filter itself. `^.items` is the `rebond` document's own
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

// scenario: "artist" (self, via host's `artists[]`) — kept separate from artist-related below:
// merging them into one OR'd filter makes the whole filter's inferred type collapse to `never`
// on host types without an `artists` field (e.g. artist itself), which then poisons the entire
// concatenated resolvedItems type. Two same-shape arrays concatenated with `+` don't have that
// problem — an invalid/never operand is just dropped from the union.
export const rebondArtistSelf = `
  *[
    _type == "artist" &&
    _id != ^.^._id &&
    "artist" in ^.items &&
    _id in ^.^.artists[]._ref
  ] {
    ${cardRefArtist}
  }
`;

// scenario: "artist-related" — other artists appearing in content directly tied to the host (not
// broadened via the host's own artist — for a prolific artist like HCB, pivoting via "any other
// content by the same artist anywhere on the site" pulls in every co-artist he's ever shared a show
// with, site-wide, which is far too broad). Excludes "exhibition" and "event" from the candidate
// type list: cross-exhibition links (e.g. the legacy \`rebonds\` reference field) and generic
// multi-exhibition events (guided tours, etc.) are both too weak/noisy a signal for "related".
// The exclusion of the host's OWN artist(s) from the result must go through coalesce(^.^.artists[]._ref,
// [^.^._id]) (falls back to the host's own _id when it has no \`artists\` field, i.e. the host IS an
// artist) — comparing directly against ^.^._id (the host DOCUMENT's id) never matches an artist's _id.
export const rebondArtistRelated = `
  *[
    _type == "artist" &&
    !(_id in coalesce(^.^.artists[]._ref, [^.^._id])) &&
    "artist-related" in ^.items &&
    _id in *[
      _type in ["product", "feuilletage", "imageImages", "serieThematique", "conversation"] &&
      references(^.^.^._id)
    ].artists[]._ref
  ] | order(name asc) {
    ${cardRefArtist}
  }
`;

// scenario: "book-related" — books directly linked to the host (via product.exhibition, etc.), not
// broadened via the host's artist(s): otherwise a prolific artist's entire catalog shows up instead
// of just the book tied to this specific exhibition/content.
export const rebondBooks = `
  *[
    _type == "product" &&
    _id != ^.^._id &&
    "book-related" in ^.items &&
    references(^.^._id)
  ] | order(_createdAt desc) {
    ${cardRefProduct}
  }
`;

// scenarios: "exhibition-related", "exhibition-related-futur", "exhibition-related-past" (filtered to
// the host) and "exhibition-futur", "exhibition-past" (global, any exhibition)
// NB: \`au\` (end date) is intentionally left blank for single-day exhibitions/events (see
// studio/schemaTypes/objects/fhcbDate.ts) — always fall back to \`du\` via coalesce(), otherwise
// single-day entries never match "futur" (au undefined >= now() is false) and always match "past".
export const rebondExhibitions = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    (
      ("exhibition-related" in ^.items && (references(^.^._id) || references(^.^.artists[]._ref)))
      || ("exhibition-related-futur" in ^.items && (references(^.^._id) || references(^.^.artists[]._ref)) && count(dates[coalesce(au, du) >= now()]) > 0)
      || ("exhibition-related-past" in ^.items && (references(^.^._id) || references(^.^.artists[]._ref)) && count(dates[coalesce(au, du) >= now()]) == 0)
      || ("exhibition-futur" in ^.items && count(dates[coalesce(au, du) >= now()]) > 0)
      || ("exhibition-past" in ^.items && count(dates[coalesce(au, du) >= now()]) == 0)
    )
  ] | order(dates[0].du desc) {
    ${cardRefExhibition}
  }
`;

// scenarios: "event-related-futur" (filtered to the host) and "event-futur" (global, any event)
export const rebondEvents = `
  *[
    _type == "event" &&
    _id != ^.^._id &&
    (
      ("event-related-futur" in ^.items && (references(^.^._id) || references(^.^.artists[]._ref)) && count(dates[coalesce(au, du) >= now()]) > 0)
      || ("event-futur" in ^.items && count(dates[coalesce(au, du) >= now()]) > 0)
    )
  ] | order(dates[0].du asc) {
    ${cardRefEvent}
  }
`;

// scenario: "articles-related" — articles directly linked to the host, not broadened via the host's
// artist(s) (see rebondBooks above for why).
export const rebondArticles = `
  *[
    _type == "article" &&
    _id != ^.^._id &&
    "articles-related" in ^.items &&
    references(^.^._id)
  ] | order(_createdAt desc) {
    ${cardRefArticle}
  }
`;

// scenario: "ressources-related" — imageImages / feuilletage / serieThematique / conversation
// directly linked to the host, not broadened via the host's artist(s) (see rebondBooks above for why).
export const rebondRessources = `
  *[
    _id != ^.^._id &&
    _type in ["imageImages", "feuilletage", "serieThematique", "conversation"] &&
    "ressources-related" in ^.items &&
    references(^.^._id)
  ] | order(_createdAt desc) {
    ${cardTypesRessources}
  }
`;

// body of a `rebondsType->{ ... }` projection — resolves `items` (the scenario keys picked by
// the editor on the `rebond` document) into a single array of cards, grouped by document type.
// Used the same way from any host document type — see rebondsType field usage across the schemas.
export const rebondsResolver = `
  title,
  items,
  "resolvedItems":
    ${rebondArtistSelf}
    + ${rebondArtistRelated}
    + ${rebondBooks}
    + ${rebondExhibitions}
    + ${rebondEvents}
    + ${rebondArticles}
    + ${rebondRessources}
`;
