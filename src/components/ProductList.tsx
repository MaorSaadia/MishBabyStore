/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
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
      <div className="mt-6 flex flex-col items-center justify-center h-56 bg-gray-50 rounded-lg border border-gray-100">
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          No products found
        </h2>
        <p className="text-gray-500 text-center max-w-md px-4">
          {searchParams?.name
            ? `We couldn't find any products matching "${searchParams.name}".`
            : "We couldn't find any products matching your search criteria."}
        </p>
        <Link
          href="/"
          className="mt-4 px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filteredItems.map((product: products.Product) =>
          isBundleCategory ? (
            <BundleProductCard key={product._id} product={product} />
          ) : (
            <Link href={"/" + product.slug} className="group" key={product._id}>
              <div className="h-full bg-white rounded-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md flex flex-col">
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
                  <div className="absolute top-0 left-0 flex flex-col gap-1 p-2">
                    {product.priceData?.price !==
                      product.priceData?.discountedPrice && (
                      <div className="bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded">
                        SALE
                      </div>
                    )}
                    {product.ribbon === "New Arrival" && (
                      <div className="bg-sky-500 text-white text-xs font-medium px-2 py-1 rounded">
                        NEW
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-1 flex-grow">
                  <h3 className="font-medium text-gray-800 text-sm line-clamp-2 group-hover:text-gray-900 transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-auto pt-2 flex items-center gap-2">
                    {product.priceData?.price !==
                    product.priceData?.discountedPrice ? (
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
          )
        )}
      </div>
      {!limit && pagination && (
        <div className="mt-8">
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
