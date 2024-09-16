import React from "react";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import { wixClientServer } from "@/lib/wixClientServer";
import DOMPurify from "isomorphic-dompurify";

const PRODUCT_PER_PAGE = 8;

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

  const productQuery = wixClient.products
    .queryProducts()
    .startsWith("name", searchParams?.name || "")
    .eq("collectionIds", categoryId)
    .hasSome(
      "productType",
      searchParams?.type ? [searchParams.type] : ["physical", "digital"]
    )
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
      productQuery.ascending(sortBy);
    }
    if (sortType === "desc") {
      productQuery.descending(sortBy);
    }
  }

  const res = await productQuery.find();

  return (
    <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
      {res.items.map((product: products.Product) => (
        <Link
          href={"/" + product.slug}
          className="group flex flex-col"
          key={product._id}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
            <div className="relative w-full h-60 overflow-hidden">
              <Image
                src={product.media?.mainMedia?.image?.url || "/product.png"}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-800 truncate">
                  {product.name}
                </h3>
                <span className="font-semibold">
                  ${product.priceData?.price}
                </span>
              </div>
              {product.additionalInfoSections && (
                <div
                  className="text-sm text-gray-500 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      product.additionalInfoSections.find(
                        (section: any) => section.title === "shortDesc"
                      )?.description || "description"
                    ),
                  }}
                ></div>
              )}
              <button className="mt-2 rounded-full ring-1 ring-cyan-500 text-cyan-500 w-full py-2 px-4 text-sm transition-all duration-300 ease-in-out hover:bg-cyan-600 hover:text-white">
                Add to Cart
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
