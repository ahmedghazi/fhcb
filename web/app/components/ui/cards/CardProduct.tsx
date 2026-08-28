import clsx from "clsx";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { productToCard } from "./adapters";
import CardBase, { CardFooter } from "./CardBase";

type Props = {
  input: ProductExpanded;
  size?: "sm" | "md" | "lg";
};

const CardProduct = ({ input, size = "md" }: Props) => {
  const props = productToCard(input, size);
  return (
    <div
      className={clsx(
        "card card--product",
        `card--${size}`,
        props.layout && `card--${props.layout}`,
        size === "sm" ? "card--footer-hover" : "",
      )}>
      <CardBase {...props} />
      {size === "md" &&
        (!!props.actions?.length || props.actionsNode) &&
        props.layout === "row" && (
          <CardFooter
            actions={props.actions ?? []}
            actionsNode={props.actionsNode}
          />
        )}

      {/* {(!!props.actions?.length || props.actionsNode) && (
        <CardFooter
          actions={props.actions ?? []}
          actionsNode={props.actionsNode}
        />
      )} */}
    </div>
  );
};

export default CardProduct;
