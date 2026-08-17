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
import { GridMasonryColumns } from "../ui/GridMasonryColumns";
import { _localizeText } from "../../sanity-api/utils";

// Filtering already runs over the full resolvedItems set fetched at page-load (see applyFilters
// below) — this just caps how many of the (possibly filtered) results get rendered into the DOM at
// once, revealed via the "load more" button. Keeps the initial HTML small without ever limiting
// what filters can match.
const PAGE_SIZE = 24;

type Props = {
  input: ListExhibitionsPastUI & {
    resolvedItems?: ExhibitionExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListExhibitionsPastUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
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
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleFilterChange = (next: ActiveFilters) => {
    setActiveFilters(next);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section className='module module--list-exhibitions-past-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={handleFilterChange} />
          )}

          {visibleItems.length > 0 && (
            // <GridMasonryDessandro>
            //   {visibleItems.map((item: ExhibitionExpanded, index: number) => (
            //     <Fragment key={`--${index}`}>
            //       <div
            //         style={{
            //           width: isMobile
            //             ? "var(--gridder-4_4)"
            //             : "var(--gridder-1_4)",
            //         }}>
            //         <CardExhibition
            //           input={item}
            //           size={"sm"}
            //           footerHover={true}
            //         />
            //       </div>
            //     </Fragment>
            //   ))}
            // </GridMasonryDessandro>
            <GridMasonryColumns items={visibleItems} />
          )}

          {hasMore && (
            <div className='load-more'>
              <button
                type='button'
                className='btn'
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                {_localizeText("loadMore")}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleListExhibitionsPastUI;
