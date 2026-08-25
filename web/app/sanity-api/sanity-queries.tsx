import { groq } from "next-sanity";
import { sanityFetch } from "./sanity.client";
import {
  imageAsset,
  modules,
  seo,
  nav,
  relatedByTag,
  sliderCardUI,
  gridCardUI,
  relatedByArtists,
  listProductUI,
  cta,
  relatedByExhibition,
  relatedByArtist,
  relatedProductsByArtist,
  relatedProductsByTag,
  relatedRessourcesByArtists,
  randomRessources,
  linkInternal,
  blockContent,
} from "./fragments";
import { rebondsResolver } from "./fragments-rebonds";
import { _shuffle } from "../lib/utils";
import {
  ARTICLE_QUERY_RESULT,
  ARTIST_QUERY_RESULT,
  EVENT_QUERY_RESULT,
  EXPHIBITION_QUERY_RESULT,
  FEUILLETAGE_QUERY_RESULT,
  HOME_QUERY_RESULT,
  IMAGE_IMAGES_QUERY_RESULT,
  LIBRARY_QUERY_RESULT,
  PAGE_MODULAIRE_QUERY_RESULT,
  PRODUCT_QUERY_RESULT,
  PROGRAMME_QUERY_RESULT,
  SERIE_THEMATIQUE_QUERY_RESULT,
  CONVERSATION_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
} from "./types/sanity.types";
import CardProduct from "../components/ui/cards/CardProduct";
import {
  cardRefArtist,
  cardRefImageImages,
  cardRefProduct,
  cardTypes,
} from "./fragments-cards";

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
  bandeauContextuel{
    ...,
    cta{
      ${cta}
    }
  },

  siteDescription{
    ...
  },
  baseline{
    ...
  },
  message404{
    ${blockContent}
  },
  messageCookies,
  urlLegals{
    ${linkInternal}
  },
  urlPrivacy{
    ${linkInternal}
  }
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
// rebonds[]->{
//   ${cardTypes}
// },
export const PAGE_MODULAIRE_QUERY = groq`*[_type == "pageModulaire" && slug.current == $slug][0]{
    ...,
    seo{
      ${seo}
    },
    tags[]->,
    modules[]{
      ${modules}
    },
    rebonds[]->{
      ${cardTypes}
    },
    rebondsAuto[]->{
      ${rebondsResolver}
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
// "relatedByArtist": ${relatedByArtist},

export const ARTIST_QUERY = groq`*[_type == "artist" && slug.current == $slug][0]{
    ...,
    seo{
      ${seo}
    },
    imageCover{
      ${imageAsset}
    },
    text,
    links,
    rebondsAuto[]->{
      ${rebondsResolver}
    }
  }`;

export async function getArtist(slug: string): Promise<ARTIST_QUERY_RESULT> {
  return sanityFetch({
    query: ARTIST_QUERY,
    tags: ["artist"],
    qParams: { slug },
  });
}

export const RANDOM_ARTISTS_QUERY = groq`*[_type == "artist" && !(_id in path("drafts.**")) && slug.current != $slug]{
  ${cardRefArtist}
}`;

export async function getRandomArtists(excludeSlug: string, count = 4) {
  const all = await sanityFetch({
    query: RANDOM_ARTISTS_QUERY,
    tags: ["artist"],
    qParams: { slug: excludeSlug },
  });
  if (!Array.isArray(all)) return [];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, count);
}

/*****************************************************************************************************
 * EXPHIBITION
 */
//"relatedByExhibition": ${relatedByExhibition},
//"related": ${relatedByTag},
export const EXPHIBITION_QUERY = groq`*[_type == "exhibition" && slug.current == $slug][0]{
    ...,
    seo{
      ${seo}
    },
    imageCover{
      ${imageAsset}
    },

    dates[]{
      ...,
      location->
    },
    artists[]->{
      ${cardRefArtist}
    },
    tags[]->{
      _id,
      title,
      slug
    },
    modules[]{
      ${modules}
    },
    aroundTheExhibition[]->{
      ${cardTypes}
    },

    rebondsAuto[]->{
      ${rebondsResolver}
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
 * EVENT
 */
// "related": ${relatedByArtists},
export const EVENT_QUERY = groq`*[_type == "event" && slug.current == $slug][0]{
    ...,
    seo{
      ${seo}
    },
    imageCover{
      ${imageAsset}
    },

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
    modules[]{
      ${modules}
    },

    rebondsAuto[]->{
      ${rebondsResolver}
    }
  }`;

export async function getEvent(slug: string): Promise<EVENT_QUERY_RESULT> {
  return sanityFetch({
    query: EVENT_QUERY,
    tags: ["event"],
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
    modules[]{
      ${modules}
    }
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
export const ALLPAGE_MODULAIRE_QUERY = groq`*[_type == "pageModulaire" && !(_id in path("drafts.**"))]{
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
  chercheur->{
    _id,
    name,
    slug
  },
  modules[]{
    ${modules}
  },
  rebonds[]->{
    ${cardRefImageImages}
  },
  "related": ${relatedRessourcesByArtists},
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
  chercheur->{
    _id,
    name,
    slug
  },
  modules[]{
    ${modules}
  },
  rebonds[]->{
    ${cardTypes}
  },
  "related": ${randomRessources},
  rebondsAuto[]->{
    ${rebondsResolver}
  }
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
 * SERIE_THEMATIQUE_QUERY
 */
export const SERIE_THEMATIQUE_QUERY = groq`*[_type == "serieThematique" && slug.current == $slug][0]{
  ...,
  seo{
    ${seo}
  },
  chercheur->{
    _id,
    name,
    slug
  },
  modules[]{
    ${modules}
  },
  rebonds[]->{
    ${cardTypes}
  },
  "related": ${relatedByArtists}
}`;

export async function getSerieThematique(
  slug: string,
): Promise<SERIE_THEMATIQUE_QUERY_RESULT> {
  return sanityFetch({
    query: SERIE_THEMATIQUE_QUERY,
    tags: ["serieThematique"],
    qParams: { slug },
  });
}

/*****************************************************************************************************
 * CONVERSATION_QUERY
 */
export const CONVERSATION_QUERY = groq`*[_type == "conversation" && slug.current == $slug][0]{
  ...,
  seo{
    ${seo}
  },
  text,
  chercheur->{
    _id,
    name,
    slug
  },
  modules[]{
    ${modules}
  },
  rebonds[]->{
    ${cardTypes}
  },
  "related": ${relatedByArtists}
}`;

export async function getConversation(
  slug: string,
): Promise<CONVERSATION_QUERY_RESULT> {
  return sanityFetch({
    query: CONVERSATION_QUERY,
    tags: ["conversation"],
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

export async function getArticle(slug: string): Promise<ARTICLE_QUERY_RESULT> {
  return sanityFetch({
    query: ARTICLE_QUERY,
    tags: ["article"],
    qParams: { slug },
  });
}

/*****************************************************************************************************
 * LIBRARY_QUERY
 */
export const LIBRARY_QUERY = groq`*[_type == "library"][0]{
  ...,
  seo{
    ${seo}
  },
  modules[]{
    ${sliderCardUI},
    ${gridCardUI},
    ${listProductUI}
  },
  // "items": *[_type == "product" ] | order(publicationDate asc) [0...20] {
  //   ${cardRefProduct}
  // }
}`;

export async function getLibrairie(): Promise<LIBRARY_QUERY_RESULT> {
  return sanityFetch({
    query: LIBRARY_QUERY,
    tags: ["library"],
  });
}

/*****************************************************************************************************
 * PRODUCT_QUERY
 */
export const PRODUCT_QUERY = groq`*[_type == "product" && slug.current == $slug][0]{
  ...,
  seo{
    ${seo}
  },
  artists[]->,
  tagsProduct[]->{ _id, title, slug, handle },

  imageCover{
    ${imageAsset}
  },
  images[]{
    ${imageAsset}
  },
  "relatedProductsByArtist": ${relatedProductsByArtist},
  "relatedProductsByTag": ${relatedProductsByTag},
  "related": ${relatedByArtists},
  rebondsAuto[]->{
    ${rebondsResolver}
  }
}`;

export async function getProduct(slug: string): Promise<PRODUCT_QUERY_RESULT> {
  return sanityFetch({
    query: PRODUCT_QUERY,
    tags: ["product"],
    qParams: { slug },
  });
}

// capped at 30 (not `count`) so there's an actual pool to shuffle — capping in GROQ before
// shuffling always returned the same [0...count] products in a merely-reordered pair/trio
export const RANDOM_PRODUCT_QUERY = groq`*[_type == "product" && !(_id in path("drafts.**")) && slug.current != $slug] | order(_createdAt desc) [0...30]{
  ${cardRefProduct}
}`;

export async function getRandomProductss(excludeSlug: string, count = 4) {
  const all = await sanityFetch({
    query: RANDOM_PRODUCT_QUERY,
    tags: ["product"],
    qParams: { slug: excludeSlug },
  });
  if (!Array.isArray(all)) return [];
  return _shuffle(all).slice(0, count);
}

/*
// "related":*[
  //   _id != ^._id &&
  //   (
  //     (
  //       _type == product &&
  //       references(^.artists[]._ref)
  //     )
  //     ||
  //     (
  //       _type == "artist" &&
  //       _id in ^.artists[]._ref
  //     )
  //   )
  // ] | order(publicationDate asc) {
  //   ${cardRefProduct}
  // }
*/
