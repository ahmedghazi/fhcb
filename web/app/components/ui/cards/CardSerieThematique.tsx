"use client";
import { Tag } from "@/app/sanity-api/types/sanity.types";
import {
  ArticleExpanded,
  SerieThematiqueExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import { articleToCard, serieThematiqueToCard } from "./adapters";
import CardBase from "./CardBase";
import { useFooterMaxHeight } from "@/app/hooks/useFooterMaxHeight";

type Props = {
  input: SerieThematiqueExpanded;
  size?: "md";
};

const CardSerieThematique = ({ input, size = "md" }: Props) => {
  const props = serieThematiqueToCard(input);
  const { ref, style } = useFooterMaxHeight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={clsx(
        "card card--article",
        `card--${size}`,
        "card--footer-hover",
      )}>
      <CardBase {...props} style={style ?? undefined} />
    </div>
  );
};

export default CardSerieThematique;
