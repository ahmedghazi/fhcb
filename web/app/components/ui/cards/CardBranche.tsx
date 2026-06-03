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
import CardInnerSM from "./CardInnerSM";
import { usePageContext } from "@/app/context/PageContext";

type Props = {
  input: PageModulaireExpanded;
  size?: "sm" | "md";
};

const CardBranche = ({ input, size = "sm" }: Props) => {
  const { _type, title, slug, imageCover } = input;
  const { settings } = usePageContext();

  let supTitle = "";
  if (slug) {
    if (slug?.current?.includes("image")) {
      supTitle = `[${settings?.totalImageImages}]`;
    } else if (slug?.current?.includes("feuilletage")) {
      supTitle = `[${settings?.totalFeuilletages}]`;
    }
  }
  return (
    <div
      className={clsx(
        "card card--branche card--page-modulaire",
        `card--${size}`,
        // size === "md" && "md:col-span-2",
        // isLandscape && "card--is-landscape",
        // !isLandscape && "card--is-portrait",
      )}>
      {/* <pre>{JSON.stringify(input, null, 2)}</pre> */}
      <CardInnerSM
        _type={_type}
        subTitle={supTitle}
        title={_localizeField(title) || ""}
        imageCover={imageCover?.asset as SanityImageAssetFull}
        linkPrimary={_linkResolver(input)}
        linkPrimaryLabel={_localizeText("discover")}
      />
    </div>
  );
};

export default CardBranche;
