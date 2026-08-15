"use client";
import React, { Fragment, useEffect, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardConversation from "../ui/cards/CardConversation";
import { ConversationExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListConversationUI } from "@/app/sanity-api/types/sanity.types";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import { withResolvedOptions } from "../ui/filters/collectFilterOptions";
import FilterBar from "../ui/filters/FilterBar";
import { _shuffle } from "@/app/lib/utils";

type Props = {
  input: ListConversationUI & {
    items?: ConversationExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListConversationUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredItemsKey]);

  return (
    <section className='module module--list-conversation-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={setActiveFilters} />
          )}

          {shuffledItems.length > 0 && (
            <div className='grid md:grid-cols-12 items-start gap-gutter'>
              {shuffledItems.map(
                (item: ConversationExpanded, index: number) => (
                  <Fragment key={`${item._id}-${index}`}>
                    <CardConversation input={item} size='md' />
                  </Fragment>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleListConversationUI;
