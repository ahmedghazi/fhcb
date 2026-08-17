"use client";
import React, { Fragment, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardImageImages from "../ui/cards/CardImageImages";
import { ImageImagesExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListImageImages } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";
import { withResolvedOptions } from "../ui/filters/collectFilterOptions";
import { _localizeText } from "../../sanity-api/utils";

// Filtering already runs over the full items set fetched at page-load (see applyFilters below) —
// this just caps how many of the (possibly filtered) results get rendered into the DOM at once,
// revealed via the "load more" button. Keeps the initial HTML small without ever limiting what
// filters can match.
const PAGE_SIZE = 24;

type Props = {
  input: ListImageImages & {
    items?: ImageImagesExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListImageImages = ({ input }: Props) => {
  const { locale } = useLocale();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleFilterChange = (next: ActiveFilters) => {
    setActiveFilters(next);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section className='module module--list-image-images'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={handleFilterChange} />
          )}
          {visibleItems.length > 0 && (
            <div className='grid md:grid-cols-12 items-start gap-gutter'>
              {visibleItems.map((item: ImageImagesExpanded, index: number) => (
                <Fragment key={`${item._id}-${index}`}>
                  <CardImageImages input={item} size='md' />
                </Fragment>
              ))}
            </div>
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

export default ModuleListImageImages;
