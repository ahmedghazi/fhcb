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
  }
`;

export const nav = `
  ...,
  _type == 'linkInternal' => {
    ${linkInternalWithImage},
    subMenu[]{
      ...,
      _type == 'linkInternal' => {
        ${linkInternal},
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
      ${cta}
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
  artists[]->{
    _id,
    name
  },
  tags[]->{
    _id,
    title,
    slug
  },
  pastille,
  links[]{
    ...
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
  },
  pastille,
  links[]{
    ...
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
  shopifyId,
  shopifyHandle,
  price,
  totalInventory,
  variants,
  inStock,
  languages,
  tags[]->{
    title
  },
  artists[]->{
    _id,
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

export const cardRefSerieThematique = `
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
  },
  _type == "serieThematique" => {
    ${cardRefSerieThematique}
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
      (
        (
          _type in [ "feuilletage", "imageImages", "serieThematique"] &&
          references(^.artist._ref)
        )
        ||
        (
          _type == "artist" &&
          _id == ^.artist._ref
        )
      )
    ] | order(dates[0].du asc) {
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
    "items": *[_type == "exhibition" && count(tags[_ref in *[_type == "tag" && slug.current == "exposition-en-cours"]._id]) > 0] | order(dates[0].du asc) {
      ${cardRefExhibition}
    },
    video{
      asset->{
        playbackId
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
      filterKey == "chercheur" => *[_type == "chercheur"] | order(name asc) { _id, _type, name, last_name, slug },
      filterKey == "language" => array::unique(*[_type == "product" && defined(languages)].languages[]) | order(@ asc),
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
    "items": *[_type == "feuilletage"] | order(index asc) {
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
    "items": *[_type == "imageImages"] | order(_createdAt desc) {
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
    "items": *[_type == "serieThematique" ] | order(_createdAt desc) {
      ${cardRefSerieThematique}
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
    "resolvedItems": *[
      _type == "exhibition"
      && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
      && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
    ] | order(dates[0].du asc) {
      ${cardRefExhibition}
    },
    cta{
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
    filters[]{
      ...,
      ${filterList},
      ${filterCheckbox}
    },
    "exhibitions": *[
      _type == "exhibition"
      && (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
      && (!defined(^.excludeTags[0]) || count(^.excludeTags[_ref in ^.tags[]._ref]) == 0)
    ] | order(dates[0].du asc) {
      ${cardRefExhibition}
    },
    "events": *[
      _type == "event"
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
/*
&& (!defined(^.filterTags[0]) || count(^.filterTags[_ref in ^.tags[]._ref]) > 0)
*/

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
    "resolvedItems": *[_type == "product"] | order(publicationDate asc) {
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
    "imageImages": *[_type == "imageImages"] | order(_createdAt desc)[0] {
      ${cardRefImageImages}
    },
    "feuilletage": *[_type == "feuilletage"] | order(_createdAt desc)[0] {
      ${cardRefFeuilletage}
    },
    "serieThematique": *[_type == "serieThematique"] | order(_createdAt desc)[0] {
      ${cardRefFeuilletage}
    },
    branches[]->{
      ${cardRefPageModulaire}
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

const allPostType = [
  "event",
  "exhibition",
  "feuilletage",
  "imageImages",
  "serieThematique",
  "product",
];
export const relatedByArtists = `
  *[
    _id != ^._id &&
    (
      (
        _type in ["event", "exhibition", "feuilletage", "imageImages", "serieThematique", "product"] &&
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
