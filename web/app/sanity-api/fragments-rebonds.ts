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

// scenario: "artist" (self, via host's \`artists[]\`) — also fires for "artist-related": editors expect
// artist-related to include the host's own artist(s) directly (e.g. a book's own listed artist), not
// only other, separately-connected artists (that part is rebondArtistRelated below). Kept as its own
// fragment rather than merged into rebondArtistRelated's filter: merging them into one OR'd filter
// makes the whole filter's inferred type collapse to \`never\` on host types without an \`artists\` field
// (e.g. artist itself), which then poisons the entire concatenated resolvedItems type. Two same-shape
// arrays concatenated with \`+\` don't have that problem — an invalid/never operand is just dropped
// from the union. rebondArtistRelated excludes the host's own artist(s) from its own results, so
// there's no duplicate card when both scenarios are selected together.
export const rebondArtistSelf = `
  *[
    _type == "artist" &&
    _id != ^.^._id &&
    ("artist" in ^.items || "artist-related" in ^.items) &&
    _id in ^.^.artists[]._ref
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
    "artist-related" in ^.items &&
    _id in *[
      _type in ["product", "feuilletage", "imageImages", "serieThematique", "conversation"] &&
      references(coalesce(^.^.^.artists[]._ref, [^.^.^._id]))
    ].artists[]._ref
  ] | order(name asc) {
    ${cardRefArtist}
  }
`;

// scenario: "book-related" — books directly linked to the host (via product.exhibition, etc.), not
// broadened via the host's artist(s): otherwise a prolific artist's entire catalog shows up instead
// of just the book tied to this specific exhibition/content. Exception: a pageModulaire whose whole
// purpose is representing an artist (e.g. a tribute page with no exhibition/event of its own to
// distinguish itself from) has nothing that would ever reference it directly — broadened via its own
// \`artists[]\` there instead (added specifically for that case, see pageModulaire.ts's \`artists\` field).
export const rebondBooks = `
  *[
    _type == "product" &&
    _id != ^.^._id &&
    "book-related" in ^.items &&
    (references(^.^._id) || (^.^._type == "pageModulaire" && references(^.^.artists[]._ref)))
  ] | order(_createdAt desc) {
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

// scenarios: "exhibition-related", "exhibition-related-current-or-futur", "exhibition-related-past" (filtered to
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
      || ("exhibition-related-current-or-futur" in ^.items && (references(^.^._id) || references(^.^.artists[]._ref)) && count(dates[coalesce(au, du) >= now() && ${IN_SITE_DATE}]) > 0)
      || ("exhibition-related-past" in ^.items && (references(^.^._id) || references(^.^.artists[]._ref)) && count(dates[coalesce(au, du) >= now()]) == 0)
      || ("exhibition-futur" in ^.items && count(dates[coalesce(au, du) >= now() && ${IN_SITE_DATE}]) > 0)
      || ("exhibition-past" in ^.items && count(dates[coalesce(au, du) >= now()]) == 0)
      || ("exhibition-current" in ^.items && count(dates[du <= now() && coalesce(au, du) >= now() && ${IN_SITE_DATE}]) > 0)
    )
  ] | order(dates[0].du desc) {
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

// scenarios: "event-related-current-or-futur" (filtered to the host) and "event-futur" (global, any event)
export const rebondEvents = `
  *[
    _type == "event" &&
    _id != ^.^._id &&
    (
      ("event-related-current-or-futur" in ^.items && (references(^.^._id) || references(^.^.artists[]._ref)) && count(dates[coalesce(au, du) >= now()]) > 0)
      || ("event-futur" in ^.items && count(dates[coalesce(au, du) >= now()]) > 0)
    )
  ] | order(dates[0].du asc) {
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

// scenario: "articles-related" — articles directly linked to the host, not broadened via the host's
// artist(s), except for a pageModulaire artist page (see rebondBooks above for why).
export const rebondArticles = `
  *[
    _type == "article" &&
    _id != ^.^._id &&
    "articles-related" in ^.items &&
    (references(^.^._id) || (^.^._type == "pageModulaire" && references(^.^.artists[]._ref)))
  ] | order(_createdAt desc) {
    ${cardRefArticle}
  }
`;

// scenario: "ressources-related" — imageImages / feuilletage / serieThematique / conversation
// directly linked to the host, not broadened via the host's artist(s), except for a pageModulaire
// artist page (see rebondBooks above for why).
export const rebondRessources = `
  *[
    _id != ^.^._id &&
    _type in ["imageImages", "feuilletage", "serieThematique", "conversation"] &&
    "ressources-related" in ^.items &&
    (references(^.^._id) || (^.^._type == "pageModulaire" && references(^.^.artists[]._ref)))
  ] | order(_createdAt desc) {
    ${cardTypesRessources}
  }
`;

// body of a `rebondsAuto[]->{ ... }` projection — resolves `items` (the scenario keys picked by
// the editor on each `rebond` document in the host's `rebondsAuto` array) into a single array of
// cards, grouped by document type. Used the same way from any host document type — see rebondsAuto
// field usage across the schemas.
export const rebondsResolver = `
  title,
  items,
  "resolvedItems":
    ${rebondArtistSelf}
    + ${rebondArtistRelated}
    + ${rebondBooks}
    + ${rebondExhibitions}
    + ${rebondExhibitionsByArtist}
    + ${rebondExhibitionsDiscoverPast}
    + ${rebondExhibitionsDiscoverCurrent}
    + ${rebondEvents}
    + ${rebondArticles}
    + ${rebondRessources}
`;
