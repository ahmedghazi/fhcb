import clsx from "clsx";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { productToCard } from "./adapters";
import CardBase, { CardFooter } from "./CardBase";

type Props = {
  input: ProductExpanded;
  size?: "sm" | "md" | "lg";
};

const CardProduct = ({ input, size = "md" }: Props) => {
  const { imageCover } = input;
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  const props = productToCard(input, size);
  return (
    <div
      className={clsx(
        "card card--product",
        `card--${size}`,
        `card--${props.layout}`,
        isLandscape ? "card--is-landscape" : "card--is-portrait",
        size === "sm" ? "card--footer-hover" : "",
      )}>
      <CardBase {...props} />
      {size === "md" && !!props.actions?.length && props.layout === "row" && (
        <CardFooter actions={props.actions} />
      )}
    </div>
  );
};

export default CardProduct;
