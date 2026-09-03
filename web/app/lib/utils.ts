import { NavMenuItem } from "../context/HeaderContext";
import { PostTypes } from "../sanity-api/types/extra-types";
import {
  EventExpanded,
  ExhibitionExpanded,
} from "../sanity-api/types/sanity-expanded.types";
import {
  Artist,
  Exhibition,
  Feuilletage,
  FhcbDate,
  ImageImages,
  PageModulaire,
  Programme,
  ProgrammeReference,
  Tag,
} from "../sanity-api/types/sanity.types";

// Fisher-Yates, returns a new array (leaves the input untouched)
export const _shuffle = <T>(items: T[]): T[] => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// "priority X, random fill" for the rebond "discover" scenarios (currently just exhibition-discover-past):
// GROQ has no random(), so the fragment (fragments-rebonds.ts) returns a deterministic candidate pool
// with a boolean priority flag already computed server-side (e.g. same-artist) — this shuffles the
// priority and fill buckets independently and caps the result, so priority items are favored but the
// fill is genuinely randomized (and re-rolled on every request, unlike a GROQ-side sort).
export const _pickWithPriorityFill = <T>(
  items: T[] | null | undefined,
  isPriority: (item: T) => boolean,
  cap = 2,
): T[] => {
  if (!items || items.length === 0) return [];
  const priority = items.filter(isPriority);
  const other = items.filter((item) => !isPriority(item));
  return [..._shuffle(priority), ..._shuffle(other)].slice(0, cap);
};

export const _isSameArtistFlag = <T>(item: T) =>
  Boolean((item as { isSameArtist?: boolean | null }).isSameArtist);

// Picks up to `quotas[i]` unique (by _id) items from each `sources[i]` in order, then backfills
// from the combined pool (still deduped) if the quotas didn't add up to `total`.
// Sources are allowed to be differently-shaped (e.g. distinct GROQ projections), hence `{ _id }[]`
// rather than a single generic — they're only ever consumed as opaque "related item" cards.
export const _pickRelatedWithQuota = (
  sources: ({ _id: string }[] | null | undefined)[],
  quotas: number[],
  total: number,
): { _id: string }[] => {
  const usedIds = new Set<string>();
  const pickUnique = (items: { _id: string }[] = [], count: number) => {
    const picked: { _id: string }[] = [];
    for (const item of items) {
      if (picked.length >= count) break;
      if (item && !usedIds.has(item._id)) {
        picked.push(item);
        usedIds.add(item._id);
      }
    }
    return picked;
  };
  const picked = sources.flatMap((items, i) =>
    pickUnique(items || [], quotas[i] ?? 0),
  );
  if (picked.length < total) {
    picked.push(
      ...pickUnique(sources.flatMap((items) => items || []), total - picked.length),
    );
  }
  return picked;
};

export const artistsToString = (
  artists?: Array<{ name?: string | null }> | null,
): string => {
  return (artists ?? [])
    .map((artist) => artist?.name)
    .filter(Boolean)
    .join(", ");
};

export const _date = (d: string, locale = "fr") => {
  return new Intl.DateTimeFormat(locale, {
    // day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(d));
};
export const descriptionHtmlToBlocks = (html: string) => {
  return html
    .split(/<\/p>|<br\s*\/?>/i)
    .map((chunk) => chunk.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean)
    .map((text, i) => ({
      _type: "block",
      _key: `block-${i}`,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: `span-${i}`, text, marks: [] }],
    }));
};

const LOCALE_MAP: Record<string, string> = {
  fr: "fr-FR",
  en: "en-GB",
};

const toBcp47 = (locale: string) => LOCALE_MAP[locale] ?? locale;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ordinalFr = (day: number) => (day === 1 ? "1er" : String(day));

const prEn = new Intl.PluralRules("en", { type: "ordinal" });
const suffixesEn: Record<string, string> = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};
// const ordinalEn = (day: number) => `${day}${suffixesEn[prEn.select(day)]}`;
const ordinalEn = (day: number) => `${day}`;

