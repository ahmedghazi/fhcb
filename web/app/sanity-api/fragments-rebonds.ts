import {
  cardRefArticle,
  cardRefArtist,
  cardRefEvent,
  cardRefExhibition,
  cardRefProduct,
  cardTypes,
} from "./fragments-cards";

/*****************************************************************************************************
 * Fragments used to resolve a `rebond` document's `items` (see studio/schemaTypes/documents/rebond.ts).
 * Called from inside ARTIST_QUERY's `rebondsType->{ resolvedItems: select(...) }`, so `^.^` is the
 * host document (artist for now, more types to come) — one hop for the `rebondsType->` dereference,
 * one more for the nested `*[]` filter itself. See relatedByArtist / relatedByExhibition in
 * fragments.ts for the single-hop version of this same `references(^._id)` pattern used elsewhere.
 */

// scenario: "artist" — the artist(s) attached to the host document
export const rebondArtist = `
  *[
    _type == "artist" &&
    _id != ^.^._id &&
    _id in ^.^.artists[]._ref
  ] {
    ${cardRefArtist}
  }
`;

// scenario: "artist-related" — other artists sharing content with the host artist
export const rebondArtistRelated = `
  *[
    _type == "artist" &&
    _id != ^.^._id &&
    _id in *[
      _type in ["exhibition", "event", "product", "feuilletage", "imageImages", "serieThematique", "conversation"] &&
      references(^.^.^._id)
    ].artists[]._ref
  ] | order(name asc) {
    ${cardRefArtist}
  }
`;

// scenario: "book-related" — books (products) related to the host document
export const rebondBookRelated = `
  *[
    _type == "product" &&
    _id != ^.^._id &&
    (references(^.^._id) || references(^.^.artists[]._ref))
  ] | order(_createdAt desc) {
    ${cardRefProduct}
  }
`;

// scenario: "exhibition-related" — all exhibitions related to the host document
export const rebondExhibitionRelated = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    (references(^.^._id) || references(^.^.artists[]._ref))
  ] | order(dates[0].du desc) {
    ${cardRefExhibition}
  }
`;

// scenario: "exhibition-related-current-and-futur"
export const rebondExhibitionCurrentFutur = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    (references(^.^._id) || references(^.^.artists[]._ref)) &&
    count(dates[au >= now()]) > 0
  ] | order(dates[0].du asc) {
    ${cardRefExhibition}
  }
`;

// scenario: "exhibition-related-past"
export const rebondExhibitionPast = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    (references(^.^._id) || references(^.^.artists[]._ref)) &&
    count(dates[au >= now()]) == 0
  ] | order(dates[0].du desc) {
    ${cardRefExhibition}
  }
`;

// scenario: "event-futur"
//    (references(^.^._id) || references(^.^.artists[]._ref)) &&
export const rebondFuturEvent = `
  *[
    _type == "event" &&
    _id != ^.^._id &&

    count(dates[au >= now()]) > 0
  ] | order(dates[0].du asc) {
    ${cardRefEvent}
  }
`;

// scenario: "exhibition-current-or-futur" — any current/upcoming exhibition, regardless of relation to the host
export const rebondExhibitionCurrentOrFuturGlobal = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    count(dates[au >= now()]) > 0
  ] | order(dates[0].du asc) {
    ${cardRefExhibition}
  }
`;

// scenario: "exhibition-past" — any past exhibition, regardless of relation to the host
export const rebondExhibitionPastGlobal = `
  *[
    _type == "exhibition" &&
    _id != ^.^._id &&
    count(dates[au >= now()]) == 0
  ] | order(dates[0].du desc) {
    ${cardRefExhibition}
  }
`;

// scenario: "article-related"
export const rebondArticleRelated = `
  *[
    _type == "article" &&
    _id != ^.^._id &&
    (references(^.^._id) || references(^.^.artists[]._ref))
  ] | order(_createdAt desc) {
    ${cardRefArticle}
  }
`;

// scenario: "ressources-related" — imageImages / feuilletage / serieThematique / conversation
export const rebondRessourcesRelated = `
  *[
    _id != ^.^._id &&
    _type in ["imageImages", "feuilletage", "serieThematique", "conversation"] &&
    (references(^.^._id) || references(^.^.artists[]._ref))
  ] | order(_createdAt desc) {
    ${cardTypes}
  }
`;

// body of a `rebondsType->{ ... }` projection — resolves `items` (the scenario keys picked by
// the editor on the `rebond` document) into a single ordered-by-scenario array of cards.
// Used the same way from any host document type (artist, exhibition, event, product,
// feuilletage, pageModulaire, ...) — see rebondsType field usage across the schemas.
export const rebondsResolver = `
  title,
  "resolvedItems":
    select("artist" in items => ${rebondArtist}, [])
    + select("artist-related" in items => ${rebondArtistRelated}, [])
    + select("book-related" in items => ${rebondBookRelated}, [])
    + select("exhibition-related" in items => ${rebondExhibitionRelated}, [])
    + select("exhibition-related-current-and-futur" in items => ${rebondExhibitionCurrentFutur}, [])
    + select("exhibition-related-past" in items => ${rebondExhibitionPast}, [])
    + select("exhibition-current-or-futur" in items => ${rebondExhibitionCurrentOrFuturGlobal}, [])
    + select("exhibition-past" in items => ${rebondExhibitionPastGlobal}, [])
    + select("event-futur" in items => ${rebondFuturEvent}, [])
    + select("article-related" in items => ${rebondArticleRelated}, [])
    + select("ressources-related" in items => ${rebondRessourcesRelated}, [])
`;
