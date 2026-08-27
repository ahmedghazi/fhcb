"use client";
import React, { Fragment } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardFeuilletage from "../ui/cards/CardFeuilletage";
import { FeuilletageExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListFeuilletageUI } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import { withResolvedOptions } from "../ui/filters/collectFilterOptions";
import { usePaginatedFilters } from "../ui/filters/usePaginatedFilters";
import LoadMoreButton from "../ui/LoadMoreButton";

type Props = {
  input: ListFeuilletageUI & {
    items?: FeuilletageExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListFeuilletageUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const { activeFilters, visibleCount, handleFilterChange, loadMore } =
    usePaginatedFilters();

  const filterDefs = withResolvedOptions(
    input.filters ?? [],
    input.items ?? [],
  );
  const filteredItems = applyFilters(
    input.items ?? [],
    filterDefs,
    activeFilters,
    locale,
  );
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <section className='module module--list-feuilletage-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={handleFilterChange} />
          )}
          {visibleItems.length > 0 && (
            <div className='grid md:grid-cols-12 items-start gap-gutter'>
              {visibleItems.map((item: FeuilletageExpanded, index: number) => (
                <Fragment key={`${item._id}-${index}`}>
                  <CardFeuilletage input={item} size='md' />
                </Fragment>
              ))}
            </div>
          )}

          {hasMore && <LoadMoreButton onClick={loadMore} />}
        </div>
      </div>
    </section>
  );
};

export default ModuleListFeuilletageUI;
