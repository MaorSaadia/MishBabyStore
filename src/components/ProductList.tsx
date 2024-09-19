import Image from "next/image";
import Link from "next/link";
import { products } from "@wix/stores";

import { wixClientServer } from "@/lib/wixClientServer";
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 12;

interface ProductListProps {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}

const ProductList: React.FC<ProductListProps> = async ({
  categoryId,
  limit,
  searchParams,
}) => {
  const wixClient = await wixClientServer();
  let productQuery = wixClient.products
    .queryProducts()
    .startsWith("name", searchParams?.name || "")
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
  }

  if (searchParams?.filter) {
    // @ts-ignore
    productQuery = productQuery.eq("ribbon", searchParams.filter);
  }

  let res = await productQuery.find();

  return (
    <div className="flex flex-col">
      <div className="flex-grow mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {res.items.map((product: products.Product) => (
          <Link
            href={"/" + product.slug}
            className="group flex flex-col h-70 md:h-80"
            key={product._id}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl flex flex-col">
              <div className="relative w-full h-40 md:h-60 overflow-hidden">
                <Image
                  src={product.media?.mainMedia?.image?.url || "/product.png"}
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
                      {/* <span className="text-xs font-medium text-green-500 bg-green-100 px-2 py-1 rounded-full">
                        {Math.round(
                          (1 -
                            Number(product.priceData?.discountedPrice) /
                              Number(product.priceData?.price)) *
                            100
                        )}
                        % OFF
                      </span> */}
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      ${product.priceData?.price}
                    </span>
                  )}
                </div>
                {/* <button className="mt-2 rounded-full bg-cyan-500 text-white w-full py-2 px-4 text-sm transition-all duration-300 ease-in-out hover:bg-cyan-600">
                  Add to Cart
                </button> */}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!limit && (
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
