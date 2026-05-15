import type { MetadataRoute } from "next";
import website from "./config/website";
import { getAllPagesModulaire } from "./sanity-api/sanity-queries";
import { _linkResolver } from "./sanity-api/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getAllPagesModulaire();
  return [
    {
      url: website.url,
      lastModified: new Date(),
    },
    ...items.map((item: any) => ({
      url: `${website.url}${_linkResolver(item)}`,
      lastModified: item._updatedAt,
    })),
  ];
}
