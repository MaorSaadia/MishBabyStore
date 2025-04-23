import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import BestSellers from "./BestSellers";

interface BestSellersContainerProps {
  limit?: number;
}

const BestSellersContainer = async ({
  limit = 10,
}: BestSellersContainerProps) => {
  const wixClient = await wixClientServer();

  // Fetch the best-sellers collection
  const collections = await wixClient.collections.queryCollections().find();
  const bestSellersCollection = collections.items.find(
    (item) => item.slug === "best-sellers"
  );

  // Get the collection ID or use a fallback
  const bestSellersId =
    bestSellersCollection?._id || "00000000-000000-000000-000000000001";

  // Fetch products from the best-sellers collection
  const productQuery = wixClient.products
    .queryProducts()
    .eq("collectionIds", bestSellersId)
    .limit(limit)
    .ascending("lastUpdated");

  const productsResult = await productQuery.find();

  // Convert Wix products to our expected format
  const bestSellersProducts = productsResult.items.map(
    (product: products.Product) => ({
      id: product._id,
      name: product.name || "Product",
      price: product.priceData?.price || 0,
      discountPrice:
        product.priceData?.discountedPrice !== product.priceData?.price
          ? product.priceData?.discountedPrice
          : undefined,
      image:
        product.media?.mainMedia?.image?.url ||
        product.media?.items?.[1]?.image?.url ||
        "/product.png",
      slug: product.slug || "",
    })
  );

  return <BestSellers products={bestSellersProducts} limit={limit} />;
};

export default BestSellersContainer;
