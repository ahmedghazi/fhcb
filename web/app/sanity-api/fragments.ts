export const seo = `
  ...,
  metaImage{
    asset->{
      url
    }
  }
`;

export const imageAsset = `
  asset->{
    _id,
    assetId,
    title,
    altText,
    description,
    creditLine,
    metadata {
      lqip,
      dimensions {
        width,
        height,
      }
    }
  }
`;

const blockContentMarkDefs = `
markDefs[]{
  ...,
  _type == "linkInternal" => {
    ...,
    reference->
  }
}
`;
const blockcontentKeyValGroup = `
  _type == "keyValGroup" => {
      ...,
      items[]{
        ...,
        image{
          ${imageAsset}
        }
      }
    }
`;
export const blockContent = `
  ...,
  fr[]{
    ...,
     ${blockContentMarkDefs},
     ${blockcontentKeyValGroup}
  },
  en[]{
    ...,
    ${blockContentMarkDefs},
    ${blockcontentKeyValGroup}
  }
`;

export const linkInternal = `
  ...,
  link->{
    _type,
    slug
  }
`;

export const linkInternalWithImage = `
  ...,
  link->{
    _type,
    slug,
    "imageCover": coalesce(imageCover, image){
      // asset->{
      //   _id
      // }
      ${imageAsset}
    },
  }
`;

export const nav = `
  ...,
  _type == 'linkInternal' => {
      ${linkInternalWithImage},

    subMenu[]{
      ...,
      _type == 'linkInternal' => {
        ${linkInternalWithImage},
      }
    }
  },
  _type == 'linkIcon' => {
    ...,
    icon{
      asset->{
        _id,
        url
      }
    }
  }
`;

/**
     // imageCover{
    //   // ${imageAsset}
    //   asset->_id
    // }
 */

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
      coProduction[]->{
        ...,
        imageCover{
          ${imageAsset}
        }
      },
      partenaires[]->{
        ...,
        imageCover{
          ${imageAsset}
        }
      },
      keyVal
    }
  }
`;

export const listUI = `
  _type == "listUI" => {
    ...,
    items[]{
      ...
    },
    cta{
      ...
    }
  }
`;

export const listsUI = `
  _type == "listsUI" => {
    ...,
    items[]{
      ...
    }
  }
`;

const cardRefModulaire = `
  _type,
  _id,
  "title": coalesce(title, name),
  slug,
  "imageCover": coalesce(imageCover, image){
    ${imageAsset}
  },
`;

export const cardRefExhibition = `
  _type,
  _id,
title,
  slug,
  imageCover{
    ${imageAsset}
  },
  color,
  dates[]{
    ...,
    location->
  },
  location,
  artists[]->{
    _id,
    name
  },
  tags[]->{
    _id,
    title,
    slug
  }
`;
export const cardRefEvent = `
  _type,
  _id,
  title,
  subTitle,
  index,
  slug,
  imageCover{
    ${imageAsset}
  },
  dates,
  descripption,
  artists[]->{
    _id,
    name
  },
  tags[]->{
    _id,
    title,
    slug
  }
`;
export const cardRefFeuilletage = `
  _type,
  _id,
  title,
  subTitle,
  index,
  slug,
  imageCover{
    ${imageAsset}
  },
  dates,
  descripption,
  artists[]->{
    _id,
    name,
    slug
  },
  tags[]->{
    title,
    slug
  },
  chercheur->{
    _id,
    name,
    slug
  }
`;
export const cardRefProduct = `
  _type,
  _id,
  title,
  slug,
  "imageCover": coalesce(imageCover, image){
    ${imageAsset}
  },
  prix,
  tags[]->{
    title
  },
  artist->{
    name
  }
`;

export const cardRefArtist = `
  _type,
  _id,
  name,
  slug,
  "imageCover": coalesce(imageCover, image){
    ${imageAsset}
  },
`;

export const cardRefImageImages = `
  _type,
  _id,
  index,
  title,
  slug,
  chercheur->{
    _id,
    name,
    slug
  },
  artists[]->{
    _id,
    name,
    slug
  },
  "imageCover": coalesce(imageCover, image){
    ${imageAsset}
  },
  video
`;

export const cardRefArticle = `
    _type,
    _id,
    title,
    slug,
    imageCover{
      ${imageAsset}
    },
    tags[]->{
      title,
      slug
    }
  `;

export const cardRefPageModulaire = `
  _type,
  _id,
  "title": coalesce(title, name),
  slug,
  "imageCover": coalesce(imageCover, image){
    ${imageAsset}
  },
  tags[]->,
