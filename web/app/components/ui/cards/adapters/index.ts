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
  SerieThematiqueExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import {
  FhcbDate,
  LinkExternal,
  Tag,
} from "@/app/sanity-api/types/sanity.types";
import {
  _linkResolver,
  _localizeField,
  _localizeText,
} from "@/app/sanity-api/utils";
import { CardAction, CardBaseProps } from "../CardBase";
import CardTags from "../CardTags";
import FHCBDates from "../../FHCBDates";
import Embed from "../../Embed";
import MuxVideoPlayer from "../../MuxPlayer";
import {
  _isCurrentOrFuturByDates,
  _isPast,
  _isPastByDates,
} from "@/app/lib/utils";
import { usePathname } from "next/navigation";

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
  const {
    title,
    artists,
    imageCover,
    dates,
    tags,
    links,
    linkTickets,
    pastille,
  } = input;
  const artistList = artists?.map((a) => a.name).join(", ");
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  const imagePortrait = !isLandscape;
  // const _isCurrentOrFutur = _isCurrentOrFuturByDates(dates || []);
  const isPast = _isPastByDates(dates || []);

  let layout: CardBaseProps["layout"];
  let imagePlacement: CardBaseProps["imagePlacement"] | undefined;

  if (featured) {
    const isTube =
      dates?.some((item: FhcbDate) => item.locationType === "inSite-tube") ??
      false;

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

  const actions: CardAction[] = [];
  actions.push({
    label: _localizeText("discoverTheExhibition") as string,
    href: _linkResolver(input),
    variant: "primary",
  });

  // if (links && !isPast) {
  //   links.forEach((link) => {
  //     actions.push({
  //       label: (_localizeField(link.label) as string) || "",
  //       href: link.link ?? "",
  //       variant: "secondary",
  //     });
  //   });
  // }
  if (linkTickets) {
    actions.push({
      label: _localizeText("bookTickets") as string,
      href: linkTickets,
      variant: "primary",
    });
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
    title: (_localizeField(title) as string) || "",
    subTitle: artistList,
    infoNode: toInfoNode(dates),
    actions: actions,
    badge:
      pastille && pastille.fr
        ? { label: _localizeField(pastille) as string }
        : undefined,
  };
}

// ─── Product ─────────────────────────────────────────────────────────────────

export function productToCard(
  input: ProductExpanded,
  size: "sm" | "md" | "lg" = "md",
): CardBaseProps {
  const { imageCover, tags, price, artists } = input;
  const artistName = artists?.map((a) => a?.name).join(", ") || "";
  const title = (_localizeField(input.title) as string) || "";
  const pathname = usePathname();
  const isOffShop = pathname.indexOf("librairie") === -1;

  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  const imagePortrait = !isLandscape;
  let layout: CardBaseProps["layout"];
  if (size === "md") {
    layout = imagePortrait ? "row" : "col";
  }
  return {
    _type: input._type,
    layout: layout,
    colorVar: "var(--color-beige)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    tags: isOffShop ? _localizeText("book") : toTags(tags),
    footerPlacement: size === "md" && imagePortrait ? "detached" : undefined,
    title: title,
    subTitle: artistName,
    infoNode: price ? `${price}€` : undefined,
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

export function eventToCard(
  input: EventExpanded,
  size: "sm" | "md" | "lg" = "sm",
): CardBaseProps {
  const {
    title,
    subTitle,
    description,
    imageCover,
    dates,
    tags,
    links,
    pastille,
  } = input;
  const isPast = _isPastByDates(dates || []);
  const isHorsLeMurs = tags?.some(
    (tag: Tag) => tag.slug?.current === "hors-les-murs",
  );
  const actions: CardAction[] = [];
  if (!isHorsLeMurs) {
    actions.push({
      label: _localizeText("discoverTheExhibition") as string,
      href: _linkResolver(input),
      variant: "primary",
    });
  }

  if (links && !isPast) {
    links.forEach((link: LinkExternal) => {
      actions.push({
        label: (_localizeField(link.label) as string) || "",
        href: link.link ?? "",
        variant: "secondary",
      });
    });
  }
  return {
    _type: input._type,
    layout: size === "lg" ? "row" : "col",
    colorVar: "var(--color-event)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    tags: toTags(tags),
    title: (_localizeField(title) as string) || "",
    subTitle: _localizeField(subTitle),
    description: _localizeField(description),
    infoNode: toInfoNode(dates),
    actions: actions,
    badge:
      pastille && pastille.fr
        ? { label: _localizeField(pastille) as string }
        : undefined,
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
    tags: index ? `une image, des images #${index}` : undefined,
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

// ─── SerieThematique ──────────────────────────────────────────────────────────────

export function serieThematiqueToCard(
  input: SerieThematiqueExpanded,
): CardBaseProps {
  const { index, chercheur, video, imageCover } = input;
  return {
    _type: input._type,
    layout: "col",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    mediaSlot: video ? React.createElement(Embed, { input: video }) : undefined,
    tags: index ? `une image, des images #${index}` : undefined,
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
  const { imageCover, videoCover } = input;
  const playbackId = videoCover?.asset?.playbackId;
  return {
    _type: input._type,
    layout: "col",
    colorVar: "var(--color-white)",
    // La vidéo de couverture prime sur l'image de couverture quand elle est présente.
    images:
      !playbackId && imageCover?.asset
        ? [imageCover.asset as SanityImageAssetFull]
        : [],
    mediaSlot: playbackId
      ? React.createElement(MuxVideoPlayer, {
          playbackId,
          loop: true,
          hoverPlay: true,
        })
      : undefined,
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
