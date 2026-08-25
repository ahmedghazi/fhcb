import { CSSProperties, ReactNode } from "react";
import { SanityImageAssetFull } from "@/app/sanity-api/types/sanity-expanded.types";

export type CardLayout = "col" | "row" | "row-reverse";

export type CardAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  type?: "linkExternal";
};

export type CardBadgeProps = {
  label: string;
  // colorVar?: string;
};

export type CardBaseProps = {
  layout?: CardLayout;
  colorVar?: string;
  badge?: CardBadgeProps;
  images?: SanityImageAssetFull[];
  videoUrl?: string;
  videoBehavior?: "inline" | "hover";
  tags?: ReactNode;
  supTitle?: string;
  title: string;
  subTitle?: string;
  description?: ReactNode;
  infoNode?: ReactNode;
  actionsNode?: ReactNode;
  actions?: CardAction[];
  footerPlacement?: "auto" | "detached";
  imagePlacement?: "auto" | "top";
  noPadding?: boolean;
  mediaSlot?: ReactNode;
  contentCount?: number;
  className?: string;
  style?: CSSProperties;
  _type?: string;
  imageSizes?: string;
};
