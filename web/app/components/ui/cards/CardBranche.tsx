"use client";
import clsx from "clsx";
import { PageModulaireExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { usePageContext } from "@/app/context/PageContext";
import { brancheToCard } from "./adapters";
import CardBase from "./CardBase";

type Props = {
  input: PageModulaireExpanded;
  size?: "sm" | "md";
};

const CardBranche = ({ input, size = "sm" }: Props) => {
  if (!input) return null;
  const { slug } = input;
  const { settings } = usePageContext();

  let supTitle = "";
  if (slug?.current?.includes("image")) {
    supTitle = `[${settings?.totalImageImages}]`;
  } else if (slug?.current?.includes("feuilletage")) {
    supTitle = `[${settings?.totalFeuilletages}]`;
  }

  const props = brancheToCard(input, supTitle);
  return (
    <div
      className={clsx(
        "card card--branche card--page-modulaire",
        `card--${size}`,
        size === "sm" ? "card--footer-hover" : "",
      )}>
      <CardBase {...props} />
    </div>
  );
};

export default CardBranche;
