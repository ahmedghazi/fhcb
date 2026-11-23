"use client";
import clsx from "clsx";
import { CardPressExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { isLandscapeImage, pressToCard } from "./adapters";
import CardBase, { CardFooter } from "./CardBase";

type Props = {
  input: CardPressExpanded;
  size?: "sm" | "md" | "lg";
};

// même rendu que CardExhibition (sans les états passé / en cours / à venir)
const CardPress = ({ input, size = "md" }: Props) => {
  const props = pressToCard(input, size);

  return (
    <div
      className={clsx(
        "card card--exhibition card--press",
        `card--${size}`,
        `card--${props.layout}`,
        isLandscapeImage(input.imageCover)
          ? "card--is-landscape"
          : "card--is-portrait",
      )}>
      <CardBase {...props} />
      {size === "md" && !!props.actions?.length && (
        <CardFooter actions={props.actions} />
      )}
    </div>
  );
};

export default CardPress;
