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
    imageCover{
      ${imageAsset}
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
      }
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

const cardRefExhibition = `
  _type,
  _id,
  "title": coalesce(title, name),
  slug,
  "imageCover": coalesce(imageCover, image){
    ${imageAsset}
  },
  dates,
  artists[]->{
    name
  }
`;

const cardRefProduct = `
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

const cardRefArtist = `
  _type,
  _id,
  name,
  slug,
  "imageCover": coalesce(imageCover, image){
    ${imageAsset}
  },

`;

const cardTypes = `
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
  ${programmeUI}
`;
