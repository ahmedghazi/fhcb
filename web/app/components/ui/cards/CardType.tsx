import React from "react";
import CardPageModulaire from "./CardPageModulaire";
import CardArtist from "./CardArtist";
import CardEvent from "./CardEvent";
import CardExhibition from "./CardExhibition";
import CardImageImages from "./CardImageImages";
import CardFeuilletage from "./CardFeuilletage";
import {
  PageModulaireExpanded,
  ArtistExpanded,
  EventExpanded,
  ExhibitionExpanded,
  FeuilletageExpanded,
  ImageImagesExpanded,
  ProductExpanded,
  ArticleExpanded,
  ConversationExpanded,
} from "@/app/sanity-api/types/sanity-expanded.types";
import CardProduct from "./CardProduct";
import CardArticle from "./CardArticle";
import CardConversation from "./CardConversation";
import { _isCurrentByDates, _isPast, _isPastByDates } from "@/app/lib/utils";
import CardBranche from "./CardBranche";
import { FhcbDate } from "@/app/sanity-api/types/sanity.types";
import CardExhibitionFeatured from "./CardExhibitionFeatured";

type Context = "grid" | "slider" | "rebonds" | "search";
type Size = "sm" | "md" | "md-alt" | "lg";
type SizeAlt = "sm" | "md";

type Props = {
  input:
    | PageModulaireExpanded
    | ProductExpanded
    | EventExpanded
    | ExhibitionExpanded
    | ArtistExpanded
    | ImageImagesExpanded
    | FeuilletageExpanded
    | ArticleExpanded
    | ConversationExpanded;
  context: Context;
  // editor-configurable size from the GridCardUI module (only used for product in grid context)
  size?: "sm" | "md" | "lg" | null;
};

// default size per card type, per usage context (mirrors the per-context sizes that
// previously lived duplicated across ModuleGridCardUI, ModuleSliderCardUI and Rebonds)
const SIZES = {
  event: { grid: "sm", slider: "md", rebonds: "sm", search: "sm" },
  exhibition: { grid: "sm", slider: "md", rebonds: "md", search: "md" },
  exhibitionPast: { grid: "sm", slider: "sm", rebonds: "sm", search: "md" },
  exhibitionFeatured: {
    grid: "sm",
    slider: "md",
    rebonds: "md-alt",
    search: "lg",
  },
  product: { grid: "sm", slider: "sm", rebonds: "sm", search: "sm" },
  article: { grid: "sm", slider: "sm", rebonds: "sm", search: "sm" },
  artist: { grid: "sm", slider: "sm", rebonds: "sm", search: "sm" },
  imageImages: { grid: "md", slider: "md", rebonds: "md", search: "md" },
  feuilletage: { grid: "md", slider: "md", rebonds: "md", search: "md" },
  conversation: { grid: "md", slider: "md", rebonds: "md", search: "md" },
  pageModulaire: { grid: "md", slider: "md", rebonds: "sm", search: "sm" },
} as const satisfies Record<string, Record<Context, Size>>;

const CardType = ({ input, context, size }: Props) => {
  if (!input) return null;
  function sizeFor(
    type:
      | "exhibition"
      | "exhibitionFeatured"
      | "event"
      | "product"
      | "article"
      | "artist"
      | "imageImages"
      | "feuilletage"
      | "pageModulaire",
  ): "sm" | "md" | "lg";
  function sizeFor(type: keyof typeof SIZES) {
    return SIZES[type][context];
  }

  // const sizeForExhibition = (input: ExhibitionExpanded) => {
  //   if (!input.dates) return SIZES["exhibition"][context];
  //   const isPast = input.dates && _isPastByDates(input.dates);
  //   const isCurrent = _isCurrentByDates(input.dates);
  //   let size = "sm";
  //   if (isPast) return SIZES["exhibitionPast"][context];
  //   else if (isCurrent) return "md";
  //   else return SIZES["exhibition"][context];
  // };
  const _isBrancheRessources = (_input: PageModulaireExpanded) => {
    const is = _input.tags?.some(
      (el) => el?.slug?.current === "branches-ressources",
    );

    return is;
  };

  return (
    <>
      {input._type === "event" && (
        <CardEvent input={input} size={sizeFor("event")} />
      )}
      {input._type === "exhibition" &&
        _isCurrentByDates(input.dates as FhcbDate[]) && (
          <CardExhibitionFeatured input={input} />
        )}
      {input._type === "exhibition" &&
        !_isCurrentByDates(input.dates as FhcbDate[]) && (
          // <CardExhibition input={input} size={sizeForExhibition(input)} />
          <CardExhibition input={input} size={sizeFor("exhibition")} />
        )}

      {input._type === "product" && (
        <CardProduct
          input={input}
          size={context === "grid" ? size || "sm" : sizeFor("product")}
        />
      )}
      {input._type === "pageModulaire" && _isBrancheRessources(input) && (
        <CardBranche
          input={input as unknown as PageModulaireExpanded}
          size='sm'
        />
      )}
      {input._type === "pageModulaire" && !_isBrancheRessources(input) && (
        <CardPageModulaire input={input} size={"md"} />
      )}
      {input._type === "article" && (
        <CardArticle input={input} size={sizeFor("article")} />
      )}
      {input._type === "artist" && (
        <CardArtist input={input} size={sizeFor("artist")} />
      )}
      {input._type === "imageImages" && (
        <CardImageImages input={input} size={sizeFor("imageImages")} />
      )}
      {input._type === "feuilletage" && (
        <CardFeuilletage input={input} size={sizeFor("feuilletage")} />
      )}
      {input._type === "conversation" && <CardConversation input={input} />}
    </>
  );
};

export default CardType;
