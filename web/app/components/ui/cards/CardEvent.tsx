"use client";
import { Tag } from "@/app/sanity-api/types/sanity.types";
import { EventExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import { eventToCard } from "./adapters";
import CardBase from "./CardBase";
import { useFooterMaxHeight } from "@/app/hooks/useFooterMaxHeight";

type Props = {
  input: EventExpanded;
  size?: "sm" | "md" | "lg";
};

const CardEvent = ({ input, size = "md" }: Props) => {
  const { tags } = input;

  const tagsClassList = tags
    ?.map((tag: Tag) => `card--${tag.slug?.current}`)
    .join(" ");
  const props = eventToCard(input, size);
  const { ref, style } = useFooterMaxHeight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={clsx(
        "card card--event",
        `card--${size}`,
        tagsClassList,
        size !== "lg" && "card--footer-hover",
      )}>
      <CardBase {...props} style={style ?? undefined} />
    </div>
  );
};

export default CardEvent;
