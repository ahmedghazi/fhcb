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

// scenario: "artist-related" — other artists sharing content with the host. Two deliberate choices:
// - pivots on the host's OWN ARTISTS (coalesce(^.^.^.artists[]._ref, [^.^.^._id]) — falls back to the
//   host's own _id when it has no \`artists\` field, i.e. the host IS an artist), not the host document's
//   _id — otherwise unrelated cross-references between content (e.g. an exhibition linking to another
//   exhibition via "aroundTheExhibition") would pull in artists with no real connection to the host.
// - "event" is excluded from the pivot's type list: generic multi-exhibition events (guided tours, etc.)
//   often list every artist currently on show and are too weak a signal for "these artists are related".
export const rebondArtistRelated = `
  *[
    _type == "artist" &&
    _id != ^.^._id &&
    "artist-related" in ^.items &&
    _id in *[
      _type in ["exhibition", "product", "feuilletage", "imageImages", "serieThematique", "conversation"] &&
      references(coalesce(^.^.^.artists[]._ref, [^.^.^._id]))
    ].artists[]._ref
  ] | order(name asc) {
    ${cardRefArtist}
  }
`;

// scenario: "book-related"
export const rebondBooks = `
  *[
    _type == "product" &&
    _id != ^.^._id &&
    "book-related" in ^.items &&
    (references(^.^._id) || references(^.^.artists[]._ref))
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

// scenario: "articles-related"
// litmit 2
export const rebondArticles = `
  *[
    _type == "article" &&
    _id != ^.^._id &&
    "articles-related" in ^.items &&
    (references(^.^._id) || references(^.^.artists[]._ref))
  ] | order(_createdAt desc) {
    ${cardRefArticle}
  }
`;

// scenario: "ressources-related" — imageImages / feuilletage / serieThematique / conversation
export const rebondRessources = `
  *[
    _id != ^.^._id &&
    _type in ["imageImages", "feuilletage", "serieThematique", "conversation"] &&
    "ressources-related" in ^.items &&
    (references(^.^._id) || references(^.^.artists[]._ref))
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
