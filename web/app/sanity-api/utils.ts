import i18n from "../config/i18n";
import useLocale from "../context/LocaleContext";
import {
  Artist,
  Event,
  Exhibition,
  Library,
  PageModulaire,
  Product,
} from "./types/sanity.types";

export const _linkResolver = (
  node: PageModulaire | Exhibition | Event | Artist | Library | Product | any,
) => {
  if (!node || !node._type || (node._type === "pageModulaire" && node.homePage))
    return "/";
  // console.log(node._type);
  switch (node._type) {
    case "programme":
      return `/programme/${node.slug?.current}`;
    case "exhibition":
      return `/exhibition/${node.slug?.current}`;
    case "event":
      return `/event/${node.slug?.current}`;
    case "artist":
      return `/artist/${node.slug?.current}`;
    case "library":
      return `/${node.slug?.current}`;
    case "product":
      return `/publications/${node.slug?.current}`;
    case "imageImages":
      return `/image-images/${node.slug?.current}`;
    case "feuilletage":
      return `/feuilletage/${node.slug?.current}`;
    case "serieThematique":
      return `/serie-thematique/${node.slug?.current}`;
    case "article":
      return `/article/${node.slug?.current}`;

    default:
      return `/${node.slug?.current}`;
  }
};

export const _localizeText = (text: string) => {
  const { locale } = useLocale();
  const currentI18N = (i18n as any)[`${locale}`];
  return currentI18N[text] ? currentI18N[text] : text;
};

export const _localizeField = (field: any) => {
  const { locale } = useLocale();
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[locale] ? field[locale] : field["fr"];
};
