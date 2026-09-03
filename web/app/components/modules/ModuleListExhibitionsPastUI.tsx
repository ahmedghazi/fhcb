"use client";
import { Fragment } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardExhibition from "../ui/cards/CardExhibition";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import {
  ListExhibitionsPastUI,
  ListExhibitionsUI,
} from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import { withResolvedOptions } from "../ui/filters/collectFilterOptions";
import { usePaginatedFilters } from "../ui/filters/usePaginatedFilters";
import LoadMoreButton from "../ui/LoadMoreButton";
import { GridMasonryColumns } from "../ui/GridMasonryColumns";

type Props = {
  input: ListExhibitionsPastUI & {
    resolvedItems?: ExhibitionExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListExhibitionsPastUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const { activeFilters, visibleCount, handleFilterChange, loadMore } =
    usePaginatedFilters();
  const filterDefs = withResolvedOptions(
    input.filters ?? [],
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

  return (
    <section className='module module--list-exhibitions-past-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={handleFilterChange} />
          )}

          {visibleItems.length > 0 && (
            <GridMasonryColumns items={visibleItems} />
          )}

          {hasMore && <LoadMoreButton onClick={loadMore} />}
        </div>
      </div>
    </section>
  );
};

export default ModuleListExhibitionsPastUI;
