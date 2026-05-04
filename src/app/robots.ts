import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"], // no need for Google to crawl your API routes
      },
    ],
    sitemap: "https://shanjid.bd/sitemap.xml",
  };
}
