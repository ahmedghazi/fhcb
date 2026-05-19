import { groq } from "next-sanity";
import { sanityFetch } from "./sanity.client";
import {
  image,
  imageAsset,
  cardRefExhibition,
  linkInternal,
  linkInternalWithImage,
  modules,
  seo,
  cardRefEvent,
} from "./fragments";

/*****************************************************************************************************
 * SETTINGS
 */
export const SETTINGS_QUERY = groq`*[_type == "settings"][0]{
  ...,
  navPrimary[]{
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
  navSocial[]{
    ...
  },
  navSecondary[]{
    ...,
    _type == 'linkInternal' => {
      ${linkInternal}
    },
  },
  siteDescription{
    ...
  },
  baseline{
    ...
  },
}`;

export async function getSettings(): Promise<any> {
  return sanityFetch({
    query: SETTINGS_QUERY,
    tags: ["settings"],
  });
}

/*****************************************************************************************************
 * Home
 */
export const HOME_QUERY = groq`*[_type == "pageModulaire" && homePage == true][0]{
  ...,
  seo{
    ${seo}
  },
  modules[]{
    ${modules}
  }
}`;

export async function getHome(): Promise<any> {
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

export async function getPageModulaire(slug: string): Promise<any> {
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

export async function getArtist(slug: string): Promise<any> {
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

export async function getExhibition(slug: string): Promise<any> {
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
      items == "exhibitions-current" => *[_type == "exhibition" && defined(dates[0]) && dateTime(dates[0].du) <= dateTime(now()) && dateTime(dates[-1].au) >= dateTime(now())] | order(dates[0].du asc) {
        ${cardRefExhibition}
      },
      items == "exhibitions-futur" => *[_type == "exhibition" && defined(dates[0]) && dateTime(dates[0].du) > dateTime(now())] | order(dates[0].du asc) {
        ${cardRefExhibition}
      },
      items == "exhibitions-out-of-the-box" => *[_type == "exhibition" && defined(dates) && dateTime(dates[-1].au) < dateTime(now())] | order(dates[-1].au desc) {
        ${cardRefExhibition}
      },
      items == "events" => *[_type == "event"] | order(coalesce(dates[0].du, _createdAt) asc) {
        ${cardRefEvent}
      },
      items == "guided-tours" => *[_type == "event"] | order(coalesce(dates[0].du, _createdAt) asc) {
        ${cardRefEvent}
      },
      []
    )
  }`;

export async function getProgramme(slug: string): Promise<any> {
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
