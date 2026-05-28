import { groq } from "next-sanity";
import { sanityFetch } from "./sanity.client";
import {
  imageAsset,
  cardRefExhibition,
  linkInternal,
  linkInternalWithImage,
  modules,
  seo,
  cardRefEvent,
  cardRefImageImages,
  nav,
  cardTypes,
  relatedByArtist,
  relatedByTag,
} from "./fragments";
import {
  Article,
  ARTIST_QUERY_RESULT,
  EXPHIBITION_QUERY_RESULT,
  Feuilletage,
  FEUILLETAGE_QUERY_RESULT,
  HOME_QUERY_RESULT,
  IMAGE_IMAGES_QUERY_RESULT,
  PAGE_MODULAIRE_QUERY_RESULT,
  PROGRAMME_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
} from "./types/sanity.types";

/*****************************************************************************************************
 * SETTINGS
 */
export const SETTINGS_QUERY = groq`*[_type == "settings"][0]{
  ...,
  navPrimary[]{
   ${nav}
  },
  navSecondary[]{
    ${nav}
  },
  navTertiary[]{
    ${nav}
  },
  navQuaternary[]{
    ${nav}
  },
  navLegals[]{
    ${nav}
  },
  navSocial[]{
    ${nav}
  },
  btnLibrary{
    ...,
    link->{
      _type,
      slug
    }
  },
  btnTickets{
    ...
  },
  mostSearched[]->{
    _type,
    slug,
    "title": coalesce(title, name)
  },

  siteDescription{
    ...
  },
  baseline{
    ...
  },
}`;

export async function getSettings(): Promise<SETTINGS_QUERY_RESULT> {
  return sanityFetch({
    query: SETTINGS_QUERY,
    tags: ["settings"],
  });
}

/*****************************************************************************************************
 * Home
 */
export const HOME_QUERY = groq`
*[_type == "home"][0]{
  ...,
  seo{
    ${seo}
  },
  modules[]{
    ${modules}
  }
}`;

export async function getHome(): Promise<HOME_QUERY_RESULT> {
  return sanityFetch({
    query: HOME_QUERY,
    tags: ["home"],
  });
}

/*****************************************************************************************************
 * PAGE MODULAIRE
 */
export const PAGE_MODULAIRE_QUERY = groq`*[_type == "pageModulaire" && slug.current == $slug][0]{
    ...,
    seo{
      ${seo}
    },
    modules[]{
      ${modules}
    }
  }`;

export async function getPageModulaire(
  slug: string,
): Promise<PAGE_MODULAIRE_QUERY_RESULT> {
  return sanityFetch({
    query: PAGE_MODULAIRE_QUERY,
    tags: ["pageModulaire"],
    qParams: { slug },
  });
}

/*****************************************************************************************************
 * ARTIST
 */
export const ARTIST_QUERY = groq`*[_type == "artist" && slug.current == $slug][0]{
    ...,
    seo{
      ${seo}
    },
    modules[]{
      ${modules}
    }
  }`;

export async function getArtist(slug: string): Promise<ARTIST_QUERY_RESULT> {
  return sanityFetch({
    query: ARTIST_QUERY,
    tags: ["artist"],
    qParams: { slug },
  });
}

/*****************************************************************************************************
 * EXPHIBITION
 */
export const EXPHIBITION_QUERY = groq`*[_type == "exhibition" && slug.current == $slug][0]{
    ...,
    seo{
      ${seo}
    },
    imageCover{
      ${imageAsset}
    },
    artists[]->{
      name
    },
    modules[]{
      ${modules}
    }
  }`;

export async function getExhibition(
  slug: string,
): Promise<EXPHIBITION_QUERY_RESULT> {
  return sanityFetch({
    query: EXPHIBITION_QUERY,
    tags: ["exhibition"],
    qParams: { slug },
  });
}

/*****************************************************************************************************
 * PROGRAMME
 */
