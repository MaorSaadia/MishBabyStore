/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tag, Package } from "lucide-react";
import { media as wixMedia } from "@wix/sdk";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  price?: {
    price: number;
  };
  media?: {
    mainMedia?: {
      image?: {
        url: string;
      };
    };
  };
}

const SuggestedProducts = ({
  suggestedProducts,
}: {
  suggestedProducts: Product[];
}) => {
  const router = useRouter();

  if (!suggestedProducts || suggestedProducts.length === 0) {
    return null;
  }

  const handleProductClick = (productName: string) => {
    router.push(`/${productName.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="mt-8 -mb-8 ">
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-100 shadow-sm">
        {/* Header with bundle information */}
        <div className="mb-3">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Complete Your Bundle
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full font-medium">
              <Tag className="h-3 w-3 mr-1" />
              Buy 2: 10% OFF
            </span>
            <span className="inline-flex items-center bg-sky-100 text-sky-700 px-2 py-1 rounded-full font-medium">
              <Tag className="h-3 w-3 mr-1" />
              Buy 3+: 20% OFF
            </span>
          </div>
        </div>

        {/* Product Cards in horizontal scroll for mobile */}
        <div className="flex overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1 hide-scrollbar">
          {suggestedProducts.map((product) => (
            <div
              key={product._id}
              className="snap-center shrink-0 w-40 sm:w-48 mr-3 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow border border-gray-100 flex flex-col"
            >
              <div className="relative">
                {product.media?.mainMedia?.image && (
                  <img
                    src={wixMedia.getScaledToFillImageUrl(
                      product.media.mainMedia.image.url,
                      200,
                      150,
                      {}
                    )}
                    alt={product.name}
                    className="w-full h-24 object-cover cursor-pointer"
                    onClick={() => handleProductClick(product.name)}
                  />
                )}
                <div className="absolute top-1 left-1 bg-cyan-600 text-white px-1.5 py-0.5 rounded-full text-xs flex items-center">
                  <Package className="h-2.5 w-2.5 mr-0.5" />
                  <span className="text-[10px]">Bundle</span>
                </div>
              </div>

              <div className="p-2 flex-grow flex flex-col justify-between">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                  {product.name}
                </h3>

                <div className="mt-1 flex items-center justify-between">
                  <span className="text-cyan-600 font-bold text-sm">
                    ${(product.price?.price || 0).toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full mt-2 py-1 h-auto text-xs bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700 text-white"
                  onClick={() => handleProductClick(product.name)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 text-right">
          <Link
            href="/bundle-deals"
            className="text-cyan-600 hover:text-cyan-800 text-sm font-medium inline-flex items-center transition-colors duration-200"
          >
            See all bundles <span className="ml-1">→</span>
          </Link>
        </div>

        {/* Add CSS for hiding scrollbar but allowing scroll */}
        <style jsx global>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SuggestedProducts;
