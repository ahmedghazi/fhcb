"use client";
import clsx from "clsx";
import { PageModulaireExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { pageModulaireToCard } from "./adapters";
import CardBase from "./CardBase";

type Props = {
  input: PageModulaireExpanded;
  size?: "md";
};

const CardPageModulaire = ({ input, size = "md" }: Props) => {
  const props = pageModulaireToCard(input);
  return (
    <div
      className={clsx(
        "card card--page-modulaire",
        `card--${size}`,
        `card--${size}-alt`,
        "card--footer-hover",
      )}>
      <CardBase {...props} />
    </div>
  );
};

export default CardPageModulaire;
