"use client";
import { Tag } from "@/app/sanity-api/types/sanity.types";
import {
  EventExpanded,
  FeuilletageExpanded,
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
  input: FeuilletageExpanded;
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
const CardFeuilletage = ({ input, size = "md" }: Props) => {
  const {
    _type,
    title,
    subTitle,
    description,
    dates,
    tags,
    index,
    imageCover,
    chercheur,
  } = input;
  const tagsClassList = tags
    ?.map((tag: Tag) => `card--${tag.slug?.current}`)
    .join(" ");
  let tagsTitleList = tags
    ?.map((tag: Tag) => {
      return tag.slug?.current === "feuilletage"
        ? `Feuilletage #${index}`
        : tag.title;
    })
    .map(_localizeField)
    .join(", ");

  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  return (
    <div
      className={clsx(
        "card card--feuilletage",
        `card--${size}`,
        size === "md" && "md:col-span-2",
        size === "lg" && "md:col-span-4",
        isLandscape && `card--is-landscape`,
        !isLandscape && "card--is-portrait",
        tagsClassList,
      )}>
      {/* <pre>{JSON.stringify(dates, null, 2)}</pre> */}
      {/* {size === "sm" && (
        <CardInnerSM
          _type={_type}
          tags={tagsTitleList || ""}
          title={_localizeField(title) || ""}
          subtitle={[_localizeField(subTitle), chercheur?.name].filter(Boolean).join(' — ')}
          info={_localizeField(description)}
          infoNode={dates ? <FHCBDates input={dates} /> : null}
          imageCover={imageCover?.asset as SanityImageAssetFull}
          linkPrimary={_linkResolver(input)}
          linkPrimaryLabel={_localizeText("discover")}
        />
      )} */}
      {size === "md" && (
        <CardInnerMD
          _type={_type}
          tags={tagsTitleList || `FEUILLETAGE #${index}`}
          title={_localizeField(title) || ""}
          subtitle={[_localizeField(subTitle), chercheur?.name].filter(Boolean).join(' — ')}
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
          subtitle={[_localizeField(subTitle), chercheur?.name].filter(Boolean).join(' — ')}
          info={_localizeField(description)}
          imageCover={imageCover?.asset as SanityImageAssetFull}
          linkPrimary={_linkResolver(input)}
          linkPrimaryLabel={_localizeText("discover")}
        />
      )}
    </div>
  );
};

export default CardFeuilletage;
