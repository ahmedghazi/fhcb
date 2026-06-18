"use client";
import { Tag } from "@/app/sanity-api/types/sanity.types";
import { EventExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import { eventToCard } from "./adapters";
import CardBase from "./CardBase";

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

  return (
    <div className={clsx("card card--event", `card--${size}`, tagsClassList)}>
      <CardBase {...props} />
    </div>
  );
};

export default CardEvent;