`;

export const cardTypes = `
  _type == "exhibition" => {
    ${cardRefExhibition}
  },
  _type == "product" => {
    ${cardRefProduct}
  },
  _type == "pageModulaire" => {
    ${cardRefModulaire}
  },
  _type == "artist" => {
    ${cardRefArtist}
  },
  _type == "event" => {
    ${cardRefEvent}
  },
  _type == "imageImages" => {
    ${cardRefImageImages}
  },
  _type == "feuilletage" => {
    ${cardRefFeuilletage}
  },
  _type == "article" => {
    ${cardRefArticle}
  },
  _type == "pageModulaire" => {
    ${cardRefPageModulaire}
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
      ...
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
      ...
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
    "items": *[_type == "exhibition" && count(tags[_ref in *[_type == "tag" && slug.current == "exposition-en-cours"]._id]) > 0] | order(dates[0].du asc) {
      ${cardRefExhibition}
    }
  }
`;

export const newsCardUI = `
  _type == "newsCardUI" => {
    ...,
    title{
      ...
    },
    gridSize,
    "exhibitions": *[_type == "exhibition" && count(tags[_ref in *[_type == "tag" && slug.current == "exposition-a-venir"]._id]) > 0] | order(dates[0].du asc) {
      ${cardRefExhibition}
    },
    "events": *[_type == "event" && count(tags[_ref in *[_type == "tag" && slug.current in ["visite-commentee", "feuilletage"]]._id]) > 0] | order(dates[0].du asc) {
      ${cardRefEvent}
    },
    "product": *[_type == "product" && count(tags[_ref in *[_type == "tag" && slug.current == "livre-du-mois"]._id]) > 0] | order(dates[0].du asc) {
      ${cardRefProduct}
    },
    "feuilletage": *[_type == "feuilletage" && count(artists[_ref in *[_type == "artist" && slug.current != ""]._id]) > 0 && dates[0].du >= now()] | order(dates[0].du asc) {
      ${cardRefFeuilletage}
    }
  }
`;

export const listSerieThematiqueUI = `
  _type == "listSerieThematiqueUI" => {
    ...,
    title{
      ...
    },
    "items": *[_type == "article" && count(tags[_ref in *[_type == "tag" && slug.current == "serie-thematique"]._id]) > 0] | order(_createdAt desc) {
      ${cardRefArticle}
    },
    cta{
      ...
    }
  }
`;

const filterRadio = `
  _type == "filterRadio" => {
    ...,
    radioOptions[]->{ _id, _type, name, title, slug }
  }
`;

const filterList = `
  _type == "filterList" => {
    ...,
    "radioOptions": select(
      radioKey == "artist" => *[_type == "artist"] | order(name asc) { _id, _type, name, slug },
      radioKey == "tag" => *[_type == "tag"] | order(coalesce(title.fr, title.en) asc) { _id, _type, title, slug },
      radioKey == "chercheur" => *[_type == "chercheur"] | order(name asc) { _id, _type, name, slug },
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
      ${filterRadio}
    },
    "items": *[_type == "feuilletage"] | order(index asc) {
      ${cardRefFeuilletage}
    },
    cta{
      ...
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
      ${filterRadio}
    },
    "items": *[_type == "imageImages"] | order(_createdAt desc) {
      ${cardRefImageImages}
    },
    cta{
      ...
    }
  }
`;

export const listExhibitionsUI = `
  _type == "listExhibitionsUI" => {
    ...,
    title{
      ...
    },
    "resolvedItems": select(
      items in ["exhibitions-past", "exhibitions-current", "exhibitions-futur", "exhibitions-out-of-the-box"] => *[
        _type == "exhibition"
        && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
        && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
      ] | order(dates[0].du asc) {
        ${cardRefExhibition}
      },
      []
    ),
    cta{
      ...
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
      ${filterRadio}
    },
    "resolvedItems": select(
      items in ["exhibitions-past"] => *[
        _type == "exhibition"
        && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
      ] | order(dates[0].du asc) {
        ${cardRefExhibition}
      },
      []
    ),
    cta{
      ...
    }
  }
`;

export const listEventsUI = `
  _type == "listEventsUI" => {
    ...,
    title{
      ...
    },

    "resolvedItems": select(
      items in ["events", "guided-tours"] => *[
        _type == "event"
        && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
        && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
      ] | order(coalesce(dates[0].du, _createdAt) asc) {
        ${cardRefEvent}
      },
      []
    ),
    cta{
      ...
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
      ...
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
  ${listFeuilletageUI},
  ${listImageImages},
  ${listSerieThematiqueUI},
  ${listExhibitionsUI},
  ${listExhibitionsPastUI},
  ${listEventsUI},
  ${supportUI},
  ${newsletterUI}
`;

export const relatedByArtist = `
  *[
    _id != ^._id &&
    (
      (
        _type in ["event", "exhibition", "event", "product"] &&
        references(^.artists[]._ref)
      )
      ||
      (
        _type == "artist" &&
        _id in ^.artists[]._ref
      )
    )
  ] | order(dates[0].du asc) {
    ${cardTypes}
  }
`;

export const relatedByTag = `
  *[
    _id != ^._id &&
    _type in ["exhibition", "event", "product", "article", "feuilletage"] &&
    count(^.tags) > 0 &&
    references(^.tags[]._ref)
  ] {
    ${cardTypes}
  }
`;
