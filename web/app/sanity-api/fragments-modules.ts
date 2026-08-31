import {
  cardRefArticle,
  cardRefConversation,
  cardRefEvent,
  cardRefExhibition,
  cardRefFeuilletage,
  cardRefImageImages,
  cardRefPageModulaire,
  cardRefProduct,
  cardRefSerieThematique,
  cardTypes,
} from "./fragments-cards";
import { imageAsset, videoAsset } from "./fragments-assets";
import { blockContent, cta } from "./fragments";

const TAG_CURRENT_SLUG = "exposition-en-cours";
const TAG_UPCOMING_SLUG = "exposition-a-venir";
const TAG_VISITE_COMMENTEE_SLUG = "visite-commentee";
const TAG_PRODUCT_LIVRE_DU_MOIS_SLUG = "livre-du-mois";

export const imageInGrid = `
  ...,
  image{
    ${imageAsset}
  }
`;

export const textUI = `
  _type == "textUI" => {
    ...,
    title{
      ...
    },
    text{
      ${blockContent}
    }
  }
`;

export const blockquoteUI = `
  _type == "blockquoteUI" => {
    ...
  }
`;

export const imagesUI = `
  _type == "imagesUI" => {
    ...,
    title,
    items[]{
      ${imageInGrid}
    }
  }
`;

export const videoUI = `
  _type == "videoUI" => {
    ...,
    video{
      ...,
      placeholder{
        asset->
      }
    }
  }
`;

export const textImageUI = `
  _type == "textImageUI" => {
    ...,
    image{
      ${imageAsset}
    },
    text{
      ${blockContent}
    },
    direction
  }
`;

export const textSidebarUI = `
  _type == "textSidebarUI" => {
    ...,
    text{
      ${blockContent}
    },
    sidebar{
      commissariat,
      coProduction[]{
        _type == "reference" => @->{
          ...,
          imageCover{
            ${imageAsset}
          }
        },
        _type == "keyVal" => {
          ...,
           image{
            ${imageAsset}
          }
        }
      },

      partenaires[]->{
        ...,
        imageCover{
          ${imageAsset}
        }
      },
      partenairesMedia[]{
        _type == "reference" => @->{
          ...,
          "image": imageCover{
            ${imageAsset}
          }
        },
        _type == "keyVal" => {
          ...,
          "image": image{
            ${imageAsset}
          }
        }
      },
      products[]->{
        ${cardRefProduct},
        exhibition->{
          _type,
          slug
        },
      },
      keyVal[]{
        ...,
        image{
          ${imageAsset}
        }
      }
    }
  }
`;

const listItem = `
  ...,
  text{
    ${blockContent}
  }
`;

export const listUI = `
  _type == "listUI" => {
    ...,
    items[]{
      ${listItem}
    },
    cta{
      ${cta}
    }
  }
`;

export const listsUI = `
  _type == "listsUI" => {
    ...,
    items[]{
      ${listItem}
    }
  }
`;

export const sliderCardUI = `
  _type == "sliderCardUI" => {
    ...,
    title{
      ...
    },
    items[]->{
      ...,
      ${cardTypes}
    },
    cta{
      ${cta}
    }
  }
`;

export const sliderArtistUI = `
  _type == "sliderArtistUI" => {
    ...,
    artist->{
      _id,
      name,
      slug
    },
    "items": *[
      _id != ^._id &&
      !(_id in path("drafts.**")) &&
      (
        (
          _type in ["feuilletage", "imageImages", "serieThematique", "conversation"] &&
          references(^.artist._ref)
        )
        ||
        (
          _type == "artist" &&
          _id == ^.artist._ref
        )
      )
    ] | order(dates[0].du asc)[0...20] {
      ${cardTypes}
    },
    cta{
      ${cta}
    }
  }
`;

export const gridCardUI = `
  _type == "gridCardUI" => {
    ...,
    title{
      ...
    },
    items[]->{
      ...,
      ${cardTypes}
    },
    cta{
      ${cta}
    }
  }
`;

export const programmeUI = `
  _type == "programmeUI" => {
    ...,
    title{
      ...
    },
    items[]->{
      _type,
      _id,
      title,
      slug,
      "imageCover": coalesce(imageCover, image){
        ${imageAsset}
      },
      dateStart,
      dateEnd,
      dates
    }
  }
`;

export const featuredCardsUI = `
  _type == "featuredCardsUI" => {
    ...,
    title,
    gridSize,
    "items": *[_type == "exhibition" && !(_id in path("drafts.**")) && (
      count(tags[_ref in *[_type == "tag" && slug.current == "${TAG_CURRENT_SLUG}"]._id]) > 0
      || (count(tags[_ref in *[_type == "tag" && slug.current == "${TAG_UPCOMING_SLUG}"]._id]) > 0 && defined(countdown) && countdown <= 15)
    )] | order(dates[0].du asc) {
      ${cardRefExhibition}
    },
    cardVideoMux{
      ...,
      video{
        ${videoAsset}
      },
      cta{
        ${cta}
      }
    }
  }
`;

