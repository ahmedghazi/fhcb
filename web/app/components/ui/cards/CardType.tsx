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

type Context = "grid" | "slider" | "rebonds";
type Size = "sm" | "md" | "lg";

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
  size?: Size | null;
};

// default size per card type, per usage context (mirrors the per-context sizes that
// previously lived duplicated across ModuleGridCardUI, ModuleSliderCardUI and Rebonds)
const SIZES = {
  event: { grid: "sm", slider: "md", rebonds: "sm" },
  exhibition: { grid: "sm", slider: "md", rebonds: "md" },
  product: { grid: "sm", slider: "sm", rebonds: "sm" },
  article: { grid: "sm", slider: "sm", rebonds: "md" },
  artist: { grid: "md", slider: "md", rebonds: "sm" },
  imageImages: { grid: "md", slider: "md", rebonds: "md" },
  feuilletage: { grid: "md", slider: "md", rebonds: "md" },
  conversation: { grid: "md", slider: "md", rebonds: "md" },
} satisfies Record<string, Record<Context, Size>>;

const CardType = ({ input, context, size }: Props) => {
  if (!input) return null;
  const sizeFor = (type: keyof typeof SIZES) => SIZES[type][context];

  return (
    <>
      {input._type === "event" && (
        <CardEvent input={input} size={sizeFor("event")} />
      )}
      {input._type === "exhibition" && (
        <CardExhibition input={input} size={sizeFor("exhibition")} />
      )}
      {input._type === "product" && (
        <CardProduct
          input={input}
          size={context === "grid" ? size || "sm" : sizeFor("product")}
        />
      )}
      {input._type === "pageModulaire" && (
        <CardPageModulaire input={input} size='md' />
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
    </>
  );
};

export default CardType;
