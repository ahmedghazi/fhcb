import i18n from "../config/i18n";
import useLocale from "../context/LocaleContext";
import {
  _isCurrentByDates,
  _isCurrentOrFuturByDates,
  _isPastByDates,
  _shuffle,
} from "../lib/utils";
import {
  Artist,
  Event,
  Exhibition,
  FhcbDate,
  Library,
  PageModulaire,
  Product,
} from "./types/sanity.types";

export const _linkResolver = (
  node: PageModulaire | Exhibition | Event | Artist | Library | Product | any,
) => {
  if (!node || !node._type || (node._type === "pageModulaire" && node.homePage))
    return "/";
  // console.log(node._type);
  switch (node._type) {
    case "programme":
      return `/programme/${node.slug?.current}`;
    case "exhibition":
      return `/exhibition/${node.slug?.current}`;
    case "event":
      return `/event/${node.slug?.current}`;
    case "artist":
      return `/artist/${node.slug?.current}`;
    case "library":
      return `/${node.slug?.current}`;
    case "product":
      return `/publications/${node.slug?.current}`;
    case "imageImages":
      return `/image-images/${node.slug?.current}`;
    case "feuilletage":
      return `/feuilletage/${node.slug?.current}`;
    case "serieThematique":
      return `/serie-thematique/${node.slug?.current}`;
    case "conversation":
      return `/conversation/${node.slug?.current}`;
    case "article":
      return `/article/${node.slug?.current}`;

    default:
      return `/${node.slug?.current}`;
  }
};

export const _localizeText = (text: string) => {
  const { locale } = useLocale();
  const currentI18N = (i18n as any)[`${locale}`];
  return currentI18N[text] ? currentI18N[text] : text;
};

// Shopify-synced list fields are stored as a JSON-stringified array, and can
// pack multiple comma-separated values into a single array element (with a
// trailing ", ") instead of one value per element — split and trim both levels.
export const _parseJsonStringArray = (
  value: string | undefined | null,
  separator = ", ",
): string => {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    const items = Array.isArray(parsed) ? parsed : [parsed];
    return items
      .flatMap((item) => String(item).split(","))
      .map((item) => item.trim())
      .filter(Boolean)
      .join(separator);
  } catch {
    return value;
  }
};

export const _localizeField = (field: any) => {
  const { locale } = useLocale();
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[locale] ? field[locale] : field["fr"];
};

export type RebondCard = {
  _type?: string;
  dates?: FhcbDate[] | null;
};

const REBOND_RESSOURCES_TYPES = [
  "imageImages",
  "feuilletage",
  "serieThematique",
  "conversation",
];

// "docs-hcb-related" / "docs-mf-related" candidate type-shapes (see rebondBooksHcb/Mf,
// rebondExhibitionsHcb/Mf, rebondEventsHcb/Mf, rebondArticlesHcb/Mf, rebondRessourcesHcb/Mf in
// fragments-rebonds.ts) — no artist pair exists for these two scenarios.
const DOCS_RELATED_CANDIDATE_TYPES = [
  "product",
  "exhibition",
  "event",
  "article",
  ...REBOND_RESSOURCES_TYPES,
];

// Groups a docs-hcb-related/docs-mf-related candidate for `_pickDocsRelated` below: the four
// REBOND_RESSOURCES_TYPES count as ONE shape (imageImages/feuilletage/serieThematique/conversation
// share a single rebondRessourcesHcb/Mf fragment, capped together — see DOCS_RELATED_POOL_CAP in
// fragments-rebonds.ts), everything else groups by its own `_type`. Returns null for a card that isn't
// a docs-hcb-related/docs-mf-related candidate at all, so `_pickDocsRelated` leaves it untouched.
// Only reads `_type` — deliberately NOT typed via RebondCard (which also carries `dates`, and each
// query's own generated card projection is a structurally distinct type from FhcbDate, e.g. null vs
// undefined on nested fields), so any resolved card shape can be passed through untouched.
const _docsRelatedShapeKey = (item: { _type?: string }): string | null => {
  if (!item._type) return null;
  if (REBOND_RESSOURCES_TYPES.includes(item._type)) return "ressources";
  if (DOCS_RELATED_CANDIDATE_TYPES.includes(item._type)) return item._type;
  return null;
};

