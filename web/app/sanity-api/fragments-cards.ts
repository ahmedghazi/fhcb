import { imageAsset, videoAsset } from "./fragments-assets";

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
  countdown,
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
  dates[]{
    ...,
    location->
  },
  description,
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
  video,
  dates,
  description,
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

export const cardRefConversation = `
  _type,
  _id,
  index,
  title,
  subTitle,
  description,
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
  videoCover{
    ${videoAsset}
  },
  tags[]->,
`;

export const cardTypes = `
 _type == "pageModulaire" => {
    ${cardRefPageModulaire}
  },
  _type == "exhibition" => {
    ${cardRefExhibition}
  },
  _type == "product" => {
    ${cardRefProduct}
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
  _type == "serieThematique" => {
    ${cardRefSerieThematique}
  },
  _type == "conversation" => {
    ${cardRefConversation}
  }
`;
