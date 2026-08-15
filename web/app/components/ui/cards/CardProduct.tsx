import clsx from "clsx";
import { ProductExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { productToCard } from "./adapters";
import CardBase, { CardFooter } from "./CardBase";
import { useEffect, useRef, useState } from "react";

type Props = {
  input: ProductExpanded;
  size?: "sm" | "md" | "lg";
};

const CardProduct = ({ input, size = "md" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties | null>(null);
  useEffect(() => {
    if (!ref) return;
    setTimeout(() => {
      const footerInfo = ref.current?.querySelector(
        ".card__footer .card__info",
      );
      if (footerInfo) {
        const footerInfoBounding = footerInfo.getBoundingClientRect();
        setStyle({
          "--footer-max-height": `${footerInfoBounding.height + 30 + 12}px`,
        } as React.CSSProperties);
      }
    }, 500);
  }, []);

  const props = productToCard(input, size);
  return (
    <div
      ref={ref}
      className={clsx(
        "card card--product",
        `card--${size}`,
        props.layout && `card--${props.layout}`,
        size === "sm" ? "card--footer-hover" : "",
      )}>
      <CardBase {...props} style={style ?? undefined} />
      {size === "md" &&
        (!!props.actions?.length || props.actionsNode) &&
        props.layout === "row" && (
          <CardFooter
            actions={props.actions ?? []}
            actionsNode={props.actionsNode}
          />
        )}
    </div>
  );
};

export default CardProduct;
