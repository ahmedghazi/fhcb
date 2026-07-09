"use client";
import clsx from "clsx";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { _isCurrentByDates, _isHorsLesMurs } from "@/app/lib/utils";
import { exhibitionToCard } from "./adapters";
import CardBase from "./CardBase";
import { FhcbDate } from "@/app/sanity-api/types/sanity.types";
import { CSSProperties, forwardRef } from "react";

type Props = {
  input: ExhibitionExpanded;
  style?: CSSProperties;
};

const CardExhibitionFeatured = forwardRef<HTMLDivElement, Props>(
  ({ input, style }, ref) => {
    const { dates, tags, color } = input;
    const isCurrent = _isCurrentByDates(dates || []);
    const isHorsLesMurs = tags ? _isHorsLesMurs(tags) : false;
    const isTube =
      dates?.some((item: FhcbDate) => item.locationType === "inSite-tube") ??
      false;
    const isCube =
      dates?.some((item: FhcbDate) => item.locationType === "inSite-cube") ??
      false;

    const props = exhibitionToCard(input, "md", true);

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: (color as any)?.hex || "var(--color-bleu)",
          gridColumn: isTube ? "span 2" : "span 1",
          ...style,
        }}
        className={clsx(
          "card card--exhibition card--exhibition-featured self-start",
          isCube && "card--is-cube",
          isTube ? "card--is-tube card--md-alt" : "card--sm-alt",
          isCurrent && "card--is-current",
          isHorsLesMurs && "card--is-hors-les-murs",
          `card--${props.layout}`,
        )}>
        <CardBase {...props} />
        {/* {dates && <pre>{JSON.stringify(dates, null, 2)}</pre>} */}
      </div>
    );
  },
);

CardExhibitionFeatured.displayName = "CardExhibitionFeatured";

export default CardExhibitionFeatured;
