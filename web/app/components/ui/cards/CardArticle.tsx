"use client";
import { Tag } from "@/app/sanity-api/types/sanity.types";
import {
  ArticleExpanded,
  SanityImageAssetFull,
} from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import React from "react";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import CardInnerMD from "./CardInnerMD";

type Props = {
  input: ArticleExpanded;
  size?: "sm" | "md" | "lg";
};

const CardArticle = ({ input, size = "md" }: Props) => {
  const { _type, title, tags, imageCover } = input;
  const tagsClassList = tags
    ?.map((tag: Tag) => `card--${tag.slug?.current}`)
    .join(" ");
  const tagsTitleList = tags?.map((tag: Tag) => _localizeField(tag.title)).join(", ");

  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);

  return (
    <div
      className={clsx(
        "card card--article",
        `card--${size}`,
        size === "md" && "md:col-span-2",
        isLandscape && "card--is-landscape",
        !isLandscape && "card--is-portrait",
        tagsClassList,
      )}>
      <CardInnerMD
        _type={_type}
        tags={tagsTitleList || ""}
        title={_localizeField(title) || ""}
        imageCover={imageCover?.asset as SanityImageAssetFull}
        linkPrimary={_linkResolver(input)}
        linkPrimaryLabel={_localizeText("discover")}
      />
    </div>
  );
};

export default CardArticle;
