import type { MetadataRoute } from "next";
import website from "./config/website";
import {
  getAllContentForSitemap,
  getAllPagesModulaire,
} from "./sanity-api/sanity-queries";
import { _linkResolver } from "./sanity-api/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, content] = await Promise.all([
    getAllPagesModulaire(),
    getAllContentForSitemap(),
  ]);

  return [
    {
      url: website.url,
      lastModified: new Date(),
    },
    ...pages
      .filter((item: any) => !item.homePage)
      .map((item: any) => ({
        url: `${website.url}${_linkResolver(item)}`,
        lastModified: item._updatedAt,
      })),
    ...content.map((item: any) => ({
      url: `${website.url}${_linkResolver(item)}`,
      lastModified: item._updatedAt,
    })),
  ];
}
