"use client";
import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useLocale from "@/app/context/LocaleContext";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListProductUI } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import { withResolvedOptions } from "../ui/filters/collectFilterOptions";
import { publish } from "pubsub-js";
import { _localizeText } from "../../sanity-api/utils";

const GridMasonryColumns = dynamic(() =>
  import("../ui/GridMasonryColumns").then((mod) => mod.GridMasonryColumns),
);

// Filtering already runs over the full resolvedItems set fetched at page-load (see applyFilters
// below) — this just caps how many of the (possibly filtered) results get rendered into the DOM at
// once, revealed via the "load more" button. Keeps the initial HTML small (React warns above ~512kB
// of un-Suspense'd document) without ever limiting what filters can match.
const PAGE_SIZE = 24;

type Props = {
  input: ListProductUI & {
    resolvedItems?: ProductExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListProductUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const rawFilterDefs: SanityFilterDef[] = input.filters ?? [];
  const filterDefs = withResolvedOptions(
    rawFilterDefs,
    input.resolvedItems ?? [],
  );

  const filteredItems = applyFilters(
    input.resolvedItems ?? [],
    filterDefs,
    activeFilters,
    locale,
  );
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  // a new filter selection can surface items beyond however many were previously revealed (or
  // fewer than are currently shown) — always start back at the first page when it changes.
  const handleFilterChange = (next: ActiveFilters) => {
    setActiveFilters(next);
    setVisibleCount(PAGE_SIZE);
  };

  useEffect(() => {
    const hasFilters = Object.keys(activeFilters).length > 0;
    publish("IS_FILTERING", hasFilters);
  }, [activeFilters]);

  return (
    <section className='module module--list-product-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={handleFilterChange} />
          )}

          {visibleItems.length > 0 && (
            <GridMasonryColumns items={visibleItems} />
          )}

          {hasMore && (
            <div className='load-more'>
              <button
                type='button'
                className='btn'
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                {_localizeText("loadMore")}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleListProductUI;
