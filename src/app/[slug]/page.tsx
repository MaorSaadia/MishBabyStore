import { notFound } from "next/navigation";
import { Tag, Heart, Truck, Clock, Package } from "lucide-react";
import { Metadata } from "next";
import { cache } from "react"; // <--- IMPORT 'cache' FROM REACT
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";

import { wixClientServer } from "@/lib/wixClientServer";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import ShareButton from "@/components/ShareButton";
import Add from "@/components/Add";
import PolicyDetails from "@/components/PolicyDetails";
import SizeGuide from "@/components/SizeGuide";
import ProductPrice from "@/components/ProductPrice";
import ReviewsClickable from "@/components/reviews/ReviewsClickable";
import Skeleton from "@/components/Skeleton";
import Loader from "@/components/Loader";

// CLIENT-SIDE ONLY (to save CPU)
import dynamicImport from "next/dynamic";
const Reviews = dynamicImport(() => import("@/components/reviews/Reviews"), {
  ssr: false,
  loading: () => <Loader color="text-yellow-400" />,
});
const ProductList = dynamicImport(() => import("@/components/ProductList"), {
  ssr: false,
  loading: () => <Skeleton />,
});

const SPECIAL_DISCOUNT_COLLECTION_ID = "4453646d-6f62-1925-d9cc-a6297010b276";

// Static generation config
export const dynamic = "force-static";
export const revalidate = 86400;

// ===================================================================
// OPTIMIZATION 1: Pre-build static pages for each product slug
// ===================================================================
export async function generateStaticParams() {
  try {
    const wixClient = await wixClientServer();
    // Fetch all products to get their slugs.
    // NOTE: You may need to handle pagination here if you have more than 100 products.
    const response = await wixClient.products.queryProducts().limit(100).find();

    return response.items.map((product) => ({
      slug: product.slug!,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

// ===================================================================
// OPTIMIZATION 2: Wrap data fetching in React.cache to avoid duplicates
// ===================================================================
const getProduct = cache(async (slug: string) => {
  try {
    const wixClient = await wixClientServer();
    const products = await wixClient.products
      .queryProducts()
      .eq("slug", slug)
      .find();

    const product = products.items[0];
    if (!product) notFound();
    return product;
  } catch (error: any) {
    console.error("❌ Failed to fetch product:", error.message);
    notFound();
  }
});

// --- Metadata (Now uses the cached getProduct function) ---
export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  try {
    const product = await getProduct(slug);
    const mainImage = product?.media?.mainMedia?.image;

    return {
      title: product?.name,
      description: "Get this product on MishBaby",
      openGraph: {
        images: mainImage?.url
          ? [
              {
                url: mainImage.url,
                width: mainImage.width,
                height: mainImage.height,
                alt: mainImage.altText || "",
              },
            ]
          : undefined,
      },
    };
  } catch {
    return {
      title: "Product Not Available",
      description: "This product is currently unavailable",
    };
  }
}

interface PageProps {
  params: { slug: string };
}

// --- Page Component (Now uses the cached getProduct function) ---
const SinglePage = async ({ params }: PageProps) => {
  const product = await getProduct(params.slug);

  if (!product) return notFound();

  const isEligibleForSpecialDiscount =
    product.collectionIds?.includes(SPECIAL_DISCOUNT_COLLECTION_ID) ||
    product.ribbon === "Bundle";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* --- Product Images --- */}
            <div className="md:w-1/2">
              <div className="sticky top-0 p-6">
                {
                  // @ts-ignore
                  <ProductImages items={product.media?.items} />
                }
              </div>
            </div>

            {/* --- Product Details --- */}
            <div className="md:w-1/2 p-8 -mt-10 md:mt-1">
              {product.ribbon && (
                <div className="flex items-center mb-2 sm:mb-4">
                  <Tag
                    className={`w-5 h-5 mr-2 ${
                      product.ribbon === "New Arrival"
                        ? "text-sky-600"
                        : "text-rose-600"
                    }`}
                  />
                  <span
                    className={`text-md font-medium ${
                      product.ribbon === "New Arrival"
                        ? "text-sky-600"
                        : "text-rose-600"
                    }`}
                  >
                    {product.ribbon}
                  </span>
                </div>
              )}

              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-4xl">
                {product.name}
              </h1>

              {/* Price + Share */}
              <div className="flex flex-row justify-between items-center">
                <ProductPrice
                  initialPrice={product.priceData?.price || undefined}
                  initialDiscountedPrice={product.priceData?.discountedPrice}
                />
                <div className="mt-1 sm:mt-4 flex items-center justify-between">
                  <ShareButton
                    url={`https://mishbaby.com/${params.slug}`}
                    title={product.name}
                    image={product.media?.items?.[0]?.image?.url}
                    price={product.priceData?.price}
                    discountedPrice={product.priceData?.discountedPrice}
                  />
                </div>
              </div>

              <ReviewsClickable
                productId={product._id!}
                productSlug={params.slug}
              />

              {/* Add to Cart / Customization */}
              <div className="mt-4">
                {product.variants && product.productOptions ? (
                  <CustomizeProducts
                    productId={product._id!}
                    variants={product.variants}
                    productOptions={product.productOptions.map((option) => ({
                      ...option,
                      choices: option.choices?.filter(
                        (choice) => choice.visible
                      ),
                    }))}
                    hasSpecialOffer={isEligibleForSpecialDiscount}
                  />
                ) : (
                  <Add
                    productId={product._id!}
                    variantId="00000000-0000-0000-0000-000000000000"
                    stockNumber={product.stock?.quantity || 0}
                    hasSpecialOffer={isEligibleForSpecialDiscount}
                  />
                )}
              </div>

              {/* Description */}
              {product.description ? (
                // NOTE: As discussed, you can remove DOMPurify if you fully trust the HTML from Wix.
                <p
                  className="mt-8 text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.description),
                  }}
                />
              ) : (
                <p className="mt-4 text-gray-500">No description available.</p>
              )}

              {/* Additional Features */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    <Link
                      href="/shipping-restrictions"
                      className="text-cyan-600 hover:underline"
                    >
                      Free Shipping
                    </Link>{" "}
                    for eligible countries.
                  </span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Satisfaction Guaranteed.
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Delivery Within 7-16 Business Days.
                  </span>
                </div>
                <div className="flex items-center">
                  <Package className="w-7 h-7 sm:w-5 sm:h-5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Order Tracking Number Provided Upon Shipment.
                  </span>
                </div>
              </div>

              {/* Size Guide */}
              {product.collectionIds?.[0] && (
                <SizeGuide collectionId={product.collectionIds[0]} />
              )}

              <PolicyDetails />

              {/* --- Reviews (client-side only) --- */}
              <div id="full-reviews">
                <hr className="mt-4" />
                <h1 className="mt-4 mb-4 text-2xl">Customer Reviews</h1>
                <Reviews productId={product._id!} productSlug={params.slug} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Recommendations (client-side only) --- */}
      <div className="mt-4 md:mt-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
          You May Also Like
        </h1>
        <ProductList
          pagination={false}
          categoryId={
            product.collectionIds?.[0] || "00000000-000000-000000-000000000001"
          }
          slug={product.slug}
        />
      </div>
    </div>
  );
};

export default SinglePage;
