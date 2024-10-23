import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Tag, Heart, Truck, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

import { wixClientServer } from "@/lib/wixClientServer";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import ShareButton from "@/components/ShareButton";
import Skeleton from "@/components/Skeleton";
import ProductList from "@/components/ProductList";
import Add from "@/components/Add";
import Reviews from "@/components/reviews/Reviews";
import ReviewsClickable from "@/components/reviews/ReviewsClickable";
import Loader from "@/components/Loader";

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

  // console.log(product);

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
                      url={`https://mish-baby-store.vercel.app/${params.slug}`}
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
                {/* Conditional Size Details section */}
                {product.collectionIds?.[0] ===
                  "b36c1c8c-a1ac-4682-9e34-a630b932325c" && (
                  <details className="mt-4 border-t border-gray-200 pt-4">
                    <summary className="font-medium text-gray-900 cursor-pointer flex items-center">
                      SIZE Guide
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </summary>
                    <div className="mt-2 space-y-4">
                      <Image
                        src="/size-details.png"
                        alt="Size Details"
                        className="w-full"
                        width={800}
                        height={500}
                      />
                      <Image
                        src="/kid-size.png"
                        alt="Kid Size"
                        className="w-full"
                        width={800}
                        height={500}
                      />
                      <Image
                        src="/size-3.png"
                        alt="Kid Information"
                        className="w-full"
                        width={800}
                        height={500}
                      />
                    </div>
                  </details>
                )}

                {/* Additional Info Sections */}
                <div className="">
                  <details className="mt-6 border-t border-gray-200 pt-4">
                    <summary className="font-medium text-gray-900 cursor-pointer flex items-center">
                      SHIPPING INFO
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </summary>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>
                        <span className="font-bold">1. Shipping Process</span>
                      </p>
                      <p>
                        Once your order is placed, our fulfillment team
                        processes it promptly, and the product is shipped
                        directly to your address. We work closely with trusted
                        suppliers to ensure both timely delivery and
                        high-quality products.
                      </p>
                      <p className="mt-4">
                        <span className="font-bold">
                          2. International Shipping and Timeframes
                        </span>
                      </p>
                      <p>
                        We offer shipping to most countries worldwide. Delivery
                        times typically range from 7-21 business days, depending
                        on your location and product availability.
                      </p>
                    </div>
                  </details>
                </div>
                <div className="">
                  <details className="mt-4 border-t border-gray-200 pt-4">
                    <summary className="font-medium text-gray-900 cursor-pointer flex items-center">
                      RETURN & REFUND POLICY
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </summary>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>
                        <span className="font-bold">
                          1. Returns & Exchanges
                        </span>
                      </p>
                      <p>
                        We want you to be completely satisfied with your
                        purchase. If you receive a damaged or incorrect item,
                        you may return or exchange it. Please contact our
                        customer support team within 14 days of receiving the
                        product to initiate the process. In certain cases, we
                        may allow you to keep the item and provide a 50% refund
                        or store credit for the full amount of your order. We’ll
                        guide you through every step to ensure a smooth
                        experience.
                      </p>

                      <p className="mt-4">
                        <span className="font-bold">
                          2. Damaged or Lost Items
                        </span>
                      </p>
                      <p>
                        <span className="font-bold">Damaged Items:</span> If
                        your item arrives damaged or becomes defective within 30
                        days of delivery, we will offer a full refund or send a
                        free replacement.
                      </p>
                      <p>
                        <span className="font-bold">Lost Items:</span> If your
                        order is lost in transit and cannot be recovered within
                        30 days of placing the order, we will either reship the
                        item or offer a full refund. Your satisfaction is our
                        priority, and we will work diligently to resolve any
                        issues.
                      </p>

                      <p className="mt-4">
                        <span className="font-bold">
                          3. Refund Processing Time
                        </span>
                      </p>
                      <p>
                        Once we receive your returned item, refunds are
                        typically processed within 5-7 business days. If there
                        are any issues or delays, feel free to contact our
                        support team to confirm that the refund has been
                        initiated. If everything is correct on our end, we
                        recommend checking with your bank for further updates.
                      </p>
                    </div>
                  </details>

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
