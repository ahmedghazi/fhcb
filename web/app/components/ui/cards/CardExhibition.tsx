"use client";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import {
  _isCurrentByDates,
  _isFuturByDates,
  _isHorsLesMurs,
  _isPastByDates,
} from "@/app/lib/utils";
import { exhibitionToCard } from "./adapters";
import CardBase, { CardFooter } from "./CardBase";

type Props = {
  input: ExhibitionExpanded;
  size?: "sm" | "md" | "lg";
  // context: ''
};

const CardExhibition = ({ input, size = "md" }: Props) => {
  const { imageCover, dates, color, location } = input;
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);

  const isPast = _isPastByDates(dates || []);
  //pb ici avec les expos passées et itinérante (date présente ou futur)
  const isCurrent = _isCurrentByDates(dates || []);
  const isFutur = _isFuturByDates(dates || []);

  const [colorStyle, setColorStyle] = useState<React.CSSProperties | null>(
    null,
  );

  useEffect(() => {
    if (isCurrent) {
      setColorStyle({
        backgroundColor: (color as any)?.hex || "var(--color-bleu)",
      } as React.CSSProperties);
    }
  }, [isCurrent, color]);

  const props = exhibitionToCard(input, size, isCurrent);

  return (
    <div
      className={clsx(
        "card card--exhibition",
        `card--${size}`,
        `card--${props.layout}`,
        isLandscape ? "card--is-landscape" : "card--is-portrait",
        isPast && "card--is-past",
        // isPast && size === "sm" && "card--footer-hover",
        // (footerHover || isPast) && "card--footer-hover",
        isCurrent && "card--is-current",
        isFutur && "card--is-futur",
        location && `card--is-${location}`,
      )}
      style={colorStyle ?? undefined}>
      <CardBase {...props} />
      {size === "md" && !!props.actions?.length && (
        <CardFooter actions={props.actions} />
      )}
    </div>
  );
};

export default CardExhibition;
