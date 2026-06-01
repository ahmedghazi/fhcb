import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";

const localize = (field: any, locale: string): string => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[locale] ?? field["fr"] ?? "";
};

const matchesSearch = (
  item: any,
  fields: string[],
  term: string,
  locale: string,
): boolean => {
  const lower = term.toLowerCase();
  return fields.some((field) => {
    if (field === "title" || field === "subTitle") {
      return localize(item[field], locale).toLowerCase().includes(lower);
    }
    if (field === "index" || field === "speaker") {
      return String(item[field] ?? "")
        .toLowerCase()
        .includes(lower);
    }
    if (field === "tags") {
      return (
        item.tags?.some((t: any) =>
          localize(t.title, locale).toLowerCase().includes(lower),
        ) ?? false
      );
    }
    if (field === "artists") {
      return (
        item.artists?.some((a: any) =>
          String(a.name ?? "")
            .toLowerCase()
            .includes(lower),
        ) ?? false
      );
    }
    return false;
  });
};

export const applyFilters = <T extends Record<string, any>>(
  items: T[],
  filterDefs: SanityFilterDef[],
  activeFilters: ActiveFilters,
  locale: string,
): T[] => {
  let result = [...items];

  for (const def of filterDefs) {
    if (def._type === "filterSort") {
      const value = activeFilters["sort"];
      if (value) {
        const dashIdx = value.lastIndexOf("-");
        const field = value.substring(0, dashIdx);
        const direction = value.substring(dashIdx + 1) as "asc" | "desc";
        const dir = direction === "asc" ? 1 : -1;

        result.sort((a, b) => {
          let valA: string | number = 0;
          let valB: string | number = 0;

          if (field === "index") {
            valA = parseInt(a.index ?? "0", 10) || 0;
            valB = parseInt(b.index ?? "0", 10) || 0;
          } else if (field === "title") {
            valA = localize(a.title, locale);
            valB = localize(b.title, locale);
          } else if (field === "dateStart") {
            valA = a.dates?.[0]?.du ?? "";
            valB = b.dates?.[0]?.du ?? "";
          } else if (field === "_createdAt") {
            valA = a._createdAt ?? "";
            valB = b._createdAt ?? "";
          } else if (field === "speaker") {
            valA = a.speaker ?? "";
            valB = b.speaker ?? "";
          }

          if (valA < valB) return -dir;
          if (valA > valB) return dir;
          return 0;
        });
      }
    }

    if (def._type === "filterSearch") {
      const term = activeFilters["search"] ?? "";
      if (term && def.searchIn?.length) {
        result = result.filter((item) =>
          matchesSearch(item, def.searchIn!, term, locale),
        );
      }
    }

    if (def._type === "filterRadio") {
      const value = activeFilters[def.radioKey] ?? "";
      if (value) {
        result = result.filter((item) => {
          if (def.radioKey === "artist") {
            console.log(def);
            return item.artists?.some((a: any) => a._id === value) ?? false;
          }
          if (def.radioKey === "tag") {
            return item.tags?.some((t: any) => t._id === value) ?? false;
          }
          return true;
        });
      }
    }
  }

  return result;
};
