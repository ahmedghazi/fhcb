"use client";
import clsx from "clsx";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { _isCurrentExhibition, _isHorsLesMurs } from "@/app/lib/utils";
import { exhibitionToCard } from "./adapters";
import CardBase from "./CardBase";

type Props = {
  input: ExhibitionExpanded;
};

const CardExhibitionFeatured = ({ input }: Props) => {
  const { dates, tags, color } = input;
  const isCurrent = _isCurrentExhibition(dates || []);
  const isHorsLesMurs = tags ? _isHorsLesMurs(tags) : false;
  const isTube = (input as any).location === "inside-tube";

  const props = exhibitionToCard(input, "md", true);

  return (
    <div
      style={{ backgroundColor: (color as any)?.hex || "var(--color-bleu)" }}
      className={clsx(
        "card card--exhibition card--exhibition-featured",
        isTube ? "card--md-alt" : "card--sm-alt",
        isCurrent && "card--is-current",
        isHorsLesMurs && "card--is-hors-les-murs",
        `card--${props.layout}`,
      )}>
      {/* {input.location} */}
      <CardBase {...props} />
    </div>
  );
};

export default CardExhibitionFeatured;
