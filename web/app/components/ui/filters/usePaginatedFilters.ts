import { useState } from "react";
import { ActiveFilters } from "./filters.types";

// Filtering runs over the full item set fetched at page-load — this only caps how many of the
// (possibly filtered) results get rendered into the DOM at once, revealed via "load more". Keeps
// the initial HTML small (React warns above ~512kB of un-Suspense'd document) without ever
// limiting what filters can match.
const PAGE_SIZE = 12;

// Owns the two bits of state every moduleList-with-FilterBar page needs: which filters are
// active, and how many of the filtered results are currently revealed. Callers still run
// applyFilters (and any shuffling) themselves, since that part differs per module.
export function usePaginatedFilters(pageSize: number = PAGE_SIZE) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // a new filter selection can surface items beyond however many were previously revealed (or
  // fewer than are currently shown) — always start back at the first page when it changes.
  const handleFilterChange = (next: ActiveFilters) => {
    setActiveFilters(next);
    setVisibleCount(pageSize);
  };

  const resetVisibleCount = () => setVisibleCount(pageSize);
  const loadMore = () => setVisibleCount((count) => count + pageSize);

  return {
    activeFilters,
    visibleCount,
    handleFilterChange,
    resetVisibleCount,
    loadMore,
  };
}
