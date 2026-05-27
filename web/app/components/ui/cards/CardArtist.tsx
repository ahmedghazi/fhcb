import { Artist } from "@/app/sanity-api/types/sanity.types";
import clsx from "clsx";
import React from "react";
import Figure from "../Figure";
import { Link } from "next-view-transitions";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import CardInnerMD from "./CardInnerMD";
import {
  ArtistExpanded,
  SanityImageAssetFull,
} from "@/app/sanity-api/types/sanity-expanded.types";
import CardInnerSM from "./CardInnerSM";

type Props = {
  input: ArtistExpanded;
  size?: "sm" | "md" | "lg";
};

const CardArtist = ({ input, size = "md" }: Props) => {
  const { _type, name, imageCover } = input;
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  return (
    <div
      className={clsx(
        "card card--artist",
        `card--${size}`,
        size === "md" && "md:col-span-2",
        isLandscape && `card--is-landscape`,
        !isLandscape && "card--is-portrait",
        "self-start",
      )}>
      {size === "sm" && (
        <CardInnerSM
          _type={_type}
          tags={"ARTIST"}
          title={name || ""}
          imageCover={imageCover?.asset as SanityImageAssetFull}
          linkPrimary={_linkResolver(input)}
          linkPrimaryLabel={_localizeText("discover")}
        />
      )}

      {size === "md" && (
        <CardInnerMD
          _type={_type}
          tags={"ARTIST"}
          title={name || ""}
          // subtitle={_localizeField(title)}
          // info={"infos"}
          imageCover={imageCover?.asset as SanityImageAssetFull}
          linkPrimary={_linkResolver(input)}
          linkPrimaryLabel={_localizeText("discover")}
        />
      )}
    </div>
  );
};

export default CardArtist;