const ordinal = (day: number, locale: string) =>
  locale === "fr" ? ordinalFr(day) : ordinalEn(day);

const monthName = (date: Date, bcp47: string) =>
  date.toLocaleDateString(bcp47, { month: "long" });

const weekdayName = (date: Date, bcp47: string) =>
  cap(date.toLocaleDateString(bcp47, { weekday: "long" }));

type DifferentYears = {
  type: "different-years";
  du: string;
  au: string;
  timeStart?: string;
  timeEnd?: string;
};
type SameYear = {
  type: "same-year";
  du: string;
  au: string;
  year: number;
  timeStart?: string;
  timeEnd?: string;
};
type WithTime = {
  type: "with-time";
  date: string;
  timeStart: string;
  timeEnd?: string;
};
type Simple = { type: "simple"; date: string };

export type FhcbDateFormatted = DifferentYears | SameYear | WithTime | Simple;

export type LocationType =
  | "inSite"
  | "inSite-cube"
  | "inSite-tube"
  | "offSite"
  | "travelling";

export const IN_SITE_LOCATION_TYPES: readonly LocationType[] = [
  "inSite",
  "inSite-cube",
  "inSite-tube",
];

// Whether a locationType is considered "in site".
// Absent locationType → true (backward compat with old inSite boolean field).
export const dateIsInSite = (date: FhcbDateExtended): boolean => {
  return isInSiteLocationType(date.locationType);
};
export const isInSiteLocationType = (locationType?: string | null): boolean => {
  if (!locationType) return true;
  return (IN_SITE_LOCATION_TYPES as readonly string[]).includes(locationType);
};

type FhcbDateExtended = FhcbDate & {
  locationType?: LocationType | string;
  withTime?: boolean;
  timeStart?: string;
  timeEnd?: string;
};

// Sanity `type: 'date'` stores YYYY-MM-DD — append T00:00:00 to avoid UTC offset shift
const parseDate = (d: string | null | undefined): Date | null => {
  if (!d || typeof d !== "string") return null;
  const date = new Date(`${d}T00:00:00`);
  return isNaN(date.getTime()) ? null : date;
};

export const _fhcbDates = (
  dates: FhcbDate,
  locale = "fr",
): FhcbDateFormatted => {
  if (!dates) return { type: "simple", date: "" };
  const { du, au, withTime, timeStart, timeEnd } = dates as FhcbDateExtended;
  const bcp47 = toBcp47(locale);

  if (!du) return { type: "simple", date: "" };

  const duDate = parseDate(du);
  if (!duDate) return { type: "simple", date: "" };
  const duYear = duDate.getFullYear();

  // Single date with time
  if (!au && withTime && timeStart) {
    const date = `${weekdayName(duDate, bcp47)} ${ordinal(duDate.getDate(), locale)} ${monthName(duDate, bcp47)} ${duYear}`;
    return {
      type: "with-time",
      date,
      timeStart,
      ...(timeEnd ? { timeEnd } : {}),
    };
  }

  // Single date, no time
  if (!au) {
    return {
      type: "simple",
      date: `${ordinal(duDate.getDate(), locale)} ${monthName(duDate, bcp47)} ${duYear}`,
    };
  }

  const auDate = parseDate(au);
  if (!auDate) {
    // au invalide → on affiche juste du
    return {
      type: "simple",
      date: `${ordinal(duDate.getDate(), locale)} ${monthName(duDate, bcp47)} ${duYear}`,
    };
  }
  const auYear = auDate.getFullYear();
  const timeProps =
    withTime && timeStart ? { timeStart, ...(timeEnd ? { timeEnd } : {}) } : {};

  // Range spanning different years
  if (duYear !== auYear) {
    return {
      type: "different-years",
      du: `${ordinal(duDate.getDate(), locale)} ${monthName(duDate, bcp47)} ${duYear}`,
      au: `${ordinal(auDate.getDate(), locale)} ${monthName(auDate, bcp47)} ${auYear}`,
      ...timeProps,
    };
  }

  // Range within the same year
  return {
    type: "same-year",
    du: `${ordinal(duDate.getDate(), locale)} ${monthName(duDate, bcp47)}`,
    au: `${ordinal(auDate.getDate(), locale)} ${monthName(auDate, bcp47)}`,
    year: auYear,
    ...timeProps,
  };
};

