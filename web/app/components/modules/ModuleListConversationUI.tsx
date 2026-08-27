"use client";
import React, { Fragment, useEffect, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardConversation from "../ui/cards/CardConversation";
import { ConversationExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListConversationUI } from "@/app/sanity-api/types/sanity.types";
import { SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import { withResolvedOptions } from "../ui/filters/collectFilterOptions";
import FilterBar from "../ui/filters/FilterBar";
import { usePaginatedFilters } from "../ui/filters/usePaginatedFilters";
import LoadMoreButton from "../ui/LoadMoreButton";
import { _shuffle } from "@/app/lib/utils";

type Props = {
  input: ListConversationUI & {
    items?: ConversationExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListConversationUI = ({ input }: Props) => {
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
  const [shuffledItems, setShuffledItems] = useState(filteredItems);
  const filteredItemsKey = filteredItems.map((item) => item._id).join(",");

  useEffect(() => {
    setShuffledItems(_shuffle(filteredItems));
    resetVisibleCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredItemsKey]);

  const visibleItems = shuffledItems.slice(0, visibleCount);
  const hasMore = visibleCount < shuffledItems.length;

  return (
    <section className='module module--list-conversation-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={handleFilterChange} />
          )}

          {visibleItems.length > 0 && (
            <div className='grid md:grid-cols-12 items-start gap-gutter'>
              {visibleItems.map(
                (item: ConversationExpanded, index: number) => (
                  <Fragment key={`${item._id}-${index}`}>
                    <CardConversation input={item} size='md' />
                  </Fragment>
                ),
              )}
            </div>
          )}

          {hasMore && <LoadMoreButton onClick={loadMore} />}
        </div>
      </div>
    </section>
  );
};

export default ModuleListConversationUI;
