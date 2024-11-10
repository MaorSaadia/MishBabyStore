import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Tag, Heart, Truck, ArrowRight, Clock } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

import { wixClientServer } from "@/lib/wixClientServer";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import ShareButton from "@/components/ShareButton";
import Skeleton from "@/components/Skeleton";
import ProductList from "@/components/ProductList";
import Add from "@/components/Add";
import PolicyDetails from "@/components/PolicyDetails";
import SizeGuide from "@/components/SizeGuide";
// import Reviews from "@/components/reviews/Reviews";
// import ReviewsClickable from "@/components/reviews/ReviewsClickable";
// import Loader from "@/components/Loader";

interface PageProps {
  params: { slug: string };
}

// Helper function to fetch product data with retry logic
async function getProduct(slug: string, retryCount = 3) {
  for (let i = 0; i < retryCount; i++) {
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
      // If we've tried the maximum number of times, throw the error
      if (i === retryCount - 1) {
        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      // Wait for a short time before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}

// Error boundary component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 mb-4">
        We&apos;re having trouble loading this product. Please try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
  } catch (error) {
    return {
      title: "Product Not Available",
      description: "This product is currently unavailable",
    };
  }
}

const SinglePage = async ({ params }: { params: { slug: string } }) => {
  let product;
  try {
    product = await getProduct(params.slug);
  } catch (error) {
    return <ErrorFallback error={error as Error} />;
  }

  if (!product) {
    return notFound();
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="md:flex">
              {/* Product Images */}
              <div className="md:w-1/2">
                <div className="sticky top-0 p-6">
                  {
                    // @ts-ignore
                    <ProductImages items={product.media?.items} />
                  }
                </div>
              </div>

              {/* Product Details */}
              <div className="md:w-1/2 p-8 -mt-8 md:mt-1">
                {product.ribbon && (
                  <div className="flex items-center mb-4">
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
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex flex-row justify-between items-center">
                  <div className="mt-4 flex items-center ">
                    {product.priceData?.price ===
                    product.priceData?.discountedPrice ? (
                      <span className="text-3xl font-bold text-gray-900">
                        ${product.priceData?.price}
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-gray-900">
                          ${product.priceData?.discountedPrice}
                        </span>
                        <span className="ml-2 text-lg font-medium text-gray-500 line-through">
                          ${product.priceData?.price}
                        </span>
                        <span className="ml-2 text-sm font-medium text-rose-500">
                          {Math.round(
                            (1 -
                              Number(product.priceData?.discountedPrice) /
                                Number(product.priceData?.price)) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <ShareButton
                      url={`https://mishbaby.com/${params.slug}`}
                      title={product.name}
                      image={product.media?.items?.[0]?.image?.url}
                      price={product.priceData?.price}
                      discountedPrice={product.priceData?.discountedPrice}
                    />
                  </div>
                </div>

                {/* <ReviewsClickable productId={product._id!} /> */}

                {/* Customization or Add to Cart */}
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
                    />
                  ) : (
                    <Add
                      productId={product._id!}
                      variantId="00000000-0000-0000-0000-000000000000"
                      stockNumber={product.stock?.quantity || 0}
                    />
                  )}
                </div>

                {product.description ? (
                  <p
                    className="mt-8 text-gray-500"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(product.description),
                    }}
                  />
                ) : (
                  <p className="mt-4 text-gray-500">
                    No description available.
                  </p>
                )}

                {/* Additional Features */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Free Worldwide Shipping.
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
                      Delivery Within 7-21 Business Days.
                    </span>
                  </div>
                </div>

                {/* Size Guide */}
                {product.collectionIds?.[0] && (
                  <SizeGuide collectionId={product.collectionIds[0]} />
                )}

                {/* Additional Info Sections */}
                <PolicyDetails />
                {/* REVIEWS */}
                {/* <div id="full-reviews">
                  <hr className="mt-4" />
                  <h1 className="mt-4 mb-4 text-2xl">User Reviews</h1>
                  <Suspense fallback={<Loader color="text-yellow-400" />}>
                    <Reviews productId={product._id!} />
                  </Suspense>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
          Related Items
        </h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList
            pagination={false}
            categoryId={
              product.collectionIds?.[0] ||
              "00000000-000000-000000-000000000001"
            }
            slug={product.slug}
          />
        </Suspense>
      </div>
    </Suspense>
  );
};

export default SinglePage;
