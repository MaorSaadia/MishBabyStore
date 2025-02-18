import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/abandoned-cart-alert"],
    },
    sitemap: "https://www.mishbaby.com/sitemap.xml",
  };
}
