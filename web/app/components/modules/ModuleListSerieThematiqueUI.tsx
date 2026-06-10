"use client";
import React, { Fragment, useState } from "react";
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
import { applyFilters } from "./applyFilters";
import FilterBar from "../ui/filters/FilterBar";

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

  const filterDefs = input.filters ?? [];
  const filteredItems = applyFilters(
    input.items ?? [],
    filterDefs,
    activeFilters,
    locale,
  );
  return (
    <section className='module module--list-serie-thematique-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={setActiveFilters} />
          )}

          {filteredItems.length > 0 && (
            <div className='grid md:grid-cols-12 items-start gap-gutter'>
              {filteredItems.map(
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
