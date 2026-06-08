"use client";
import { Fragment, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardProduct from "../ui/cards/CardProduct";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListProductUI } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "./applyFilters";
import GridMasonry from "../ui/GridMasonry";

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

  return (
    <section className='module module--list-product-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={setActiveFilters} />
          )}

          {filteredItems.length > 0 && (
            <GridMasonry columns={4}>
              {filteredItems.map((item: ProductExpanded, index: number) => (
                <Fragment key={`--${index}`}>
                  <div
                    style={{
                      width: "var(--gridder-1_4)",
                    }}>
                    <CardProduct input={item} size={"sm"} />
                  </div>
                </Fragment>
              ))}
            </GridMasonry>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleListProductUI;
