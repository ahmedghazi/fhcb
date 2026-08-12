import { ArtistExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { SanityFilterDef } from "./filters.types";
import {
  Chercheur,
  ProductVariant,
  Tag,
  TagProduct,
} from "@/app/sanity-api/types/sanity.types";

// Language is stored as a selectedOption on product variants (name varies by
// Shopify option naming, e.g. "langues" or "Version linguistique"), and
// values sometimes carry a code prefix (e.g. "FRA - Français"). Match and
// normalize both conventions down to the plain language label.
const LANGUAGE_OPTION_NAME = /lang|lingu/i;

export const normalizeLanguageValue = (value: string): string => {
  const parts = value.split("-");
  return parts[parts.length - 1].trim();
};

export const isLanguageOptionName = (name?: string | null): boolean =>
  !!name && LANGUAGE_OPTION_NAME.test(name);

type HasArtists = { artists?: ArtistExpanded[] | null };

// Artists actually present on the resolved items, deduped by _id
export const collectArtists = <T extends HasArtists>(
  items: T[],
): ArtistExpanded[] => {
  const seen = new Map<string, ArtistExpanded>();
  items.forEach((item) => {
    item.artists?.forEach((artist) => {
      if (artist?._id && !seen.has(artist._id)) seen.set(artist._id, artist);
    });
  });
  return Array.from(seen.values());
};

type HasTags = { tags?: Tag[] | null };

// Tags actually present on the resolved items, deduped by _id
export const collectTags = <T extends HasTags>(items: T[]): Tag[] => {
  const seen = new Map<string, Tag>();
  items.forEach((item) => {
    item.tags?.forEach((tag) => {
      if (tag?._id && !seen.has(tag._id)) seen.set(tag._id, tag);
    });
  });
  return Array.from(seen.values());
};

type HasTagsProduct = { tagsProduct?: TagProduct[] | null };
// Product category tags actually present on the resolved items, deduped by _id
export const collectTagsProduct = <T extends HasTagsProduct>(
  items: T[],
): TagProduct[] => {
  const seen = new Map<string, TagProduct>();
  items.forEach((item) => {
    item.tagsProduct?.forEach((tag) => {
      if (tag?._id && !seen.has(tag._id)) seen.set(tag._id, tag);
    });
  });
  return Array.from(seen.values()).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
};

type HasVariants = { variants?: ProductVariant[] | null };

// Language labels actually present on the resolved items' variants, deduped
export const collectLanguages = <T extends HasVariants>(
  items: T[],
): string[] => {
  const seen = new Set<string>();
  items.forEach((item) => {
    item.variants?.forEach((variant) => {
      variant.selectedOptions?.forEach((opt) => {
        if (isLanguageOptionName(opt.name) && opt.value) {
          seen.add(normalizeLanguageValue(opt.value));
        }
      });
    });
  });
  return Array.from(seen).sort();
};

type HasChercheur = { chercheur?: Chercheur | null };

// Chercheur actually present on the resolved items (single ref per item), deduped by _id
export const collectChercheur = <T extends HasChercheur>(
  items: T[],
): Chercheur[] => {
  const seen = new Map<string, Chercheur>();
  items.forEach((item) => {
    if (item.chercheur?._id && !seen.has(item.chercheur._id))
      seen.set(item.chercheur._id, item.chercheur);
  });
  return Array.from(seen.values());
};

// Overrides filterOptions on artist-keyed filter defs with options actually
// present in `items`, so pickers only ever show values that can return results.
export const withResolvedOptions = <
  T extends HasArtists & HasTags & HasTagsProduct & HasChercheur & HasVariants,
>(
  filterDefs: SanityFilterDef[],
  items: T[],
): SanityFilterDef[] =>
  filterDefs.map((def) => {
    if (
      def._type === "filterList" ||
      def._type === "filterCheckbox" ||
      def._type === "filterRadio"
    ) {
      if (def.filterKey === "artist") {
        return { ...def, filterOptions: collectArtists(items) };
      }
      if (def.filterKey === "tag") {
        return { ...def, filterOptions: collectTags(items) };
      }
      if (def.filterKey === "tagProduct") {
        return { ...def, filterOptions: collectTagsProduct(items) };
      }
      if (def.filterKey === "chercheur") {
        return { ...def, filterOptions: collectChercheur(items) };
      }
      if (def.filterKey === "language" && def._type === "filterList") {
        return { ...def, filterOptions: collectLanguages(items) };
      }
    }
    return def;
  });
