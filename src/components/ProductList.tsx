import Image from "next/image";
import Link from "next/link";

import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 12;

interface ProductListProps {
  pagination?: boolean;
  categoryId: string;
  limit?: number;
  searchParams?: any;
  slug?: string;
}

const ProductList: React.FC<ProductListProps> = async ({
  pagination = true,
  categoryId,
  limit,
  searchParams,
  slug,
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
      <div className="mt-6 flex flex-col items-center justify-center h-56 bg-slate-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No products found
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          {searchParams?.name
            ? `We couldn't find any products matching "${searchParams.name}".`
            : "We couldn't find any products matching your search criteria."}
        </p>
        <Link
          href="/"
          className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-grow mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredItems.map((product: products.Product) => (
          <Link
            href={"/" + product.slug}
            className="group flex flex-col h-70 md:h-80"
            key={product._id}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl flex flex-col">
              <div className="relative w-full h-40 md:h-60 overflow-hidden">
                <Image
                  src={
                    product.media?.mainMedia?.image?.url ||
                    product.media?.items?.[1]?.image?.url ||
                    "/product.png"
                  }
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                {product.priceData?.price !==
                  product.priceData?.discountedPrice && (
                  <div className="absolute top-0 left-0 bg-rose-500 text-white px-2 py-1 text-xs font-bold">
                    SALE
                  </div>
                )}
                {product.ribbon === "New Arrival" && (
                  <div className="absolute top-0 left-0 bg-sky-500 text-white px-2 py-1 text-xs font-bold">
                    NEW
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2 flex-grow">
                <h3 className="font-medium text-gray-800 truncate">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2 flex-wrap">
                  {product.priceData?.price !==
                  product.priceData?.discountedPrice ? (
                    <>
                      <span className="text-lg font-bold text-rose-600">
                        ${product.priceData?.discountedPrice}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.priceData?.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      ${product.priceData?.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!limit && pagination && (
        <div className="">
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
