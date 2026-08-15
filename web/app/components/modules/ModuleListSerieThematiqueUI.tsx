"use client";
import React, { Fragment, useEffect, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardArticle from "../ui/cards/CardArticle";
import {
  ArticleExpanded,
  SerieThematiqueExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import {
  ListSerieThematiqueUI,
  SerieThematique,
} from "@/app/sanity-api/types/sanity.types";
import CardSerieThematique from "../ui/cards/CardSerieThematique";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import { withResolvedOptions } from "../ui/filters/collectFilterOptions";
import FilterBar from "../ui/filters/FilterBar";
import { _shuffle } from "@/app/lib/utils";

type Props = {
  // input: ListSerieThematiqueUI & { items?: SerieThematique[] };
  input: ListSerieThematiqueUI & {
    items?: SerieThematiqueExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListSerieThematiqueUI = ({ input }: Props) => {
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
    <section className='module module--list-serie-thematique-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={setActiveFilters} />
          )}

          {shuffledItems.length > 0 && (
            <div className='grid md:grid-cols-12 items-start gap-gutter'>
              {shuffledItems.map(
                (item: SerieThematiqueExpanded, index: number) => (
                  <Fragment key={`${item._id}-${index}`}>
                    <CardSerieThematique input={item} size='md' />
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

export default ModuleListSerieThematiqueUI;
