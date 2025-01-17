import { MetadataRoute } from "next";
import { wixClientServer } from "@/lib/wixClientServer";

async function getWixProducts() {
  try {
    const wixClient = await wixClientServer();
    // Fetch all products with pagination
    const { items } = await wixClient.products
      .queryProducts()
      .limit(150)
      .find();

    return items || [];
  } catch (error) {
    console.error("Error fetching Wix products for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
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
  ];

  // Get all Wix products
  const wixProducts = await getWixProducts();

  // Generate product routes
  const productRoutes: MetadataRoute.Sitemap = wixProducts.map(
    (product: any) => ({
      url: `https://www.mishbaby.com/${product.slug}`,
      lastModified: new Date(
        product.updatedDate || product._updatedDate || new Date()
      ),
      changeFrequency: "daily",
      priority: 0.6,
    })
  );

  // Combine static and product routes
  return [...staticRoutes, ...productRoutes];
}
