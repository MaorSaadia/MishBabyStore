import { Suspense } from "react";
import { Metadata } from "next";
import { wixClientServer } from "@/lib/wixClientServer";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Filter from "@/components/Filter";
import { notFound } from "next/navigation";

interface PageProps {
  searchParams: {
    cat?: string;
  };
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const wixClient = await wixClientServer();
  const collection = await wixClient.collections.getCollectionBySlug(
    searchParams.cat || "all-products"
  );

  if (!collection.collection) {
    notFound();
  }

  const banner = collection.collection.media?.mainMedia?.image;

  return {
    title: collection.collection.name,
    description: collection.collection.description,
    openGraph: {
      images: banner ? [{ url: banner.url }] : [],
    },
  };
}

const ListPage = async ({ searchParams }: PageProps) => {
  const wixClient = await wixClientServer();

  const cat = await wixClient.collections.getCollectionBySlug(
    searchParams.cat || "all-products"
  );

  if (!cat.collection) {
    notFound();
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* CATEGORY DESCRIPTION */}
      {cat.collection?.description && (
        <div className="my-4 md:my-8 p-4 md:p-8 rounded-lg md:rounded-2xl shadow-md hover:shadow-lg md:shadow-lg md:hover:shadow-xl transition-shadow duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-200 via-cyan-100 to-slate-50 animate-gradient-x"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-3 md:mb-6 text-slate-600 tracking-wide">
              {cat.collection.name}
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed md:leading-loose whitespace-pre-wrap">
              {cat.collection.description}
            </p>
          </div>
        </div>
      )}
      {/* FILTER */}
      <Filter />
      {/* PRODUCTS */}
      <h1 className="mt-12 text-xl font-semibold">{cat.collection.name}</h1>
      <Suspense fallback={<Skeleton />}>
        <ProductList
          categoryId={
            cat.collection._id || "00000000-000000-000000-000000000001"
          }
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
};

export default ListPage;
