/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Package } from "lucide-react";

import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Pagination from "./Pagination";
import BundleProductCard from "./BundleProductCard";

const PRODUCT_PER_PAGE = 16;

interface ProductListProps {
  pagination?: boolean;
  categoryId: string;
  limit?: number;
  searchParams?: any;
  slug?: string;
  isBundleCategory?: boolean;
}

const ProductList: React.FC<ProductListProps> = async ({
  pagination = true,
  categoryId,
  limit,
  searchParams,
  slug,
  isBundleCategory = false,
}) => {
  const wixClient = await wixClientServer();
  let productQuery = wixClient.products
    .queryProducts()
    // @ts-ignore
    .contains("name", searchParams?.name || "")
    .eq("collectionIds", categoryId)
    .gt("priceData.price", searchParams?.min || 0)
    .lt("priceData.price", searchParams?.max || 999999)
    .limit(limit || PRODUCT_PER_PAGE)
    .skip(
      searchParams?.page
        ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
        : 0
    );

  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");
    if (sortType === "asc") {
      productQuery = productQuery.ascending(sortBy);
    } else if (sortType === "desc") {
      productQuery = productQuery.descending(sortBy);
    }
  } else {
    productQuery = productQuery.descending("lastUpdated");
  }

  if (searchParams?.filter) {
    // @ts-ignore
    productQuery = productQuery.eq("ribbon", searchParams.filter);
  }

  let res = await productQuery.find();

  const filteredItems = slug
    ? res.items.filter((product: { slug: string }) => product.slug !== slug)
    : res.items;

  if (res.items.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No products found
        </h2>
        <p className="text-gray-500 text-center max-w-md px-6 mb-6">
          {searchParams?.name
            ? `We couldn't find any products matching "${searchParams.name}".`
            : "We couldn't find any products matching your search criteria."}
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        {filteredItems.map((product: products.Product) =>
          isBundleCategory ? (
            <BundleProductCard key={product._id} product={product} />
          ) : (
            <Link href={"/" + product.slug} className="group" key={product._id}>
              <div className="h-full bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 flex flex-col">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                  <img
                    src={
                      product.media?.mainMedia?.image?.url ||
                      product.media?.items?.[1]?.image?.url ||
                      "/product.png"
                    }
                    alt={product.name || "Product image"}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />

                  {/* Enhanced badges with better positioning */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {product.priceData?.price !==
                      product.priceData?.discountedPrice && (
                      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-md">
                        SALE
                      </div>
                    )}
                    {product.ribbon === "New Arrival" && (
                      <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-md">
                        NEW
                      </div>
                    )}
                  </div>

                  {/* Hover overlay for better interaction feedback */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                </div>

                <div className="p-3 sm:p-4 flex flex-col gap-2 flex-grow">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 group-hover:text-gray-900 transition-colors leading-tight">
                    {product.name}
                  </h3>

                  <div className="mt-auto pt-1 flex items-center gap-2">
                    {product.priceData?.price !==
                    product.priceData?.discountedPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-rose-600">
                          ${product.priceData?.discountedPrice}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${product.priceData?.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ${product.priceData?.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        )}
      </div>

      {!limit && pagination && (
        <div className="mt-10 sm:mt-12">
          <Pagination
            currentPage={res.currentPage || 0}
            hasPrev={res.hasPrev()}
            hasNext={res.hasNext()}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
