/**
 * adapters/index.ts
 * Un adaptateur par type Sanity → CardBaseProps
 * Chaque fonction fait la traduction métier, CardBase ne sait rien du _type.
 */

import React from "react";
import {
  ArticleExpanded,
  ArtistExpanded,
  ConversationExpanded,
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
  _parseJsonStringArray,
} from "@/app/sanity-api/utils";
import { CardAction, CardBaseProps } from "../CardBase";
import BtnAddToCart from "../../../shop/BtnAddToCart";
import CardTags from "../CardTags";
import FHCBDates from "../../FHCBDates";
import Embed from "../../Embed";
import MuxVideoPlayer from "../../MuxPlayer";
import {
  _isCurrentOrFuturByDates,
  _isPast,
  _isPastByDates,
  artistsToString,
} from "@/app/lib/utils";
import { usePathname } from "next/navigation";
import EmbedVideo from "../../EmbedVideo";
import { toPlainText } from "@portabletext/react";

// ─── Types partagés extraits des types Sanity ─────────────────────────────────

type SanityTags = Array<Tag> | null | undefined;
type SanityDates =
  | ExhibitionExpanded["dates"]
  | EventExpanded["dates"]
  | FeuilletageExpanded["dates"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toInfoNode = (dates: SanityDates, displayLocations: boolean) =>
  dates?.length
    ? React.createElement(FHCBDates, {
        input: dates,
        displayLocations: displayLocations,
      })
    : undefined;

const toTags = (tags: SanityTags) =>
  tags?.length ? React.createElement(CardTags, { input: tags }) : undefined;

// ─── Exhibition ───────────────────────────────────────────────────────────────

export function exhibitionToCard(
  input: ExhibitionExpanded,
  size: "sm" | "md" | "lg" = "sm",
  featured?: boolean,
): CardBaseProps {
  const { title, artists, imageCover, dates, tags, links, linkTickets } = input;
  const artistList = artistsToString(artists);
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  const imagePortrait = !isLandscape;
  // const _isCurrentOrFutur = _isCurrentOrFuturByDates(dates || []);
  const isPast = _isPastByDates(dates || []);
  // const hasOffsite =
  //   input.dates?.filter(
  //     (el) => el.locationType === "offSite" || el.locationType === "travelling",
  //   ).length > 0;

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

  if (links && !isPast) {
    links.forEach((link) => {
      actions.push({
        label: (_localizeField(link.label) as string) || "",
        href: link.link ?? "",
        variant: "secondary",
        type: link._type,
      });
    });
  }
  if (linkTickets) {
    actions.push({
      label: _localizeText("bookTickets") as string,
      href: linkTickets,
      variant: "primary",
      type: "linkExternal",
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
    // title: (_localizeField(title) as string) || "",
    // subTitle: artistList,
    title: (artistList as string) || "",
    subTitle: (_localizeField(title) as string) || "",
    infoNode: toInfoNode(dates, true),
    actions: actions,
    // badge:
    //   pastille && pastille.fr
    //     ? { label: _localizeField(pastille) as string }
    //     : undefined,
  };
}

// ─── Product ─────────────────────────────────────────────────────────────────

export function productToCard(
  input: ProductExpanded,
  size: "sm" | "md" | "lg" = "md",
): CardBaseProps {
  const {
    imageCover,
    tags,
    tagsProduct,
    price,
    artists,
    artistName,
    variants,
    pastille,
  } = input;
  const artistsName = artistsToString(artists);

  const title = (_localizeField(input.title) as string) || "";
  const pathname = usePathname();
  const isOffShop =
    pathname.indexOf("librairie") === -1 || pathname.indexOf("product") === -1;
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  const imagePortrait = !isLandscape;
  let layout: CardBaseProps["layout"];
  if (size === "md") {
    layout = imagePortrait ? "row" : "col";
  }
  const isSimpleProduct = !variants || variants.length === 0;
  // const isProductVariable = languages && languages?.length > 1;
  // const isLowStock = totalInventory && totalInventory < 10;

  const actions: CardAction[] = [];
  actions.push({
    label: !isSimpleProduct
      ? _localizeText("chooseOptions")
      : (_localizeText("discover") as string),
    href: _linkResolver(input),
    variant: "secondary",
  });
  // actions.push({
  //   label: isSimpleProduct
  //     ? _localizeText("chooseOptions")
  //     : (_localizeText("discover") as string),
  //   href: _linkResolver(input),
  //   variant: "secondary",
  // });
  return {
    _type: input._type,
    layout: layout,
    colorVar: "var(--color-beige)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    tags: isOffShop
      ? `${_localizeText("book")} ${tags ? toTags(tags) : ""}`
      : toTags(tags),
    footerPlacement: size === "md" && imagePortrait ? "detached" : undefined,
    title: title,
    subTitle: artistName ? _parseJsonStringArray(artistName) : artistsName,
    infoNode: price ? `${price} €` : undefined,
    actionsNode: isSimpleProduct
      ? React.createElement(BtnAddToCart, { input: input as any })
      : undefined,
    actions: actions,
    badge: pastille ? { label: _localizeField(pastille) as string } : undefined,
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
  // const isHorsLeMurs = tags?.some(
  //   (tag: Tag) => tag.slug?.current === "hors-les-murs",
  // );
  const isVisite = tags?.some(
    (tag: Tag) => tag.slug?.current === "visite-commentee",
  );
  const actions: CardAction[] = [];
  if (!isVisite) {
    actions.push({
      label: _localizeText("discoverTheEvent") as string,
      href: _linkResolver(input),
      variant: "primary",
    });
  }

  if (links && !isPast) {
    links.forEach((link: LinkExternal) => {
      actions.push({
        label: (_localizeField(link.label) as string) || "",
        href: link.link ?? "",
        variant: actions.length === 0 && isVisite ? "primary" : "secondary",
        type: link._type,
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
    infoNode: toInfoNode(dates, false),
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
  size: "sm" | "md" | "lg",
): CardBaseProps {
  const { imageCover } = input;
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  return {
    tags: _localizeText("artist"),
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

export function articleToCard(
  input: ArticleExpanded,
  size: "sm" | "md" | "lg",
): CardBaseProps {
  const { _type, title, subTitle, imageCover, tags } = input;
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  return {
    _type: _type,
    layout: size === "md" && !isLandscape ? "row" : "col",
    colorVar: "var(--color-article)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    tags: toTags(tags),
    title: (_localizeField(title) as string) || "",
    subTitle: (_localizeField(subTitle) as string) || "",
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
  size?: "sm" | "md",
): CardBaseProps {
  const { imageCover, tags, videoCover } = input;
  const isLandscape =
    (imageCover?.asset?.metadata?.dimensions?.width ?? 0) >
    (imageCover?.asset?.metadata?.dimensions?.height ?? 0);
  const playbackId = videoCover?.asset?.playbackId;
  return {
    _type: input._type,
    // layout: isLandscape ? "row" : "col",
    layout: isLandscape || videoCover ? "col" : "row",
    colorVar: "var(--color-white)",
    // images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
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
    title: (_localizeField(input.title) as string) || "",
    tags: toTags(tags),
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
  let text = null;
  const moduleText = input.modules?.filter((el) => el._type === "textUI");
  if (moduleText) {
    moduleText.forEach((el) => {
      text = toPlainText(_localizeField(el?.text || "no text"));
      // text = text.split(".")[0] + "...";
    });
  }

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
    infoNode: text ? text : undefined,

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

// ─── Feuilletage ─────────────────────────────────────────────────────────────

export function feuilletageToCard(input: FeuilletageExpanded): CardBaseProps {
  const { imageCover, video, tags, index, chercheur, description } = input;

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
    layout: "col",
    footerPlacement: "detached",
    colorVar: "var(--color-gris-100)",
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    mediaSlot: video
      ? React.createElement(EmbedVideo, { embedUrl: video.embedUrl })
      : undefined,
    tags: tagsLabel ? tagsLabel : _localizeText(input._type),
    // title: (_localizeField(input.title) as string) || "",
    // subTitle,
    title: subTitle || "",
    subTitle: (_localizeField(input.title) as string) || "",
    description: (_localizeField(description) as string) || undefined,
    // infoNode: toInfoNode(dates),
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
    mediaSlot: video
      ? React.createElement(EmbedVideo, { embedUrl: video.embedUrl })
      : undefined,
    tags: index
      ? `une image, des images #${index}`
      : _localizeText(input._type),
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

// ─── Conversation ─────────────────────────────────────────────────────────────

export function conversationToCard(input: ConversationExpanded): CardBaseProps {
  const { _type, title, subTitle, description, chercheur, imageCover, video } =
    input;
  return {
    _type: input._type,
    layout: "col",
    // images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    images: imageCover?.asset ? [imageCover.asset as SanityImageAssetFull] : [],
    mediaSlot: video
      ? React.createElement(EmbedVideo, { embedUrl: video.embedUrl })
      : undefined,
    tags: _localizeText(_type),
    title: (_localizeField(title) as string) || "",
    subTitle: subTitle
      ? _localizeField(subTitle)
      : chercheur?.name || undefined,
    // description: _localizeField(description),
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
    mediaSlot: video
      ? React.createElement(EmbedVideo, { embedUrl: video.embedUrl })
      : undefined,
    tags: index
      ? `une image, des images #${index}`
      : _localizeText(input._type),
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
