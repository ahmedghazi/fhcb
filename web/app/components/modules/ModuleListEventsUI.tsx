"use client";
import { Fragment, useState } from "react";
import useLocale from "@/app/context/LocaleContext";
import CardEvent from "../ui/cards/CardEvent";
import { EventExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { ListEventsUI } from "@/app/sanity-api/types/sanity.types";
import FilterBar from "../ui/filters/FilterBar";
import { ActiveFilters, SanityFilterDef } from "../ui/filters/filters.types";
import { applyFilters } from "../ui/filters/applyFilters";

type Props = {
  input: ListEventsUI & {
    resolvedItems?: EventExpanded[];
    filters?: SanityFilterDef[];
  };
};

const ModuleListEventsUI = ({ input }: Props) => {
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
    <section className='module module--list-events'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {filterDefs.length > 0 && (
            <FilterBar filterDefs={filterDefs} onChange={setActiveFilters} />
          )}
          {filteredItems.length > 0 && (
            <div
              className='grid--centered'
              style={
                {
                  // gridTemplateColumns: "repeat(auto-fit, var(--gridder-1_4))",
                  // justifyContent: "center",
                }
              }>
              {filteredItems.map((item: EventExpanded, index: number) => (
                <Fragment key={`${item._id}-${index}`}>
                  <CardEvent input={item} size='sm' />
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
