"use client";
import { Tag } from "@/app/sanity-api/types/sanity.types";
import { FeuilletageExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import clsx from "clsx";
import { feuilletageToCard } from "./adapters";
import CardBase, { CardFooter } from "./CardBase";
import { useFooterMaxHeight } from "@/app/hooks/useFooterMaxHeight";

type Props = {
  input: FeuilletageExpanded;
  size?: "sm" | "md" | "lg";
};

const CardFeuilletage = ({ input, size = "md" }: Props) => {
  const { tags, imageCover } = input;
  const tagsClassList = tags
    ?.map((tag: Tag) => `card--${tag.slug?.current}`)
    .join(" ");
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  const props = feuilletageToCard(input);
  const { ref, style } = useFooterMaxHeight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={clsx(
        "card card--feuilletage",
        `card--${size}`,
        "card--footer-hover",
        // isLandscape ? "card--is-landscape" : "card--is-portrait",
        // tagsClassList,
      )}>
      <CardBase {...props} style={style ?? undefined} />
      {size === "md" && !!props.actions?.length && (
        <CardFooter actions={props.actions} />
      )}
    </div>
  );
};

export default CardFeuilletage;
