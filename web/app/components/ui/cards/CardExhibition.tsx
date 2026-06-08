"use client";
import clsx from "clsx";
import React from "react";
import { ExhibitionExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import {
  _isCurrentExhibition,
  _isFuturExhibition,
  _isHorsLesMurs,
  _isPastExhibition,
} from "@/app/lib/utils";
import { exhibitionToCard } from "./adapters";
import CardBase, { CardFooter } from "./CardBase";

type Props = {
  input: ExhibitionExpanded;
  size?: "sm" | "md" | "lg";
};

const CardExhibition = ({ input, size = "md" }: Props) => {
  const { imageCover, dates, tags, color, location } = input;
  // const artistList = artists?.map((a) => a.name).join(", ");
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);

  const isPast = _isPastExhibition(dates || []);
  //pb ici avec les expos passées et itinérante (date présente ou futur)
  const isCurrent = _isCurrentExhibition(dates || []);
  const isFutur = _isFuturExhibition(dates || []);
  const isHorsLesMurs = tags ? _isHorsLesMurs(tags) : false;

  const props = exhibitionToCard(input, size);
  console.log(input);
  return (
    <div
      className={clsx(
        "card card--exhibition",
        `card--${size}`,
        `card--${props.layout}`,
        isLandscape ? "card--is-landscape" : "card--is-portrait",
        isPast && "card--is-past",
        isCurrent && "card--is-current",
        isFutur && "card--is-futur",
        `card--is-${location}`,
      )}
      style={{ backgroundColor: (color as any)?.hex || "var(--color-bleu)" }}>
      <CardBase {...props} />
      {size === "md" && !!props.actions?.length && (
        <CardFooter actions={props.actions} />
      )}
    </div>
  );
};

export default CardExhibition;