export const _isPastByDates = (dates: FhcbDate[]): boolean => {
  return dates.every((date) => {
    const reference = date?.au || date?.du;
    return reference && new Date(reference) < new Date();
  });
};

export const _isCurrentByDates = (dates: FhcbDate[]): boolean => {
  const today = new Date();
  return dates.some((date) => {
    const d = date as FhcbDateExtended;
    return (
      isInSiteLocationType(d.locationType) &&
      d.du &&
      new Date(d.du) <= today &&
      d.au &&
      new Date(d.au) >= today
    );
  });
};

export const _isFuturByDates = (dates: FhcbDate[]): boolean => {
  return dates.every((date) => {
    const reference = date?.du || date?.au;
    return reference && new Date(reference) > new Date();
  });
};
export const _isCurrentOrFuturByDates = (dates: FhcbDate[]): boolean => {
  const isCurrent = _isCurrentByDates(dates);
  const isFutur = _isFuturByDates(dates);
  return isCurrent || isFutur;
};
export const _isHorsLesMurs = (tags: Tag[]): boolean => {
  return tags.filter((tag) => tag.slug?.current === "hors-les-murs").length > 0;
};

export const _isPast = (item: ExhibitionExpanded) => {
  const isPast = _isPastByDates(item.dates || []);
  // const isOffSite = item.dates?.some((date) => {
  //   const d = date as FhcbDateExtended;
  //   const outsideLocations = ["offSite", "travelling"];
  //   return outsideLocations.includes(d.locationType || "");
  // });
  return isPast;
  // return _isPastByDates(item.dates) && _isHorsLesMurs(item.tags);
};

export const _isVisiteGuidee = (tags: Tag[]) => {
  return (
    tags.filter((tag) => tag.slug?.current === "visite-commentee").length > 0
  );
};

export const _isRessource = (tags: Tag[]) => {
  return (
    tags.filter((tag) => tag.slug?.current === "branches-ressources").length > 0
  );
};

export const _collectFirstImagesFromNavItem = (item: PostTypes) => {
  const moduleImages = (item?.modules ?? [])
    .flatMap((m: any) => m?.items ?? [])
    .map((i: any) => i?.imageCover)
    .filter(Boolean);

  if (moduleImages.length > 0) {
    const capped = moduleImages.slice(0, 2);
    return capped;
  }

  const pageCover = (item as any)?.imageCover;
  return pageCover ? [pageCover] : [];
};

export function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    let videoId: string | null = null;

    // youtu.be/<id>

    if (parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1);
    }

    // youtube.com/watch?v=<id>

    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.pathname === "/watch"
    ) {
      videoId = parsedUrl.searchParams.get("v");
    }

    // youtube.com/embed/<id>

    if (parsedUrl.hostname.includes("youtube.com")) {
      const match = parsedUrl.pathname.match(/\/embed\/([^/]+)/);

      if (match) {
        videoId = match[1];
      }
    }

    // youtube.com/shorts/<id>

    if (parsedUrl.hostname.includes("youtube.com")) {
      const match = parsedUrl.pathname.match(/\/shorts\/([^/]+)/);

      if (match) {
        videoId = match[1];
      }
    }

    return videoId;
  } catch {
    return null;
  }
}

export function getYouTubeNoCookieUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function getYouTubeThumbnailUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

// multiple aspect ratios (16x9, 4x3), as recommended for VideoObject JSON-LD
export function getYouTubeThumbnails(url: string): string[] {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return [];
  return [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ];
}
