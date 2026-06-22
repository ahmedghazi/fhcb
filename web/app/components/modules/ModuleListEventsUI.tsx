"use client";
import { Fragment, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardEvent from "../ui/cards/CardEvent";
import { EventExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListEventsUI, Tag } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";

type Props = {
  input: ListEventsUI & {
    resolvedItems?: EventExpanded[];
    // filters?: SanityFilterDef[];
  };
};

const ModuleListEventsUI = ({ input }: Props) => {
  const { locale } = useLocale();
  const { cardSize, resolvedItems } = input;
  // const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  // const filterDefs = input.filters ?? [];
  // const filteredItems = applyFilters(
  //   input.resolvedItems ?? [],
  //   filterDefs,
  //   activeFilters,
  //   locale,
  // );

  return (
    <section className='module module--list-events'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {/* {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={setActiveFilters} />
          )} */}
          {(resolvedItems?.length ?? 0) > 0 && (
            <div
              className={
                cardSize !== "lg" ? "grid--centered" : "grid gap-gutter"
              }>
              {resolvedItems?.map((item: EventExpanded, index: number) => (
                <Fragment key={`${item._id}-${index}`}>
                  <CardEvent
                    input={item}
                    size={cardSize === "lg" ? "lg" : "sm"}
                  />
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModuleListEventsUI;
