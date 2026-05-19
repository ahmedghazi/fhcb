import { PageModulaire } from "@/app/sanity-api/types/sanity.types";
import clsx from "clsx";
import React from "react";
import Figure from "../Figure";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import Link from "next/link";
import CardInnerSM from "./CardInnerSM";
import {
  PageModulaireExpanded,
  SanityImageAssetFull,
} from "@/app/sanity-api/types/sanity-expanded.types";
import CardInnerMD from "./CardInnerMD";

type Props = {
  input: PageModulaireExpanded;
  size?: "sm" | "md" | "lg";
};

const CardPage = ({ input, size = "md" }: Props) => {
  const { _type, title, tags, imageCover } = input;
  const tagsList = tags?.map((tag) => _localizeField(tag.title)).join(", ");
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  return (
    <div
      className={clsx(
        "card card--page",
        `card--${size}`,

        size === "md" && "md:col-span-2",
        isLandscape && `card--is-landscape`,
        !isLandscape && "card--is-portrait",
      )}>
      {size === "sm" && (
        <CardInnerSM
          _type={_type}
          tags={tagsList || ""}
          title={_localizeField(input.title)}
          // subtitle={_localizeField(title)}
          info={"infos"}
          imageCover={imageCover?.asset as SanityImageAssetFull}
          linkPrimary={_linkResolver(input)}
          linkPrimaryLabel={_localizeText("discover")}
        />
      )}
      {size === "md" && (
        <CardInnerMD
          _type={_type}
          tags={tagsList || ""}
          title={_localizeField(input.title)}
          // subtitle={_localizeField(title)}
          info={"infos"}
          imageCover={imageCover?.asset as SanityImageAssetFull}
          linkPrimary={_linkResolver(input)}
          linkPrimaryLabel={_localizeText("discover")}
        />
      )}
    </div>
  );
};

export default CardPage;
