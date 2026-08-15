"use client";
import clsx from "clsx";
import { PageModulaireExpanded } from "@/app/sanity-api/types/sanity-expanded.types";
import { usePageContext } from "@/app/context/PageContext";
import { brancheToCard } from "./adapters";
import CardBase from "./CardBase";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  input: PageModulaireExpanded;
  size?: "sm" | "md";
};

const CardBranche = ({ input, size = "sm" }: Props) => {
  if (!input) return null;
  const { slug } = input;
  const { settings } = usePageContext();
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties | null>(null);
  let supTitle = "";
  if (slug?.current?.includes("image")) {
    supTitle = `[${settings?.totalImageImages}]`;
  } else if (slug?.current?.includes("feuilletage")) {
    supTitle = `[${settings?.totalFeuilletages}]`;
  } else if (
    slug?.current?.includes("series-thematique") ||
    slug?.current?.includes("focus")
  ) {
    supTitle = `[${settings?.totalSerieThematique}]`;
  } else if (
    slug?.current?.includes("conversation") ||
    slug?.current?.includes("paroles")
  ) {
    supTitle = `[${settings?.totalConversation}]`;
  }

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

  const props = brancheToCard(input, supTitle);
  return (
    <div
      ref={ref}
      className={clsx(
        "card card--branche card--page-modulaire",
        `card--${size}`,
        size === "sm" ? "card--footer-hover" : "",
      )}>
      <CardBase {...props} style={style ?? undefined} />
    </div>
  );
};

export default CardBranche;