// GROQ has no random() (see DOCS_RELATED_POOL_CAP in fragments-rebonds.ts): a rebond's
// `docsRelatedPool` field (rebondsResolver) holds a wide, still date-ordered candidate pool per
// type-shape rather than a final pick. Called from each host page.tsx (server-rendered, so this
// re-rolls on every request) to randomly narrow that pool to `cap` per shape and merge the result into
// `resolvedItems` before handing both off to <Rebonds items={rebond.items} input={...} /> — its own
// _orderRebondsByItems then ranks the merged list same as any other scenario's cards.
export const _pickDocsRelated = <T extends { _type?: string }>(
  pool: T[] | null | undefined,
  cap = 2,
): T[] => {
  if (!pool || pool.length === 0) return [];
  const groups = new Map<string, T[]>();
  for (const item of pool) {
    const key = _docsRelatedShapeKey(item);
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return Array.from(groups.values()).flatMap((group) =>
    _shuffle(group).slice(0, cap),
  );
};

// Keep in sync with fragments-rebonds.ts (rebondsResolver): whether a resolved card could have been
// produced by a given `rebond.items` scenario. Needed (not just a _type check) because several
// scenarios targeting the same _type are mutually exclusive by date — e.g. "exhibition-current" vs
// "exhibition-futur" — and rebondsResolver's GROQ concatenates all exhibition scenarios into one
// date-sorted array, so a plain type-based group can't tell an editor's "current" pick from "futur".
const REBOND_SCENARIO_MATCHERS: Record<string, (item: RebondCard) => boolean> =
  {
    artist: (item) => item._type === "artist",
    "artist-related": (item) => item._type === "artist",
    "book-related": (item) => item._type === "product",
    "exhibition-related": (item) => item._type === "exhibition",
    "exhibition-related-by-artist": (item) => item._type === "exhibition",
    "exhibition-related-current-or-futur": (item) =>
      item._type === "exhibition" && _isCurrentOrFuturByDates(item.dates || []),
    "exhibition-related-past": (item) =>
      item._type === "exhibition" && _isPastByDates(item.dates || []),
    "exhibition-futur": (item) =>
      item._type === "exhibition" && _isCurrentOrFuturByDates(item.dates || []),
    "exhibition-current": (item) =>
      item._type === "exhibition" && _isCurrentByDates(item.dates || []),
    "exhibition-current-or-futur": (item) =>
      item._type === "exhibition" && _isCurrentOrFuturByDates(item.dates || []),
    "exhibition-past": (item) =>
      item._type === "exhibition" && _isPastByDates(item.dates || []),
    "exhibition-discover-past": (item) =>
      item._type === "exhibition" && _isPastByDates(item.dates || []),
    "exhibition-discover-current-or-futur": (item) =>
      item._type === "exhibition" && _isCurrentOrFuturByDates(item.dates || []),
    "event-related-current-or-futur": (item) =>
      item._type === "event" && _isCurrentOrFuturByDates(item.dates || []),
    "event-futur": (item) =>
      item._type === "event" && _isCurrentOrFuturByDates(item.dates || []),
    "articles-related": (item) => item._type === "article",
    "ressources-related": (item) =>
      !!item._type && REBOND_RESSOURCES_TYPES.includes(item._type),
    // tags-related fires across every candidate type that has a `tags` field (see rebondExhibitions /
    // rebondEvents / rebondArticles / rebondRessources in fragments-rebonds.ts) — there's no per-card
    // signal here for *why* a card matched, so this is a best-effort type check like the other
    // "-related" matchers above, not a true tag-overlap check.
    "tags-related": (item) =>
      !!item._type &&
      ["exhibition", "event", "article", ...REBOND_RESSOURCES_TYPES].includes(
        item._type,
      ),
    // prize-related fires across every candidate type that carries a `prix` field (artist, exhibition,
    // article — see rebondArtistRelated / rebondExhibitions / rebondArticles in fragments-rebonds.ts),
    // same best-effort caveat as tags-related above.
    "prize-related": (item) =>
      !!item._type && ["artist", "exhibition", "article"].includes(item._type),
    // docs-hcb-related / docs-mf-related fire across every candidate type-shape (product, exhibition,
    // event, article, ressources — see rebondBooks / rebondExhibitions / rebondEvents / rebondArticles /
    // rebondRessources in fragments-rebonds.ts), same best-effort caveat as tags-related above.
    "docs-hcb-related": (item) =>
      !!item._type &&
      [
        "product",
        "exhibition",
        "event",
        "article",
        ...REBOND_RESSOURCES_TYPES,
      ].includes(item._type),
    "docs-mf-related": (item) =>
      !!item._type &&
      [
        "product",
        "exhibition",
        "event",
        "article",
        ...REBOND_RESSOURCES_TYPES,
      ].includes(item._type),
    "page-branche-ressources": (item) => item._type === "pageModulaire",
    // product-related fires across every candidate type-shape pulled through the host's own linked
    // `product` (artist, exhibition, event, and the product itself — see rebondArtistSelf / rebondBooks /
    // rebondExhibitions / rebondEvents in fragments-rebonds.ts), same best-effort caveat as tags-related above.
    "product-related": (item) =>
      !!item._type &&
      ["artist", "product", "exhibition", "event"].includes(item._type),
  };

// rebondsResolver's GROQ concatenates resolvedItems grouped by document type in a fixed order
// (artist, book, exhibition, event, article, ressources) — this re-sorts to match the order the
// editor actually picked in rebond.items instead: each card ranks by the position of the first
// items[] scenario it could have come from (see REBOND_SCENARIO_MATCHERS), ties broken by the
// original (GROQ-side) order.
export const _orderRebondsByItems = <T extends RebondCard>(
  items: string[] | null | undefined,
  resolvedItems: T[] | null | undefined,
): T[] | null | undefined => {
  if (!items || !resolvedItems) return resolvedItems;
  const rankOf = (item: T) => {
    const index = items.findIndex((scenario) =>
      REBOND_SCENARIO_MATCHERS[scenario]?.(item),
    );
    return index === -1 ? items.length : index;
  };
  return resolvedItems
    .map((item, i) => ({ item, i }))
    .sort((a, b) => rankOf(a.item) - rankOf(b.item) || a.i - b.i)
    .map(({ item }) => item);
};
