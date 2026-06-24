"use client";
import { Fragment, useEffect, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardProduct from "../ui/cards/CardProduct";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListProductUI } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import GridMasonry from "../ui/GridMasonry";
import { publish } from "pubsub-js";
import GridMasonryDessandro from "../ui/GridMasonryDessandro";

type Props = {
  input: ListProductUI & {
    resolvedItems?: ProductExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListProductUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const filterDefs = input.filters ?? [];
  const filteredItems = applyFilters(
    input.resolvedItems ?? [],
    filterDefs,
    activeFilters,
    locale,
  );

  useEffect(() => {
    console.log(activeFilters);
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
            <GridMasonryDessandro>
              {filteredItems.map((item: ProductExpanded, index: number) => (
                <Fragment key={`--${index}`}>
                  <div
                    style={
                      {
                        // width: "var(--gridder-1_4)",
                      }
                    }>
                    <CardProduct input={item} size={"sm"} />
                  </div>
                </Fragment>
              ))}
            </GridMasonryDessandro>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleListProductUI;
