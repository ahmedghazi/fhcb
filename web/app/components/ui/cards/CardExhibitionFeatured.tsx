"use client";
import clsx from "clsx";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { _isCurrentExhibition, _isHorsLesMurs } from "@/app/lib/utils";
import { exhibitionToCard } from "./adapters";
import CardBase from "./CardBase";
import { FhcbDate } from "@/app/sanity-api/types/sanity.types";
import { useEffect, useRef } from "react";

type Props = {
  input: ExhibitionExpanded;
};

const CardExhibitionFeatured = ({ input }: Props) => {
  const { dates, tags, color } = input;
  const ref = useRef<HTMLDivElement>(null);
  const isCurrent = _isCurrentExhibition(dates || []);
  const isHorsLesMurs = tags ? _isHorsLesMurs(tags) : false;
  // const isTube = (input as any).location === "inside-tube";
  const isTube =
    dates?.some((item: FhcbDate) => item.locationType === "inSite-tube") ??
    false;

  const props = exhibitionToCard(input, "md", true);

  useEffect(() => {
    _onResize();
    window.addEventListener("resize", _onResize);
    return () => {
      window.removeEventListener("resize", _onResize);
    };
  }, []);

  const _onResize = () => {
    if (ref.current) {
      resizeGridItem(ref.current);
    }
  };

  function resizeGridItem(item: HTMLDivElement) {
    const grid = item.parentElement;
    if (!grid) return;
    console.log(grid);
    const rowHeight = parseInt(
      getComputedStyle(grid).getPropertyValue("grid-auto-rows"),
    );

    const gap = parseInt(getComputedStyle(grid).getPropertyValue("gap"));
    const height = item.getBoundingClientRect().height;
    const rowSpan = Math.ceil((height + gap) / (rowHeight + gap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  }
  return (
    <div
      ref={ref}
      style={{
        backgroundColor: (color as any)?.hex || "var(--color-bleu)",
        gridColumn: isTube ? "span 2" : "span 1",
      }}
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
