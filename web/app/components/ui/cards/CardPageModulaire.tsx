"use client";
import { Tag } from "@/app/sanity-api/types/sanity.types";
import {
  PageModulaireExpanded,
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
  input: PageModulaireExpanded;
  size?: "md";
};

const CardPageModulaire = ({ input, size = "md" }: Props) => {
  const { _type, title, imageCover } = input;

  return (
    <div
      className={clsx(
        "card card--page-modulaire",
        `card--${size}`,
        `card--${size}-alt`,
        // "md:col-span-2",
        // size === "md" && "md:col-span-2",
        // isLandscape && "card--is-landscape",
        // !isLandscape && "card--is-portrait",
      )}>
      {/* <pre>{JSON.stringify(input, null, 2)}</pre> */}
      <CardInnerMD
        _type={_type}
        title={_localizeField(title) || ""}
        imageCover={imageCover?.asset as SanityImageAssetFull}
        linkPrimary={_linkResolver(input)}
        linkPrimaryLabel={_localizeText("discover")}
      />
    </div>
  );
};

export default CardPageModulaire;
