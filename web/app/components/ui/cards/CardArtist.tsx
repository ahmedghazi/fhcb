import clsx from "clsx";
import { ArtistExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { artistToCard } from "./adapters";
import CardBase from "./CardBase";

type Props = {
  input: ArtistExpanded;
  size?: "sm" | "md" | "lg";
};

const CardArtist = ({ input, size = "md" }: Props) => {
  const { imageCover } = input;
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  const props = artistToCard(input, size);

  return (
    <div
      className={clsx(
        "card card--artist",
        `card--${size}`,
        `card--${props.layout}`,
        isLandscape ? "card--is-landscape" : "card--is-portrait",
        "card--footer-hover",
      )}>
      <CardBase {...props} />
    </div>
  );
};

export default CardArtist;
