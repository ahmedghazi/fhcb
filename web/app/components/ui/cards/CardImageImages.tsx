"use client";
import clsx from "clsx";
import { ImageImagesExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { imageImagesToCard } from "./adapters";
import CardBase from "./CardBase";

type Props = {
  input: ImageImagesExpanded;
  size?: "sm" | "md" | "lg";
};

const CardImageImages = ({ input, size = "md" }: Props) => {
  const props = imageImagesToCard(input);
  return (
    <div className={clsx("card card--image-images", `card--${size}`)}>
      <CardBase {...props} />
    </div>
  );
};

export default CardImageImages;
