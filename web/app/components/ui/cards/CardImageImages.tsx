"use client";
import clsx from "clsx";
import { ImageImagesExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { imageImagesToCard } from "./adapters";
import CardBase from "./CardBase";
import { useFooterMaxHeight } from "@/app/hooks/useFooterMaxHeight";

type Props = {
  input: ImageImagesExpanded;
  size?: "sm" | "md" | "lg";
};

const CardImageImages = ({ input, size = "md" }: Props) => {
  const props = imageImagesToCard(input);
  const { ref, style } = useFooterMaxHeight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={clsx(
        "card card--image-images",
        `card--${size}`,
        "card--footer-hover",
      )}>
      <CardBase {...props} style={style ?? undefined} />
    </div>
  );
};

export default CardImageImages;
