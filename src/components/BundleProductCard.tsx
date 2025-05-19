/* eslint-disable @next/next/no-img-element */
import { Package } from "lucide-react";
import Link from "next/link";
import { products } from "@wix/stores";

/**
 * Enhancement for ProductList to display bundle badges
 * This component wraps around the products in your ProductList component
 */
const BundleProductCard = ({ product }: { product: products.Product }) => {
  return (
    <Link href={"/" + product.slug} className="group" key={product._id}>
      <div className="h-full relative bg-white rounded-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md flex flex-col">
        {/* Bundle Badge */}
        <div className="absolute sm:top-0 right-0 z-10 m-2">
          <div className="bg-cyan-500 text-white text-xs font-medium px-2 py-1 rounded flex items-center">
            <Package size={12} className="mr-1" />
            <span>BUNDLE DEAL</span>
          </div>
        </div>

        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          <img
            src={
              product.media?.mainMedia?.image?.url ||
              product.media?.items?.[1]?.image?.url ||
              "/product.png"
            }
            alt={product.name || "Product image"}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />

          {/* Bundle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <div className="text-white text-xs font-medium">
              <div className="mb-1">Buy 2: 10% OFF</div>
              <div>Buy 3+: 20% OFF</div>
            </div>
          </div>
        </div>

        <div className="p-3 flex flex-col gap-1 flex-grow">
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2 group-hover:text-gray-900 transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto pt-2 flex items-center gap-2">
            {product.priceData?.price !== product.priceData?.discountedPrice ? (
              <>
                <span className="text-base font-semibold text-rose-600">
                  ${product.priceData?.discountedPrice}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ${product.priceData?.price}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold text-gray-900">
                ${product.priceData?.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BundleProductCard;
