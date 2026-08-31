"use client";
import { Tag } from "@/app/sanity-api/types/sanity.types";
import {
  ArticleExpanded,
  SerieThematiqueExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import { articleToCard, serieThematiqueToCard } from "./adapters";
import CardBase from "./CardBase";

type Props = {
  input: SerieThematiqueExpanded;
  size?: "md";
};

const CardSerieThematique = ({ input, size = "md" }: Props) => {
  const props = serieThematiqueToCard(input);
  return (
    <div
      className={clsx(
        "card card--article",
        `card--${size}`,
        // "card--footer-hover",
      )}>
      <CardBase {...props} />
    </div>
  );
};

export default CardSerieThematique;
