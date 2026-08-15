import website from "@/app/config/website";
import { urlFor } from "@/app/sanity-api/sanity-utils";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

type Props = {
  asset: any;
  width?: number;
  alt?: string | any;
  caption?: string;
  author?: string;
  copyright?: string;
  sizes?: string;
};

const Figure = ({
  asset,
  width = 2000,
  alt = website.title,
  caption,
  author,
  copyright,
  sizes = "100vw",
}: Props) => {
  const isLandscape =
    asset?.metadata?.dimensions?.width > asset?.metadata?.dimensions?.height;
  return (
    <figure
      className={clsx(
        "figure",
        isLandscape && "figure--is-landscape",
        !isLandscape && "figure--is-portrait",
      )}>
      <Image
        src={urlFor(asset, width)}
        width={asset?.metadata?.dimensions?.width || width}
        height={asset?.metadata?.dimensions?.height || width}
        alt={alt || ""}
        sizes={sizes}
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: `${asset?.metadata?.dimensions?.width} / ${asset?.metadata?.dimensions?.height}`,
        }}
        placeholder={asset?.metadata?.lqip ? "blur" : "empty"}
        blurDataURL={asset?.metadata?.lqip}
      />
      {caption && (
        <figcaption>
          <span className='c-caption caption'>{caption}</span>
          {author && <span className='c-caption'>, {author}</span>}
          {copyright && <span className='c-credits'> | © {copyright}</span>}
        </figcaption>
      )}
    </figure>
  );
};

export default Figure;
