"use client";
import { Fragment, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardExhibition from "../ui/cards/CardExhibition";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import {
  ListExhibitionsPastUI,
  ListExhibitionsUI,
} from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import GridMasonry from "../ui/GridMasonry";

type Props = {
  input: ListExhibitionsPastUI & {
    resolvedItems?: ExhibitionExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListExhibitionsPastUI = ({ input }: Props) => {
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
    <section className='module module--list-exhibitions-past-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={setActiveFilters} />
          )}

          {filteredItems.length > 0 && (
            <GridMasonry columns={4}>
              {filteredItems.map((item: ExhibitionExpanded, index: number) => (
                <Fragment key={`--${index}`}>
                  <div
                    style={{
                      width: "var(--gridder-1_4)",
                    }}>
                    <CardExhibition input={item} size={"sm"} />
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

export default ModuleListExhibitionsPastUI;
