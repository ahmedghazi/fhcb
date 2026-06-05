/**
 * adapters/index.ts
 * Un adaptateur par type Sanity → CardBaseProps
 * Chaque fonction fait la traduction métier, CardBase ne sait rien du _type.
 */

import React from "react";
import {
  ArticleExpanded,
  ArtistExpanded,
  EventExpanded,
  ExhibitionExpanded,
  FeuilletageExpanded,
  ImageImagesExpanded,
  PageModulaireExpanded,
  ProductExpanded,
  SanityImageAssetFull,
} from "@/app/sanity-api/types/sanity-expanded.types";
import { Tag } from "@/app/sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import { CardBaseProps } from "../CardBase";
import CardTags from "../CardTags";
import FHCBDates from "../../FHCBDates";
import Embed from "../../Embed";

// ─── Types partagés extraits des types Sanity ─────────────────────────────────

type SanityTags = Array<Tag> | null | undefined;
type SanityDates =
  | ExhibitionExpanded["dates"]
  | EventExpanded["dates"]
  | FeuilletageExpanded["dates"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toInfoNode = (dates: SanityDates) =>
  dates?.length ? React.createElement(FHCBDates, { input: dates }) : undefined;

const toTags = (tags: SanityTags) =>
  tags?.length ? React.createElement(CardTags, { input: tags }) : undefined;

// ─── Exhibition ───────────────────────────────────────────────────────────────

export function exhibitionToCard(
  input: ExhibitionExpanded,
  size: "sm" | "md" | "lg" = "sm",
  featured?: boolean,
): CardBaseProps {
  const { artists, imageCover, dates, tags } = input;
  const artistList = artists?.map((a) => a.name).join(", ");

  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  const imagePortrait = !isLandscape;

  const isTube = (input as any).location === "inside-tube";

  let layout: CardBaseProps["layout"];
  let imagePlacement: CardBaseProps["imagePlacement"] | undefined;

  if (featured) {
    layout = isTube ? "row" : "col";
    imagePlacement = isTube ? undefined : "top";
    if (size === "lg") {
      layout = "row";
    }
  } else if (size === "lg") {
    layout = "row";
  } else if (size === "md") {
    layout = imagePortrait ? "row" : "col";
  } else {
    layout = "col";
  }

  return {
    _type: input._type,
    layout,
    imagePlacement,
    noPadding: featured ? true : undefined,
    footerPlacement: !featured && size === "md" ? "detached" : undefined,
    colorVar: "var(--color-exhibition)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    tags: toTags(tags),
    title: artistList || (_localizeField(input.title) as string) || "",
    subTitle: artistList ? (_localizeField(input.title) as string) : undefined,
    infoNode: toInfoNode(dates),
    actions: [
      {
        label: _localizeText("discoverTheExhibition") as string,
        href: _linkResolver(input),
        variant: "primary",
      },
    ],
  };
}

// ─── Product ─────────────────────────────────────────────────────────────────

export function productToCard(input: ProductExpanded): CardBaseProps {
  const { imageCover, tags, prix } = input;
  const artistName = input.artist?.name || "";
  const title = (_localizeField(input.title) as string) || "";
  return {
    _type: input._type,
    layout: "col",
    colorVar: "var(--color-beige)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    tags: toTags(tags),
    title: artistName || title,
    subTitle: artistName ? title : undefined,
    infoNode: prix ? `${prix}€` : undefined,
    actions: [
      {
        label: _localizeText("discover") as string,
        href: _linkResolver(input),
        variant: "primary",
      },
    ],
  };
}

// ─── Event ────────────────────────────────────────────────────────────────────

export function eventToCard(input: EventExpanded): CardBaseProps {
  const { imageCover, dates, tags } = input;
  return {
    _type: input._type,
    layout: "col",
    colorVar: "var(--color-event)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    tags: toTags(tags),
    title: (_localizeField(input.title) as string) || "",
    infoNode: toInfoNode(dates),
    actions: [
      {
        label: _localizeText("discover") as string,
        href: _linkResolver(input),
        variant: "primary",
      },
    ],
  };
}

// ─── Artist ───────────────────────────────────────────────────────────────────

export function artistToCard(
  input: ArtistExpanded,
  size: "sm" | "md",
): CardBaseProps {
  const { imageCover } = input;
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  return {
    _type: input._type,
    layout: size === "md" && !isLandscape ? "row" : "col",
    colorVar: "var(--color-artist)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    title: (input.name as string) || "",
    actions: [
      {
        label: _localizeText("discover") as string,
        href: _linkResolver(input),
        variant: "primary",
      },
    ],
  };
}

// ─── Article ──────────────────────────────────────────────────────────────────

export function articleToCard(input: ArticleExpanded): CardBaseProps {
  const { imageCover, tags } = input;
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  return {
    _type: input._type,
    layout: "col",
    colorVar: "var(--color-article)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    tags: toTags(tags),
    title: (_localizeField(input.title) as string) || "",
    actions: [
      {
        label: _localizeText("readTheArticle") as string,
        href: _linkResolver(input),
        variant: "primary",
      },
    ],
  };
}

// ───  PageModulaire ──────────────────────────────────────────────────

export function pageModulaireToCard(
  input: PageModulaireExpanded,
  contentCount?: number,
): CardBaseProps {
  const { imageCover } = input;
  return {
    _type: input._type,
    layout: "col",
    colorVar: "var(--color-white)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    // videoUrl: (input as any).previewVideo?.asset?.url,
    // videoBehavior: "hover",
    title: (_localizeField(input.title) as string) || "",
    // contentCount,
    actions: [
      {
        label: _localizeText("discover") as string,
        href: _linkResolver(input),
        variant: "primary",
      },
    ],
  };
}

// ─── Feuilletage ─────────────────────────────────────────────────────────────

export function feuilletageToCard(input: FeuilletageExpanded): CardBaseProps {
  const { imageCover, dates, tags, index, chercheur } = input;

  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);

  const tagsLabel =
    tags
      ?.map((tag: Tag) =>
        tag.slug?.current === "feuilletage"
          ? `Feuilletage #${index}`
          : (_localizeField(tag.title) as string),
      )
      .filter(Boolean)
      .join(", ") || (index ? `Feuilletage #${index}` : undefined);

  const subTitle =
    [_localizeField(input.subTitle), chercheur?.name]
      .filter(Boolean)
      .join(" — ") || undefined;

  return {
    _type: input._type,
    layout: isLandscape ? "col" : "row",
    footerPlacement: "detached",
    colorVar: "var(--color-gris-100)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    tags: tagsLabel,
    title: (_localizeField(input.title) as string) || "",
    subTitle,
    description: (_localizeField(input.description) as string) || undefined,
    infoNode: toInfoNode(dates),
    actions: [
      {
        label: _localizeText("discover") as string,
        href: _linkResolver(input),
        variant: "primary",
      },
    ],
  };
}

// ─── ImageImages ──────────────────────────────────────────────────────────────

export function imageImagesToCard(input: ImageImagesExpanded): CardBaseProps {
  const { index, chercheur, video, imageCover } = input;
  return {
    _type: input._type,
    layout: "col",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    mediaSlot: video ? React.createElement(Embed, { input: video }) : undefined,
    supTitle: index ? `une image, des images #${index}` : undefined,
    title: (_localizeField(input.title) as string) || "",
    subTitle: chercheur?.name || undefined,
    actions: [
      {
        label: _localizeText("discover") as string,
        href: _linkResolver(input),
        variant: "primary",
      },
    ],
  };
}

// ─── Branche (PageModulaire) ──────────────────────────────────────────────────

export function brancheToCard(
  input: PageModulaireExpanded,
  supTitle?: string,
  contentCount?: number,
): CardBaseProps {
  const { imageCover } = input;
  return {
    _type: input._type,
    layout: "col",
    colorVar: "var(--color-white)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    supTitle,
    title: (_localizeField(input.title) as string) || "",
    contentCount,
    actions: [
      {
        label: _localizeText("discover") as string,
        href: _linkResolver(input),
        variant: "primary",
      },
    ],
  };
}
