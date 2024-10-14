import { Suspense } from "react";

import { wixClientServer } from "@/lib/wixClientServer";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Filter from "@/components/Filter";

const ListPage = async ({ searchParams }: { searchParams: any }) => {
  const wixClient = await wixClientServer();

  const cat = await wixClient.collections.getCollectionBySlug(
    searchParams.cat || "all-products"
  );

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* CATEGORY DESCRIPTION */}
      {cat.collection?.description && (
        <div className="my-8 p-8 bg-gradient-to-r from-sky-200 via-cyan-100 to-slate-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-4xl font-extrabold mb-6 text-slate-600 tracking-wide">
            {cat.collection.name}
          </h2>
          <p className="text-gray-600 text-lg leading-loose whitespace-pre-wrap">
            {cat.collection.description}
          </p>
        </div>
      )}
      {/* FILTER */}
      <Filter />
      {/* PRODUCTS */}
      <h1 className="mt-12 text-xl font-semibold">{cat?.collection?.name}</h1>
      <Suspense fallback={<Skeleton />}>
        <ProductList
          categoryId={
            cat.collection?._id || "00000000-000000-000000-000000000001"
          }
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
};

export default ListPage;
