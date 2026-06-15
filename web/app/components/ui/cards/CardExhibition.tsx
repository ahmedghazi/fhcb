"use client";
import clsx from "clsx";
import React from "react";
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
};

const CardExhibition = ({ input, size = "md" }: Props) => {
  const { imageCover, dates, tags, color, location } = input;
  // const artistList = artists?.map((a) => a.name).join(", ");
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);

  const isPast = _isPastByDates(dates || []);
  //pb ici avec les expos passées et itinérante (date présente ou futur)
  const isCurrent = _isCurrentByDates(dates || []);
  const isFutur = _isFuturByDates(dates || []);
  // const isHorsLesMurs = tags ? _isHorsLesMurs(tags) : false;

  const props = exhibitionToCard(input, size);
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
      )}>
      {/* <pre>{JSON.stringify({ isPast, isCurrent, isFutur }, null, 2)}</pre> */}
      <CardBase {...props} />
      {size === "md" && !!props.actions?.length && (
        <CardFooter actions={props.actions} />
      )}
    </div>
  );
};

export default CardExhibition;
