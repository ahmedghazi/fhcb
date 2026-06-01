type LocaleString = { fr?: string; en?: string } | null;

export type SanitySortOption = {
  _key: string;
  field: "index" | "title" | "dateStart" | "_createdAt" | "speaker";
  direction: "asc" | "desc";
  label?: LocaleString;
};

// Referenced artist or tag, resolved by GROQ `->`
export type FilterRadioOption = {
  _id: string;
  _type: "artist" | "tag";
  name?: string;       // artist
  title?: LocaleString; // tag
  slug?: { current?: string };
};

export type SanityFilterDef =
  | {
      _key: string;
      _type: "filterSort";
      sortOptions?: SanitySortOption[];
    }
  | {
      _key: string;
      _type: "filterSearch";
      searchIn?: string[];
    }
  | {
      _key: string;
      _type: "filterList";
      radioKey: "artist" | "tag";
      radioLabel?: LocaleString;
      radioOptions?: FilterRadioOption[];
    };

// Active filter state: filterKey → current value(s)
// "sort"        → "index-asc"
// "search"      → search term
// "artist"/"tag"→ one or many referenced document _ids
export type ActiveFilters = Record<string, string | string[]>;