export const newsCardUI = `
  _type == "newsCardUI" => {
    ...,
    title{
      ...
    },
    "events": *[_type == "event" && !(_id in path("drafts.**")) && count(tags[_ref in *[_type == "tag" && slug.current != "${TAG_VISITE_COMMENTEE_SLUG}"]._id]) > 0] | order(dates[0].du asc) {
      ${cardRefEvent}
    },
    "eventsVisite": *[_type == "event" && !(_id in path("drafts.**")) && count(tags[_ref in *[_type == "tag" && slug.current == "${TAG_VISITE_COMMENTEE_SLUG}"]._id]) > 0] | order(dates[0].du asc) {
      ${cardRefEvent}
    },
    "product": *[ _type == "product" && !(_id in path("drafts.**")) && count(tagsProduct[_ref in *[_type == "tagProduct" && slug.current == "${TAG_PRODUCT_LIVRE_DU_MOIS_SLUG}"]._id]) > 0 ] | order(coalesce(date, _createdAt) desc)[0] {
      ${cardRefProduct}
    },
    "articles": *[_type == "article"] | order(_createdAt desc)[0...3]{
      ${cardRefArticle}
    },
    "exhibitions": *[_type == "exhibition" && !(_id in path("drafts.**")) && count(tags[_ref in *[_type == "tag" && slug.current == "${TAG_UPCOMING_SLUG}"]._id]) > 0 ] | order(dates[locationType == "inSite-cube"][0].du asc) {
      ${cardRefExhibition}
    },

  }
`;

const filterCheckbox = `
  _type == "filterCheckbox" => {
    ...,
    // "filterOptions": select(
    //   filterKey == "artist" => *[_type == "artist"] | order(name asc) { _id, _type, name, last_name, slug },
    //   filterKey == "tag" => *[_type == "tag"] | order(coalesce(title.fr, title.en) asc) { _id, _type, title, slug },
    //   filterKey == "chercheur" => *[_type == "chercheur"] | order(name asc) { _id, _type, name, last_name, slug },
    //   []
    // )
    filterOptions[]->{ _id, _type, name, title, slug }
  }
`;

const filterRadio = `
  _type == "filterRadio" => {
    ...,
    filterOptions[]->{ _id, _type, name, title, slug }
  }
`;

const filterList = `
  _type == "filterList" => {
    ...,
    "filterOptions": select(
      filterKey == "artist" => *[_type == "artist"] | order(name asc) { _id, _type, name, last_name, slug },
      filterKey == "tag" => *[_type == "tag"] | order(coalesce(title.fr, title.en) asc) { _id, _type, title, slug },
      filterKey == "tagProduct" => *[_type == "tagProduct"] | order(order asc) { order, _id, _type, title, slug },
      filterKey == "chercheur" => *[_type == "chercheur"] | order(name asc) { _id, _type, name, last_name, slug },
      filterKey == "language" => array::unique(*[_type == "product"].variants[].selectedOptions[name match "*lang*" || name match "*lingu*"].value)[defined(@)] | order(@ asc),
      []
    )
  }
`;

export const listFeuilletageUI = `
  _type == "listFeuilletageUI" => {
    ...,
    title{
      ...
    },
    filters[]{
      ...,
      ${filterList},
      ${filterCheckbox}
    },
    "items": *[_type == "feuilletage" && !(_id in path("drafts.**"))] | order(index asc) {
      ${cardRefFeuilletage}
    },
    cta{
      ${cta}
    }
  }
`;

export const listImageImages = `
  _type == "listImageImages" => {
    ...,
    title{
      ...
    },
    filters[]{
      ...,
      ${filterList},
      ${filterCheckbox}
    },
    "items": *[_type == "imageImages" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      ${cardRefImageImages}
    },
    cta{
      ${cta}
    }
  }
`;

export const listSerieThematiqueUI = `
  _type == "listSerieThematiqueUI" => {
    ...,
    title{
      ...
    },
    filters[]{
      ...,
      ${filterList},
      ${filterCheckbox}
    },
    "items": *[_type == "serieThematique" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      ${cardRefSerieThematique}
    },
    cta{
      ${cta}
    }
  }
`;

export const listConversationUI = `
  _type == "listConversationUI" => {
    ...,
    title{
      ...
    },
    filters[]{
      ...,
      ${filterList},
      ${filterCheckbox}
    },
    "items": *[_type == "conversation" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      ${cardRefConversation}
    },
    cta{
      ${cta}
    }
  }
`;

