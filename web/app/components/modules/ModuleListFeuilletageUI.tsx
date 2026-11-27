"use client";
import React, { Fragment, useEffect, useState } from "react";
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
import { _shuffle } from "@/app/lib/utils";
import "./ModuleListFeuilletageUI.scss";

type Props = {
  input: ListFeuilletageUI & {
    maxItems?: number;
    items?: FeuilletageExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListFeuilletageUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const {
    activeFilters,
    visibleCount,
    handleFilterChange,
    resetVisibleCount,
    loadMore,
  } = usePaginatedFilters();

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

  // start with the original (server-rendered) order to avoid a hydration
  // mismatch, then shuffle client-side after mount / when filters change
  // const [shuffledItems, setShuffledItems] = useState(filteredItems);
  const filteredItemsKey = filteredItems.map((item) => item._id).join(",");

  useEffect(() => {
    // setShuffledItems(_shuffle(filteredItems));
    resetVisibleCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredItemsKey]);

  // maxItems caps the list (no pagination), otherwise paginate with load more
  const limit = input.maxItems || visibleCount;
  const visibleItems = filteredItems.slice(0, limit);
  const hasMore = !input.maxItems && visibleCount < filteredItems.length;

  return (
    <section className='module module--list-feuilletage-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={handleFilterChange} />
          )}
          {visibleItems.length > 0 && (
            <div className='grid md:grid-cols-12 items-start gap-sm md:gap-gutter'>
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
