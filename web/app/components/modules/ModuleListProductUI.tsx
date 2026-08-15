"use client";
import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useLocale from "@/app/context/LocaleContext";
import CardProduct from "../ui/cards/CardProduct";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListProductUI } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import { withResolvedOptions } from "../ui/filters/collectFilterOptions";
import { publish } from "pubsub-js";

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
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
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

  useEffect(() => {
    const hasFilters = Object.keys(activeFilters).length > 0;
    publish("IS_FILTERING", hasFilters);
  }, [activeFilters]);

  return (
    <section className='module module--list-product-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={setActiveFilters} />
          )}

          {filteredItems.length > 0 && (
            <GridMasonryColumns items={filteredItems} />
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleListProductUI;
