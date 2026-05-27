"use client";
import { Tag } from "@/app/sanity-api/types/sanity.types";
import {
  EventExpanded,
  SanityImageAssetFull,
} from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import React from "react";
import Figure from "../Figure";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import CardInnerSM from "./CardInnerSM";
import CardInnerMD from "./CardInnerMD";
import CardInnerLG from "./CardInnerLG";
import FHCBDates from "../FHCBDates";

type Props = {
  input: EventExpanded;
  size?: "sm" | "md" | "lg";
};

/**
 * cette card peux avoir plusieurs look
 * ex:
 * visite = s, fond jaune
 * event = m, fond vert
 * event dans programme = l, fond gris
 *
 */
const CardEvent = ({ input, size = "md" }: Props) => {
  const { _type, title, subTitle, description, tags, imageCover, dates } =
    input;
  const tagsClassList = tags
    ?.map((tag: Tag) => `card--${tag.slug?.current}`)
    .join(" ");
  const tagsTitleList = tags
    ?.map((tag: Tag) => tag.title)
    .map(_localizeField)
    .join(", ");
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  return (
    <div
      className={clsx(
        "card card--event",
        `card--${size}`,
        size === "md" && "md:col-span-2",
        size === "lg" && "md:col-span-4",
        isLandscape && `card--is-landscape`,
        !isLandscape && "card--is-portrait",
        tagsClassList,
      )}>
      {size === "sm" && (
        <CardInnerSM
          _type={_type}
          tags={tagsTitleList || ""}
          title={_localizeField(title) || ""}
          subtitle={_localizeField(subTitle)}
          info={_localizeField(description)}
          infoNode={dates ? <FHCBDates input={dates} /> : null}
          imageCover={imageCover?.asset as SanityImageAssetFull}
          linkPrimary={_linkResolver(input)}
          linkPrimaryLabel={_localizeText("discover")}
        />
      )}
      {size === "md" && (
        <CardInnerMD
          _type={_type}
          tags={tagsTitleList || ""}
          title={_localizeField(title) || ""}
          subtitle={_localizeField(subTitle)}
          info={_localizeField(description)}
          infoNode={dates ? <FHCBDates input={dates} /> : null}
          imageCover={imageCover?.asset as SanityImageAssetFull}
          linkPrimary={_linkResolver(input)}
          linkPrimaryLabel={_localizeText("discover")}
        />
      )}
      {size === "lg" && (
        <CardInnerLG
          _type={_type}
          tags={tagsTitleList || ""}
          title={_localizeField(title) || ""}
          subtitle={_localizeField(subTitle)}
          info={_localizeField(description)}
          imageCover={imageCover?.asset as SanityImageAssetFull}
          linkPrimary={_linkResolver(input)}
          linkPrimaryLabel={_localizeText("discover")}
        />
      )}
    </div>
  );
};

export default CardEvent;
