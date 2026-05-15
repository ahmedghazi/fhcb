import type { MetadataRoute } from "next";
import website from "./config/website";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: `${website.url}/sitemap.xml`,
  };
}
