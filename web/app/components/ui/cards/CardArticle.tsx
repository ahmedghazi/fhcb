"use client";
import { Tag } from "@/app/sanity-api/types/sanity.types";
import { ArticleExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import { articleToCard } from "./adapters";
import CardBase from "./CardBase";

type Props = {
  input: ArticleExpanded;
  size?: "sm" | "md" | "lg";
};

const CardArticle = ({ input, size = "md" }: Props) => {
  const { tags } = input;
  const tagsClassList = tags
    ?.map((tag: Tag) => `card--${tag.slug?.current}`)
    .join(" ");
  const props = articleToCard(input, size);

  return (
    <div
      className={clsx(
        "card card--article",
        `card--${size}`,
        tagsClassList,
        "card--footer-hover",
      )}>
      <CardBase {...props} />
    </div>
  );
};

export default CardArticle;
