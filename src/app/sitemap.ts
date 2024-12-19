import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.mishbaby.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://www.mishbaby.com/list?cat=all-products",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://www.mishbaby.com/list?cat=baby-cares",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://www.mishbaby.com/list?cat=baby-clothing",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://www.mishbaby.com/list?cat=nursery-decor",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://www.mishbaby.com/list?cat=night-lights-room-lighting",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://www.mishbaby.com/list?cat=toys-games",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://www.mishbaby.com/list?cat=characters-collectibles",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Add other important pages
  ];
}