export const PROGRAMME_QUERY = groq`*[_type == "programme" && slug.current == $slug][0]{
    ...,
    seo{
      ${seo}
    },
    items,
    "resolvedItems": select(
      items == "exhibitions-past" => *[_type == "exhibition" && count(tags[_ref in *[_type == "tag" && slug.current == "exposition-passee"]._id]) > 0] | order(dates[0].du asc) {
        ${cardRefExhibition}
      },
      items == "exhibitions-current" => *[_type == "exhibition" && count(tags[_ref in *[_type == "tag" && slug.current == "exposition-en-cours"]._id]) > 0] | order(dates[0].du asc) {
        ${cardRefExhibition}
      },
      items == "exhibitions-futur" => *[_type == "exhibition" && count(tags[_ref in *[_type == "tag" && slug.current == "exposition-a-venir"]._id]) > 0] | order(dates[0].du asc) {
        ${cardRefExhibition}
      },
      items == "exhibitions-out-of-the-box" => *[_type == "exhibition" && count(tags[_ref in *[_type == "tag" && slug.current == "hors-les-murs"]._id]) > 0] | order(dates[0].du asc) {
        ${cardRefExhibition}
      },
      items == "events" => *[_type == "event"] | order(coalesce(dates[0].du, _createdAt) asc) {
        ${cardRefEvent}
      },
      items == "guided-tours" => *[_type == "event" && count(tags[_ref in *[_type == "tag" && slug.current == "visite-commentee"]._id]) > 0] | order(coalesce(dates[0].du, _createdAt) asc) {
        ${cardRefEvent}
      },
      []
    )
  }`;

export async function getProgramme(
  slug: string,
): Promise<PROGRAMME_QUERY_RESULT> {
  return sanityFetch({
    query: PROGRAMME_QUERY,
    tags: ["programme"],
    qParams: { slug },
  });
}

/*****************************************************************************************************
 * ALL PAGES (for sitemap)
 */
export const ALLPAGE_MODULAIRE_QUERY = groq`*[_type == "pageModulaire"]{
  ...,
  seo{
    ${seo}
  },
}`;

export async function getAllPagesModulaire(): Promise<any[]> {
  return sanityFetch({
    query: ALLPAGE_MODULAIRE_QUERY,
    tags: ["pageModulaire"],
  });
}

/*****************************************************************************************************
 * IMAGE_IMAGES_QUERY
 */
export const IMAGE_IMAGES_QUERY = groq`*[_type == "imageImages" && slug.current == $slug][0]{
  ...,
  seo{
    ${seo}
  },
  modules[]{
    ${modules}
  },
  rebonds[]->{
    ${cardRefImageImages}
  },
}`;

export async function getImageImages(
  slug: string,
): Promise<IMAGE_IMAGES_QUERY_RESULT> {
  return sanityFetch({
    query: IMAGE_IMAGES_QUERY,
    tags: ["imageImages"],
    qParams: { slug },
  });
}

/*****************************************************************************************************
 * FEUILLETAGE_QUERY
 */
export const FEUILLETAGE_QUERY = groq`*[_type == "feuilletage" && slug.current == $slug][0]{
  ...,
  seo{
    ${seo}
  },
  modules[]{
    ${modules}
  },
  rebonds[]->{
    ${cardTypes}
  },
  "related": ${relatedByArtist}
}`;

export async function getFeuilletage(
  slug: string,
): Promise<FEUILLETAGE_QUERY_RESULT> {
  return sanityFetch({
    query: FEUILLETAGE_QUERY,
    tags: ["feuilletage"],
    qParams: { slug },
  });
}

/*****************************************************************************************************
 * ARTICLE_QUERY
 */
export const ARTICLE_QUERY = groq`*[_type == "article" && slug.current == $slug][0]{
  ...,
  seo{
    ${seo}
  },
  modules[]{
    ${modules}
  },
  "related": ${relatedByTag}
}`;

export async function getArticle(slug: string): Promise<Article> {
  return sanityFetch({
    query: ARTICLE_QUERY,
    tags: ["article"],
    qParams: { slug },
  });
}
