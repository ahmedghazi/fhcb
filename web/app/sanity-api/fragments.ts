import { cardTypes } from "./fragments-cards";
import { imageAsset } from "./fragments-assets";

export { imageAsset, videoAsset } from "./fragments-assets";

export const ressourcesTypes = [
  "feuilletage",
  "imageImages",
  "serieThematique",
  "conversation",
];
export const seo = `
  ...,
  metaImage{
    asset->{
      url
    }
  }
`;

export const cta = `
  ...,
   internal {
    label,
    link->{
      _type,
      slug
    }
  },
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
const blockcontentCta = `
  _type == "blockContentCta" => {
    ${cta}
  }
`;
const blockcontentImage = `
  _type == "image" => {
    ...,
    ${imageAsset}
  }
`;

export const blockContentItem = `
  ...,
  ${blockContentMarkDefs},
  ${blockcontentKeyValGroup},
  ${blockcontentCta},
  ${blockcontentImage}
`;

export const blockContent = `
  ...,
  fr[]{
    ${blockContentItem}
  },
  en[]{
    ${blockContentItem}
  }
`;

/*
link->{
    _type,
    slug,
    "imageCover": coalesce(imageCover, image){
      ${imageAsset}
    },
    modules[]{
      ...,
      _type == "listExhibitionsUI" => {
        "items": *[
          _type == "exhibition"
          && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
          && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
        ] | order(dates[0].du asc) {
          "imageCover": imageCover{
            ${imageAsset}
          }
        }
      },
      _type == "listExhibitionsPastUI" => {
        "items": *[
          _type == "exhibition"
          && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
          && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
        ] | order(dates[0].du asc) {
          "imageCover": imageCover{
            ${imageAsset}
          }
        }
      },

      _type == "listEventsUI" => {
        "items": *[
          _type == "event"
          && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
          && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
        ] | order(dates[0].du asc) {
          "imageCover": imageCover{
            ${imageAsset}
          }
        }
      },
      _type in ["sliderCardUI", "gridCardUI"] => {
        items[]->{
          "imageCover": coalesce(imageCover, image){
            ${imageAsset}
          }
        }
      }
    }
  }
*/

export const linkInternal = `
  ...,
  link->{
    _type,
    slug
  }
`;

export const linkInternalWithImage = `
  ...,
  ${linkInternal},
  imageCover{
    ${imageAsset}
  },
  withSubmenuImages
`;
export const linkInternalWithImages = `
  ...,
  link->{
    _type,
    slug,
    modules[]{
      ...,
      _type == "listExhibitionsUI" => {
        "items": *[
          _type == "exhibition"
          && !(_id in path("drafts.**"))
          && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
          && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
        ] | order(dates[0].du asc) {
          "imageCover": imageCover{
            ${imageAsset}
          }
        }
      },
      _type == "listExhibitionsPastUI" => {
        "items": *[
          _type == "exhibition"
          && !(_id in path("drafts.**"))
          && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
          && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
        ] | order(dates[0].du asc) {
          "imageCover": imageCover{
            ${imageAsset}
          }
        }
      },

      _type == "listEventsUI" => {
        "items": *[
          _type == "event"
          && !(_id in path("drafts.**"))
          && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
          && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
        ] | order(dates[0].du asc) {
          "imageCover": imageCover{
            ${imageAsset}
          }
        }
      },
    }
  }

`;

export const nav = `
  ...,
  _type == 'linkInternal' => {
    ${linkInternalWithImage},
    subMenu[]{
      ...,
      _type == 'linkInternal' => {
        ${linkInternalWithImages},
        subMenu[]{
          ${linkInternal}
        }
      }
    },
    withMessage,
    navMessage{
      ${blockContent}
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

const allPostType = [
  "event",
  "exhibition",
  "feuilletage",
  "imageImages",
  "serieThematique",
  "product",
  "article",
];

export const relatedByExhibition = `
  *[
    _id != ^._id &&
    !(_id in path("drafts.**")) &&
    (
      (
        _type in ["event", "feuilletage", "imageImages", "serieThematique", "conversation", "article"] &&
        references(^._id)
      )
      ||
      (
        _type == "product" &&
        (references(^._id) || references(^.artists[]._ref))
      )

    )
  ] | order(dates[0].du asc) {
    ${cardTypes}
  }
`;

export const relatedByArtist = `
  *[
    _id != ^._id &&
    !(_id in path("drafts.**")) &&
    (
      _type in ["event", "exhibition", "feuilletage", "imageImages", "serieThematique", "conversation", "product"] &&
      references(^._id)
    )
  ] | order(dates[0].du asc) {
    ${cardTypes}
  }
`;

export const relatedByArtists = `
  *[
    _id != ^._id &&
    !(_id in path("drafts.**")) &&
    (
      (
        _type in ["event", "exhibition", "feuilletage", "imageImages", "serieThematique", "conversation", "product"] &&
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

export const relatedProductsByArtist = `
  *[
    _type == "product" &&
    _id != ^._id &&
    !(_id in path("drafts.**")) &&
    count(artists[@._ref in ^.^.artists[]._ref]) > 0
  ] | order(_createdAt desc)[0...2] {
    ${cardTypes}
  }
`;

export const relatedProductsByTag = `
  *[
    _type == "product" &&
    _id != ^._id &&
    !(_id in path("drafts.**")) &&
    count(tagsProduct[@._ref in ^.^.tagsProduct[]._ref]) > 0
  ] | order(_createdAt desc)[0...2] {
    ${cardTypes}
  }
`;

export const relatedByTag = `
  *[
    _id != ^._id &&
    !(_id in path("drafts.**")) &&
    _type in ["exhibition", "event", "product", "article", "feuilletage"] &&
    count(^.tags) > 0 &&
    references(^.tags[]._ref)
  ] {
    ${cardTypes}
  }
`;

export const relatedRessourcesByArtists = `
  *[
    _type in ["feuilletage", "imageImages", "serieThematique", "conversation"] &&
    _id != ^._id &&
    !(_id in path("drafts.**")) &&
    count(artists[@._ref in ^.^.artists[]._ref]) > 0
  ] | order(_createdAt desc) {
    ${cardTypes}
  }
`;

export const randomRessources = `
  *[
    _type in ["feuilletage", "imageImages", "serieThematique", "conversation"] &&
    _id != ^._id &&
    !(_id in path("drafts.**")) &&
    count(artists[@._ref in ^.^.artists[]._ref]) > 0
  ] | order(_createdAt desc) {
    ${cardTypes}
  }
`;
