import { ArtistExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { SanityFilterDef } from "./filters.types";
import { Chercheur, Tag } from "@/app/sanity-api/types/sanity.types";

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
  T extends HasArtists & HasTags & HasChercheur,
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
      if (def.filterKey === "chercheur") {
        return { ...def, filterOptions: collectChercheur(items) };
      }
    }
    return def;
  });
