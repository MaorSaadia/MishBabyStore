import { notFound } from "next/navigation";
import { Tag, Heart, Truck, ArrowRight } from "lucide-react";

import { wixClientServer } from "@/lib/wixClientServer";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Images */}
            <div className="md:w-1/2">
              <div className="sticky top-0 p-6">
                <ProductImages items={product.media?.items} />
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-8 -mt-8 md:mt-1">
              {/* <div className="flex items-center mb-4">
                <Tag className="w-5 h-5 mr-2 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-600">
                  New Arrival
                </span>
              </div> */}
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-gray-500">{product.description}</p>

              {/* Price */}
              <div className="mt-8 flex items-center">
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
                  <span className="text-sm text-gray-500">
                    Free shipping on orders over $100
                  </span>
                </div>
                <div className="mt-2 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Satisfaction guaranteed
                  </span>
                </div>
              </div>

              {/* Additional Info Sections */}
              <div className="mt-10">
                {product.additionalInfoSections?.map((section: any) => (
                  <details
                    key={section.title}
                    className="mt-4 border-t border-gray-200 pt-4"
                  >
                    <summary className="font-medium text-gray-900 cursor-pointer flex items-center">
                      {section.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </summary>
                    <p className="mt-2 text-sm text-gray-500">
                      {section.description}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
