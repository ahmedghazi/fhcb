"use client";
import React, { Fragment, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardFeuilletage from "../ui/cards/CardFeuilletage";
import { FeuilletageExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListFeuilletageUI } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "./applyFilters";

type Props = {
  input: ListFeuilletageUI & {
    items?: FeuilletageExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListFeuilletageUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const filterDefs = input.filters ?? [];
  const filteredItems = applyFilters(
    input.items ?? [],
    filterDefs,
    activeFilters,
    locale
  );

  return (
    <section className='module module--list-feuilletage-ui'>
      <div className='module__inner'>
        {filterDefs.length > 0 && (
          <FilterBar filterDefs={filterDefs} onChange={setActiveFilters} />
        )}
        {filteredItems.length > 0 && (
          <div className='grid md:grid-cols-4 items-start gap-gutter'>
            {filteredItems.map((item: FeuilletageExpanded, index: number) => (
              <Fragment key={`${item._id}-${index}`}>
                <CardFeuilletage input={item} size='md' />
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleListFeuilletageUI;
