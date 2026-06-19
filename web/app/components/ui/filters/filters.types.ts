type LocaleString = { fr?: string; en?: string } | null;

export type SanitySortOption = {
  _key: string;
  field: "index" | "title" | "dateStart" | "_createdAt" | "speaker";
  direction: "asc" | "desc";
  label?: LocaleString;
};

// Referenced artist, tag, or chercheur, resolved by GROQ `->`
export type FilterCheckboxOption = {
  _id: string;
  _type: "artist" | "tag" | "chercheur";
  name?: string; // artist, chercheur
  last_name?: string; // artist, chercheur
  title?: LocaleString; // tag
  slug?: { current?: string };
};

// Referenced artist, tag, or chercheur, resolved by GROQ `->`
export type FilterRadioOption = {
  _id: string;
  _type: "artist" | "tag" | "chercheur";
  name?: string; // artist, chercheur
  last_name?: string; // artist, chercheur
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
      filterKey: "artist" | "tag" | "chercheur";
      filterLabel?: LocaleString;
      filterOptions?: FilterRadioOption[];
    }
  | {
      _key: string;
      _type: "filterCheckbox";
      filterKey: "artist" | "tag" | "chercheur";
      filterLabel?: LocaleString;
      filterOptions?: FilterCheckboxOption[];
    }
  | {
      _key: string;
      _type: "filterRadio";
      filterKey: "artist" | "tag" | "chercheur";
      filterLabel?: LocaleString;
      filterOptions?: FilterRadioOption[];
    };

// Active filter state: filterKey → current value(s)
// "sort"        → "index-asc"
// "search"      → search term
// "artist"/"tag"→ one or many referenced document _ids
export type ActiveFilters = Record<string, string | string[]>;
