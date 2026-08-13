import i18n from "../config/i18n";
import useLocale from "../context/LocaleContext";
import {
  Artist,
  Event,
  Exhibition,
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

// Keep in sync with the groupings in fragments-rebonds.ts (rebondsResolver): each `rebond.items`
// scenario resolves to one of these document-type groups.
const REBOND_SCENARIO_GROUP: Record<string, string> = {
  artist: "artist",
  "artist-related": "artist",
  "book-related": "book",
  "exhibition-related": "exhibition",
  "exhibition-related-futur": "exhibition",
  "exhibition-related-past": "exhibition",
  "exhibition-futur": "exhibition",
  "exhibition-past": "exhibition",
  "event-related-futur": "event",
  "event-futur": "event",
  "articles-related": "article",
  "ressources-related": "ressources",
};

const REBOND_TYPE_GROUP: Record<string, string> = {
  artist: "artist",
  product: "book",
  exhibition: "exhibition",
  event: "event",
  article: "article",
  imageImages: "ressources",
  feuilletage: "ressources",
  serieThematique: "ressources",
  conversation: "ressources",
};

// rebondsResolver's GROQ concatenates resolvedItems grouped by document type in a fixed order
// (artist, book, exhibition, event, article, ressources) — this re-sorts to match the order the
// editor actually picked in rebond.items instead, grouping by type and preserving each group's
// internal (GROQ-side) ordering.
export const _orderRebondsByItems = <T extends { _type?: string }>(
  items: string[] | null | undefined,
  resolvedItems: T[] | null | undefined,
): T[] | null | undefined => {
  if (!items || !resolvedItems) return resolvedItems;
  const groupOrder: string[] = [];
  items.forEach((item) => {
    const group = REBOND_SCENARIO_GROUP[item];
    if (group && !groupOrder.includes(group)) groupOrder.push(group);
  });
  const rankOf = (item: T) => {
    const group = item._type ? REBOND_TYPE_GROUP[item._type] : undefined;
    const index = group ? groupOrder.indexOf(group) : -1;
    return index === -1 ? groupOrder.length : index;
  };
  return resolvedItems
    .map((item, i) => ({ item, i }))
    .sort((a, b) => rankOf(a.item) - rankOf(b.item) || a.i - b.i)
    .map(({ item }) => item);
};
