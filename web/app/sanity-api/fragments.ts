export const seo = `
  ...,
  metaImage{
    asset->
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
      asset->
    }
  }
`;

export const blockContent = `
  ...,
  fr[]{
    ...,
    markDefs[] {
      ...,
      _type == "linkInternal" => {
        ...,
        reference->,
      },
    }
  },
  en[]{
    ...,
    markDefs[] {
      ...,
      _type == "linkInternal" => {
        ...,
        reference->,
      },
    }
  }
`;

export const image = `
  asset->,
  caption,
  alt,
  author,
  copyright
`;

export const imageInGrid = `
  ...,
  image{
    ${image}
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
      ${image}
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
    sidebar[]{
      ${blockContent}
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

const cardRef = `
  _type,
  _id,
  "title": coalesce(title, name),
  slug,
  "imageCover": coalesce(imageCover, image){ asset-> }
`;

const cardRefExhibition = `
  _type,
  _id,
  "title": coalesce(title, name),
  slug,
  "imageCover": coalesce(imageCover, image){ asset-> },
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
  "imageCover": coalesce(imageCover, image){ asset-> },
  prix,
  tags[]->{
    title
  },
  artist->{
    name
  }
`;

const cardTypes = `
  _type == "exhibition" => {
    ${cardRefExhibition}
  },
  _type == "product" => {
    ${cardRefProduct}
  },
  _type == "page" => {
    ${cardRef}
  },
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
      "image": coalesce(imageCover, image){ asset-> },
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
