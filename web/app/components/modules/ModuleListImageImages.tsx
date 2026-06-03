"use client";
import React, { Fragment, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardImageImages from "../ui/cards/CardImageImages";
import { ImageImagesExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListImageImages } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "./applyFilters";

type Props = {
  input: ListImageImages & {
    items?: ImageImagesExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListImageImages = ({ input }: Props) => {
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
    <section className='module module--list-image-images'>
      <div className='module__inner'>
        {filterDefs.length > 0 && (
          <FilterBar filterDefs={filterDefs} onChange={setActiveFilters} />
        )}
        {filteredItems.length > 0 && (
          <div className='grid md:grid-cols-12 items-start gap-gutter'>
            {filteredItems.map((item: ImageImagesExpanded, index: number) => (
              <Fragment key={`${item._id}-${index}`}>
                <CardImageImages input={item} size='md' />
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModuleListImageImages;
