import i18n from "../config/i18n";
import useLocale from "../context/LocaleContext";
import {
  _isCurrentByDates,
  _isCurrentOrFuturByDates,
  _isPastByDates,
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
export const _parseJsonStringArray = (value: string | undefined | null, separator = ", "): string => {
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

type RebondCard = {
  _type?: string;
  dates?: FhcbDate[] | null;
};

const REBOND_RESSOURCES_TYPES = ["imageImages", "feuilletage", "serieThematique", "conversation"];

// Keep in sync with fragments-rebonds.ts (rebondsResolver): whether a resolved card could have been
// produced by a given `rebond.items` scenario. Needed (not just a _type check) because several
// scenarios targeting the same _type are mutually exclusive by date — e.g. "exhibition-current" vs
// "exhibition-futur" — and rebondsResolver's GROQ concatenates all exhibition scenarios into one
// date-sorted array, so a plain type-based group can't tell an editor's "current" pick from "futur".
const REBOND_SCENARIO_MATCHERS: Record<string, (item: RebondCard) => boolean> = {
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
  "exhibition-past": (item) =>
    item._type === "exhibition" && _isPastByDates(item.dates || []),
  "exhibition-discover-past": (item) =>
    item._type === "exhibition" && _isPastByDates(item.dates || []),
  "exhibition-discover-current-or-futur": (item) =>
    item._type === "exhibition" && _isCurrentOrFuturByDates(item.dates || []),
  "event-related-current-or-futur": (item) =>
    item._type === "event" && _isCurrentOrFuturByDates(item.dates || []),
  "event-futur": (item) => item._type === "event" && _isCurrentOrFuturByDates(item.dates || []),
  "articles-related": (item) => item._type === "article",
  "ressources-related": (item) =>
    !!item._type && REBOND_RESSOURCES_TYPES.includes(item._type),
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
    const index = items.findIndex((scenario) => REBOND_SCENARIO_MATCHERS[scenario]?.(item));
    return index === -1 ? items.length : index;
  };
  return resolvedItems
    .map((item, i) => ({ item, i }))
    .sort((a, b) => rankOf(a.item) - rankOf(b.item) || a.i - b.i)
    .map(({ item }) => item);
};
