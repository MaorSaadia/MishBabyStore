import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Tag, Heart, Truck, ArrowRight } from "lucide-react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

import { wixClientServer } from "@/lib/wixClientServer";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import ShareButton from "@/components/ShareButton";
import Skeleton from "@/components/Skeleton";
import ProductList from "@/components/ProductList";
import Add from "@/components/Add";

const SinglePage = async ({ params }: { params: { slug: string } }) => {
  const wixClient = await wixClientServer();
  const products = await wixClient.products
    .queryProducts()
    .eq("slug", params.slug)
    .find();

  if (!products.items[0]) {
    return notFound();
  }

  const product = products.items[0];

  return (
    <>
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
                {product.description ? (
                  <p
                    className="mt-4 text-gray-500"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(product.description),
                    }}
                  />
                ) : (
                  <p className="mt-4 text-gray-500">
                    No description available.
                  </p>
                )}
                {/* Price */}
                <div className="flex flex-row justify-between items-center">
                  <div className="mt-8 flex items-center ">
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
                  <div className="mt-8 flex items-center justify-between">
                    <ShareButton
                      url={`https://mish-baby-store.vercel.app/${params.slug}`}
                      title={product.name}
                      image={product.media?.items?.[0]?.image?.url}
                      price={product.priceData?.price}
                      discountedPrice={product.priceData?.discountedPrice}
                    />
                  </div>
                </div>

                {/* Customization or Add to Cart */}
                <div className="mt-8">
                  {product.variants && product.productOptions ? (
                    <CustomizeProducts
                      productId={product._id!}
                      variants={product.variants}
                      productOptions={product.productOptions}
                    />
                  ) : (
                    <Add
                      productId={product._id!}
                      variantId="00000000-0000-0000-0000-000000000000"
                      stockNumber={product.stock?.quantity || 0}
                    />
                  )}
                </div>

                {/* Additional Features */}
                <div className="mt-10">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-500">Free shipping</span>
                  </div>
                  <div className="mt-2 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Satisfaction guaranteed
                    </span>
                  </div>
                </div>

                {/* Conditional Size Details section */}
                {product.collectionIds?.[0] ===
                  "b36c1c8c-a1ac-4682-9e34-a630b932325c" && (
                  <details className="mt-4 border-t border-gray-200 pt-4">
                    <summary className="font-medium text-gray-900 cursor-pointer flex items-center">
                      SIZE DETAILS
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </summary>
                    <div className="mt-2">
                      <Image
                        src="/size-details.png"
                        alt="Size Details"
                        className="w-full"
                        width={800}
                        height={500}
                      />
                    </div>
                  </details>
                )}

                {/* Additional Info Sections */}
                <div className="">
                  {product.additionalInfoSections?.map((section) => (
                    <details
                      key={section.title}
                      className="mt-4 border-t border-gray-200 pt-4"
                    >
                      <summary className="font-medium text-gray-900 cursor-pointer flex items-center">
                        {section.title}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </summary>
                      {section.description ? (
                        <div
                          className="mt-2 text-sm text-gray-500"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(section.description),
                          }}
                        />
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">
                          No additional information available.
                        </p>
                      )}
                    </details>
                  ))}
                </div>
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
            categoryId={
              product.collectionIds?.[0] ||
              "00000000-000000-000000-000000000001"
            }
            slug={product.slug}
          />
        </Suspense>
      </div>
    </>
  );
};

export default SinglePage;
