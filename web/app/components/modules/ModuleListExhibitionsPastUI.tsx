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
import { withResolvedOptions } from "../ui/filters/collectFilterOptions";
import GridMasonryDessandro from "../ui/GridMasonryDessandro";
import useDeviceDetect from "@/app/hooks/useDeviceDetect";

type Props = {
  input: ListExhibitionsPastUI & {
    resolvedItems?: ExhibitionExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListExhibitionsPastUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const { isMobile } = useDeviceDetect();
  const filterDefs = withResolvedOptions(
    input.filters ?? [],
    input.resolvedItems ?? [],
  );
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
            <GridMasonryDessandro>
              {filteredItems.map((item: ExhibitionExpanded, index: number) => (
                <Fragment key={`--${index}`}>
                  <div
                    style={{
                      width: isMobile
                        ? "var(--gridder-4_4)"
                        : "var(--gridder-1_4)",
                    }}>
                    <CardExhibition
                      input={item}
                      size={"sm"}
                      footerHover={true}
                    />
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

export default ModuleListExhibitionsPastUI;
