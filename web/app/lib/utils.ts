import { ExhibitionExpanded } from "../sanity-api/types/sanity-expanded.types";
import { FhcbDate, Tag } from "../sanity-api/types/sanity.types";

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
const ordinalEn = (day: number) => `${day}${suffixesEn[prEn.select(day)]}`;

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
      du: `${ordinal(duDate.getDate(), locale)} ${monthName(duDate, bcp47)}. ${duYear}`,
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

export const _isPastExhibition = (dates: FhcbDate[]): boolean => {
  return dates.every((date) => date?.au && new Date(date.au) < new Date());
};

export const _isCurrentExhibition = (dates: FhcbDate[]): boolean => {
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

export const _isFuturExhibition = (dates: FhcbDate[]): boolean => {
  return dates.every((date) => date?.du && new Date(date.du) > new Date());
};
export const _isHorsLesMurs = (tags: Tag[]): boolean => {
  return tags.filter((tag) => tag.slug?.current === "hors-les-murs").length > 0;
};

export const _isPastHorOutside = (item: ExhibitionExpanded) => {
  const isPast = _isPastExhibition(item.dates || []);
  const isOffSite = item.dates?.some((date) => {
    const d = date as FhcbDateExtended;
    const outsideLocations = ["offSite", "travelling"];
    return outsideLocations.includes(d.locationType || "");
  });
  return isPast || isOffSite;
  // return _isPastExhibition(item.dates) && _isHorsLesMurs(item.tags);
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
