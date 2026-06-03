"use client";
import clsx from "clsx";
import React from "react";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import FHCBDates from "../FHCBDates";
import {
  ExhibitionExpanded,
  SanityImageAssetFull,
} from "@/app/sanity-api/types/sanity-expanded.types";
import {
  _isCurrentExhibition,
  _isFuturExhibition,
  _isHorsLesMurs,
  _isPastExhibition,
} from "@/app/lib/utils";
import CardTags from "./CardTags";
import CardInnerMdRow from "./CardInnerMdRow";
import CardInnerMdCol from "./CardInnerMdCol";
import CardInnerLgRow from "./CardInnerLgRow";

type Props = {
  input: ExhibitionExpanded;
  size?: "sm" | "md" | "lg";
};

const CardExhibition = ({ input, size = "md" }: Props) => {
  const { artists, imageCover, dates, tags } = input;
  const artistList = artists?.map((a) => a.name).join(", ");
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);

  const isPast = _isPastExhibition(dates || []);
  const isCurrent = _isCurrentExhibition(dates || []);
  const isFutur = _isFuturExhibition(dates || []);
  const isHorsLesMurs = tags ? _isHorsLesMurs(tags) : false;
  const isCurrentOrHorsLesMurs = isCurrent || isHorsLesMurs;
  const effectiveSize = isCurrentOrHorsLesMurs ? "lg" : size;

  const cardProps = {
    _type: input._type,
    tags: input.tags?.length ? <CardTags input={input.tags} /> : undefined,
    title: artistList || _localizeField(input.title) || "",
    subTitle: artistList ? (_localizeField(input.title) as string) : undefined,
    imageCover: imageCover?.asset as SanityImageAssetFull,
    linkPrimary: _linkResolver(input),
    linkPrimaryLabel: _localizeText("discoverTheExhibition") as string,
    infoNode: dates?.length ? <FHCBDates input={dates} /> : undefined,
  };

  let inner: React.ReactNode;
  if (effectiveSize === "lg") {
    inner = <CardInnerLgRow {...cardProps} />;
  } else if (effectiveSize === "md" && !isLandscape) {
    inner = (
      <CardInnerMdRow
        {...cardProps}
        textSpan='md:col-span-5'
        imgSpan='md:col-span-7'
      />
    );
  } else {
    inner = <CardInnerMdCol {...cardProps} />;
  }

  return (
    <div
      className={clsx(
        "card card--exhibition",
        `card--${effectiveSize}`,
        effectiveSize === "md" && "md:col-span-2",
        effectiveSize === "lg" && "md:col-span-4",
        isLandscape ? "card--is-landscape" : "card--is-portrait",
        isPast && "card--is-past",
        isCurrent && "card--is-current",
        isFutur && "card--is-futur",
        isHorsLesMurs && "card--is-hors-les-murs",
      )}>
      {inner}
    </div>
  );
};

export default CardExhibition;
