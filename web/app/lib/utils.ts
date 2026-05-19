import { FhcbDate } from "../sanity-api/types/sanity.types";

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

type DifferentYears = { type: "different-years"; du: string; au: string };
type SameYear = { type: "same-year"; du: string; au: string; year: number };
type WithTime = { type: "with-time"; date: string; heure: string };
type Simple = { type: "simple"; date: string };

export type FhcbDateFormatted = DifferentYears | SameYear | WithTime | Simple;

export const _fhcbDates = (
  dates: FhcbDate,
  locale = "fr",
): FhcbDateFormatted => {
  const { du, au, heure } = dates as FhcbDate & { heure?: string };
  const bcp47 = toBcp47(locale);

  if (!du) return { type: "simple", date: "" };

  const duDate = new Date(du);
  const duYear = duDate.getFullYear();

  // Single date with time
  if (!au && heure) {
    const date = `${weekdayName(duDate, bcp47)} ${ordinal(duDate.getDate(), locale)} ${monthName(duDate, bcp47)} ${duYear}`;
    return { type: "with-time", date, heure };
  }

  // Single date, no time
  if (!au) {
    return {
      type: "simple",
      date: `${ordinal(duDate.getDate(), locale)} ${monthName(duDate, bcp47)} ${duYear}`,
    };
  }

  const auDate = new Date(au);
  const auYear = auDate.getFullYear();

  // Range spanning different years
  if (duYear !== auYear) {
    return {
      type: "different-years",
      du: `${ordinal(duDate.getDate(), locale)} ${monthName(duDate, bcp47)}. ${duYear}`,
      au: `${ordinal(auDate.getDate(), locale)} ${monthName(auDate, bcp47)} ${auYear}`,
    };
  }

  // Range within the same year
  return {
    type: "same-year",
    du: `${ordinal(duDate.getDate(), locale)} ${monthName(duDate, bcp47)}`,
    au: `${ordinal(auDate.getDate(), locale)} ${monthName(auDate, bcp47)}`,
    year: auYear,
  };
};

export const _isCurrentExhibition = (dates: FhcbDate[]): boolean => {
  return dates.some((date) => date?.au && new Date(date.au) > new Date());
};

export const _isFuturExhibition = (dates: FhcbDate[]): boolean => {
  return dates.some((date) => date?.du && new Date(date.du) > new Date());
};
