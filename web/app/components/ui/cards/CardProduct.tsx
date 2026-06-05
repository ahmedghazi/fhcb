import clsx from "clsx";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { productToCard } from "./adapters";
import CardBase from "./CardBase";

type Props = {
  input: ProductExpanded;
  size?: "sm" | "md" | "lg";
};

const CardProduct = ({ input, size = "md" }: Props) => {
  const props = productToCard(input);
  return (
    <div className={clsx("card card--product", `card--${size}`)}>
      <CardBase {...props} />
    </div>
  );
};

export default CardProduct;
