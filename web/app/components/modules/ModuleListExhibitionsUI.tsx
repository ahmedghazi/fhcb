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
import { _isPastHorOutside } from "@/app/lib/utils";

type Props = {
  input: ListExhibitionsUI & {
    items:
      | "exhibitions-current"
      | "exhibitions-past"
      | "exhibitions-futur"
      | "exhibitions-out-of-the-box";
    resolvedItems?: ExhibitionExpanded[];
    // filters?: SanityFilterDef[];
  };
};

const ModuleListExhibitionsUI = ({ input }: Props) => {
  const isExhibitionSmall =
    input.items === "exhibitions-out-of-the-box" ||
    input.items === "exhibitions-past";
  const __isPastHorOutside = (item: ExhibitionExpanded) => {
    return _isPastHorOutside(item);
  };

  return (
    <section className='module module--list-exhibitions'>
      {/* <pre>{JSON.stringify(input, null, 2)}</pre> */}
      <div className='container-fluid'>
        <div className='module__inner'>
          <div
            className='grid md:grid-cols-4 gap-gutter'
            style={{
              gridTemplateColumns: "repeat(auto-fit, var(--gridder-1_4))",
              justifyContent: "center",
            }}>
            {input.resolvedItems?.map(
              (item: ExhibitionExpanded, index: number) => (
                <Fragment key={`${item._id}-${index}`}>
                  <div
                    className={`md:col-span-${__isPastHorOutside(item) ? 1 : 4}`}>
                    <CardExhibition
                      input={item}
                      size={__isPastHorOutside(item) ? "sm" : "lg"}
                    />
                  </div>
                </Fragment>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleListExhibitionsUI;
