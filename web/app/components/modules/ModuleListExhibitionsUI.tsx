"use client";
import { Fragment, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardExhibition from "../ui/cards/CardExhibition";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListExhibitionsUI } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "./applyFilters";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

type Props = {
  input: ListExhibitionsUI & {
    items:
      | "exhibitions-current"
      | "exhibitions-past"
      | "exhibitions-futur"
      | "exhibitions-out-of-the-box";
    resolvedItems?: ExhibitionExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListExhibitionsUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const filterDefs = input.filters ?? [];
  const filteredItems = applyFilters(
    input.resolvedItems ?? [],
    filterDefs,
    activeFilters,
    locale,
  );

  const isExhibitionsPast = input.items == "exhibitions-past";

  const isExhibitionSmall =
    input.items === "exhibitions-out-of-the-box" ||
    input.items === "exhibitions-past";

  return (
    <section className='module module--list-exhibitions'>
      <div className='module__inner'>
        {filterDefs.length > 0 && (
          <FilterBar filterDefs={filterDefs} onChange={setActiveFilters} />
        )}
        {!isExhibitionsPast && filteredItems.length > 0 && (
          <div
            className='grid md:grid-cols-4 gap-gutter'
            style={{
              gridTemplateColumns: "repeat(auto-fit, var(--gridder-1))",
              justifyContent: "center",
            }}>
            {filteredItems.map((item: ExhibitionExpanded, index: number) => (
              <Fragment key={`${item._id}-${index}`}>
                <div className={`md:col-span-${isExhibitionSmall ? 1 : 4}`}>
                  <CardExhibition
                    input={item}
                    size={isExhibitionSmall ? "sm" : "lg"}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        )}
        {isExhibitionsPast && filteredItems.length > 0 && (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
            // gutterBreakPoints={{350: "12px", 750: "16px", 900: "24px"}}
          >
            {filteredItems.map((item: ExhibitionExpanded, index: number) => (
              <Fragment key={`${item._id}-${index}`}>
                <div className={`md:col-span-${isExhibitionSmall ? 1 : 4}`}>
                  <CardExhibition
                    input={item}
                    size={isExhibitionSmall ? "sm" : "lg"}
                  />
                </div>
              </Fragment>
            ))}
          </ResponsiveMasonry>
        )}
      </div>
    </section>
  );
};

export default ModuleListExhibitionsUI;