export const listExhibitionsUI = `
  _type == "listExhibitionsUI" => {
    ...,
    title{
      ...
    },
    filterTags[]->{
      title, slug
    },
    "resolvedItems": *[
      _type == "exhibition"
      && !(_id in path("drafts.**"))
      && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
      && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
    ] | order(
      select(
        count(dates[locationType == "inSite-cube"]) > 0 => 0,
        count(dates[locationType == "inSite-tube"]) > 0 => 1,
        2
      ) asc,
      dates[0].du asc
    ) {
      ${cardRefExhibition}
    },
    cta{
      ${cta}
    },
    linkFallback{
      ${cta}
    }
  }
`;

export const listExhibitionsPastUI = `
  _type == "listExhibitionsPastUI" => {
    ...,
    title{
      ...
    },
    filters[]{
      ...,
      ${filterList},
      ${filterCheckbox}
    },
    "resolvedItems": *[
      _type == "exhibition"
      && !(_id in path("drafts.**"))
      && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
      && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
    ] | order(dates[0].du desc) {
      ${cardRefExhibition}
    },
    cta{
      ${cta}
    }
  }
`;

export const listExhibitionsEventsUI = `
  _type == "listExhibitionsEventsUI" => {
    ...,
    title{
      ...
    },
    filterTags[]->{
      title
    },
    filters[]{
      ...,
      ${filterList},
      ${filterCheckbox}
    },
    "exhibitions": *[
      _type == "exhibition"
      && !(_id in path("drafts.**"))
      && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
      && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
    ] | order(dates[0].du asc) {
      ${cardRefExhibition}
    },
    "events": *[
      _type == "event"
      && !(_id in path("drafts.**"))
      && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
      && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
    ] | order(coalesce(dates[0].du, _createdAt) asc) {
      ${cardRefEvent}
    },
    cta{
      ${cta}
    }
  }
`;

export const listEventsUI = `
  _type == "listEventsUI" => {
    ...,
    title{
      ...
    },
    cardSize,
    filterTags[]->{
      slug
    },
    "resolvedItems": *[
      _type == "event"
      && !(_id in path("drafts.**"))
      && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
      && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
    ] | order(coalesce(dates[0].du, _createdAt) asc) {
      ${cardRefEvent}
    },
    cta{
      ${cta}
    },
    linkFallback{
      ${cta}
    }
  }
`;

export const listProductUI = `
  _type == "listProductUI" => {
    ...,
    title{
      ...
    },
    filters[]{
      ...,
      ${filterList},
      ${filterCheckbox}
    },
    "resolvedItems": *[_type == "product" && !(_id in path("drafts.**"))] | order(
      select(
      "${TAG_PRODUCT_LIVRE_DU_MOIS_SLUG}" in tagsProduct[]->slug.current => 1,
      0
    ) desc,
      _createdAt asc
    ) {
      ${cardRefProduct}
    },
    cta{
      ${cta}
    }
  }
`;

export const supportUI = `
  _type == "supportUI" => {
    ...,
    image{
      ${imageAsset}
    },
    cta{
      ${cta}
    }
  }
`;

export const newsletterUI = `
  _type == "newsletterUI" => {
    ...,
    image{
      ${imageAsset}
    }
  }
`;

export const ressourcesUI = `
  _type == "ressourcesUI" => {
    ...,
    "imageImages": *[_type == "imageImages" && !(_id in path("drafts.**"))] | order(_createdAt desc)[0] {
      ${cardRefImageImages}
    },
    "feuilletage": *[_type == "feuilletage" && !(_id in path("drafts.**"))] | order(_createdAt desc)[0] {
      ${cardRefFeuilletage}
    },
    "serieThematique": *[_type == "serieThematique" && !(_id in path("drafts.**"))] | order(_createdAt desc)[0] {
      ${cardRefFeuilletage}
    },
    "conversation": *[_type == "conversation" && !(_id in path("drafts.**"))] | order(_createdAt desc)[0] {
      ${cardRefConversation}
    },
    branches[]->{
      ${cardRefPageModulaire}
    },
    cta{
      ${cta}
    }
  }
`;

export const formUI = `
  _type == "formUI" => {
    ...
  }
`;

export const modules = `
  ...,
  ${textUI},
  ${imagesUI},
  ${videoUI},
  ${textImageUI},
  ${textSidebarUI},
  ${listUI},
  ${listsUI},
  ${sliderCardUI},
  ${gridCardUI},
  ${programmeUI},
  ${featuredCardsUI},
  ${newsCardUI},
  ${ressourcesUI},
  ${listFeuilletageUI},
  ${listImageImages},
  ${listSerieThematiqueUI},
  ${listConversationUI},
  ${listExhibitionsUI},
  ${listExhibitionsPastUI},
  ${listExhibitionsEventsUI},
  ${listEventsUI},
  ${supportUI},
  ${newsletterUI},
  ${formUI},
  ${blockquoteUI},
  ${sliderArtistUI}
`;
