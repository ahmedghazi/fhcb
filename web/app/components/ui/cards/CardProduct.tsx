import { Artist, Product } from "@/app/sanity-api/types/sanity.types";
import clsx from "clsx";
import React from "react";
import Figure from "../Figure";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import {
  ProductExpanded,
  SanityImageAssetFull,
} from "@/app/sanity-api/types/sanity-expanded.types";
import { Link } from "next-view-transitions";
import CardInnerSM from "./CardInnerSM";
import CardInnerMD from "./CardInnerMD";

type Props = {
  input: ProductExpanded;
  // look?: "l1a" | "l3";
  size?: "sm" | "md" | "lg";
};

const CardProduct = ({ input, size = "md" }: Props) => {
  const { _type, title, artist, imageCover, prix, tags } = input;
  const tagsList = tags?.map((tag) => _localizeField(tag.title)).join(", ");

  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);

  return (
    <div
      className={clsx(
        "card card--product",
        `card--${size}`,
        size === "md" && "md:col-span-2",
        isLandscape && `card--is-landscape`,
        !isLandscape && "card--is-portrait",
      )}>
      {size === "sm" && (
        <CardInnerSM
          _type={_type}
          tags={tagsList || ""}
          title={artist?.name || ""}
          subTitle={_localizeField(title)}
          info={prix ? `${prix}€` : ""}
          imageCover={imageCover?.asset as SanityImageAssetFull}
          linkPrimary={_linkResolver(input)}
          linkPrimaryLabel={_localizeText("discover")}
        />
      )}
      {size === "md" && (
        <CardInnerMD
          _type={_type}
          tags={tagsList || ""}
          title={artist?.name || ""}
          subtitle={_localizeField(title)}
          info={prix ? `${prix}€` : ""}
          imageCover={imageCover?.asset as SanityImageAssetFull}
          linkPrimary={_linkResolver(input)}
          linkPrimaryLabel={_localizeText("discover")}
        />
      )}
    </div>
  );
};

export default CardProduct;
