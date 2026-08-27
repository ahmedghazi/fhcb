"use client";
import { Fragment, useEffect } from "react";
import dynamic from "next/dynamic";
import useLocale from "@/app/context/LocaleContext";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListProductUI } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import { withResolvedOptions } from "../ui/filters/collectFilterOptions";
import { usePaginatedFilters } from "../ui/filters/usePaginatedFilters";
import LoadMoreButton from "../ui/LoadMoreButton";
import { publish } from "pubsub-js";
import { _localizeText } from "../../sanity-api/utils";

const GridMasonryColumns = dynamic(() =>
  import("../ui/GridMasonryColumns").then((mod) => mod.GridMasonryColumns),
);

type Props = {
  input: ListProductUI & {
    resolvedItems?: ProductExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListProductUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const { activeFilters, visibleCount, handleFilterChange, loadMore } =
    usePaginatedFilters();
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

          {filteredItems.length === 0 &&
            Object.keys(activeFilters).length > 0 && (
              <p className='text-center'>{_localizeText("noResultShop")}</p>
            )}

          {hasMore && <LoadMoreButton onClick={loadMore} />}
        </div>
      </div>
    </section>
  );
};

export default ModuleListProductUI;
