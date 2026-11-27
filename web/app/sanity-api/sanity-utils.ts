import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityConfig } from "./sanity.client";

const imageBuilder = createImageUrlBuilder(sanityConfig);

export function urlFor(source: any, maxWidth: number = 2000): any {
  if (!source) {
    return "/placeholder.png";
  }
  const sourceId = source?._id || source?.ref;
  if (!sourceId) return "/placeholder.png";
  // return source.assetId;
  return imageBuilder
    ?.image(source._id)
    .width(maxWidth)
    .auto("format")
    .fit("max")
    .url();
}

export const sanityLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  if (!src.startsWith("https://cdn.sanity.io")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality || 75));
  url.searchParams.delete("dpr");
  return url.toString();
};
