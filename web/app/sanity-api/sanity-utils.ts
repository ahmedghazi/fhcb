import createImageUrlBuilder from "@sanity/image-url";
import { sanityConfig } from "./sanity.client";

const imageBuilder = createImageUrlBuilder(sanityConfig);

export function urlFor(source: any, maxWidth: number = 2000): any {
  if (!source) {
    return "/placeholder.png";
  }
  return imageBuilder
    ?.image(source)
    .width(maxWidth)
    .auto("format")
    .fit("max")
    .dpr(2)
    .url();
}
