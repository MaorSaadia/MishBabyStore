import { MetadataRoute } from "next";
import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";

// Use the actual Product type from Wix if available
type Product = products.Product;

// Define a type for our internal use that works with both types
interface SitemapProduct {
  _id?: string;
  slug?: string; // Make slug optional to handle both types
  updatedDate?: string;
  _updatedDate?: string;
  [key: string]: any;
}

function escapeXmlUrl(url: string) {
  return url.replace(/&/g, "&amp;");
}

async function getWixProducts(): Promise<SitemapProduct[]> {
  try {
    const wixClient = await wixClientServer();
    let allProducts: SitemapProduct[] = [];
    let hasMore = true;
    let currentPage = 1;
    const pageSize = 100;

    // Fetch all products with pagination
    while (hasMore) {
      const response = await wixClient.products
        .queryProducts()
        .limit(pageSize)
        .skip((currentPage - 1) * pageSize)
        .find();

      const items = response.items || [];
      const totalPages = response.totalPages || 1;

      if (items.length > 0) {
        // Safely add items to our collection
        allProducts = [...allProducts, ...items];
      }

      hasMore = currentPage < totalPages;
      currentPage++;
    }

    return allProducts;
  } catch (error) {
    console.error("Error fetching Wix products for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes

  const baseUrl = "https://www.mishbaby.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // {
    //   url: `${baseUrl}/blog`, // Added from your blog sitemap
    //   lastModified: new Date(),
    //   changeFrequency: "daily",
    //   priority: 0.8,
    // },
    {
      url: `${baseUrl}/list?cat=all-products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bundle-deals`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: escapeXmlUrl(`${baseUrl}/list?cat=all-products&filter=Sale`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/list?cat=baby-cares`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/list?cat=bath-care`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/list?cat=baby-clothing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/list?cat=feeding-mealtime`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/list?cat=nursery-decor`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/list?cat=safety-comfort`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/list?cat=toys-games`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/list?cat=nursery-decor`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping-restrictions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Add any other static pages here
  ];

  // Get all Wix products
  const wixProducts = await getWixProducts();

  // Generate product routes
  const productRoutes: MetadataRoute.Sitemap = wixProducts
    .filter((product) => product.slug) // Only include products with a slug
    .map((product) => ({
      url: `https://www.mishbaby.com/${product.slug}`,
      lastModified: new Date(
        product.updatedDate || product._updatedDate || new Date()
      ),
      changeFrequency: "daily",
      priority: 0.6,
    }));

  // For debugging
  console.log(`Generated sitemap with ${productRoutes.length} product URLs`);

  // Combine static and product routes
  return [...staticRoutes, ...productRoutes];
}
