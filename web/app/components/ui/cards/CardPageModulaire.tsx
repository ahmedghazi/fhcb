"use client";
import clsx from "clsx";
import { PageModulaireExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { pageModulaireToCard } from "./adapters";
import CardBase from "./CardBase";
import { useFooterMaxHeight } from "@/app/hooks/useFooterMaxHeight";

type Props = {
  input: PageModulaireExpanded;
  size?: "md";
};

const CardPageModulaire = ({ input, size = "md" }: Props) => {
  const props = pageModulaireToCard(input);
  const { ref, style } = useFooterMaxHeight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={clsx(
        "card card--page-modulaire",
        `card--${size}`,
        `card--${size}-alt`,
        "card--footer-hover",
      )}>
      <CardBase {...props} style={style ?? undefined} />
    </div>
  );
};

export default CardPageModulaire;
