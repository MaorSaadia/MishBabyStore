import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag, Package, ShoppingCart } from "lucide-react";

import { wixClientServer } from "@/lib/wixClientServer";
import Skeleton from "@/components/Skeleton";
import ProductList from "@/components/ProductList";

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
    searchParams.cat || "bundle-deals"
  );

  if (!collection.collection) {
    notFound();
  }

  const banner = collection.collection.media?.mainMedia?.image;

  return {
    title: `${collection.collection.name} | MishBaby Special Offers`,
    description: collection.collection.description,
    openGraph: {
      images: banner ? [{ url: banner.url }] : [],
    },
  };
}

const BundleDealsPage = async ({ searchParams }: PageProps) => {
  const wixClient = await wixClientServer();

  const cat = await wixClient.collections.getCollectionBySlug(
    searchParams.cat || "bundle-deals"
  );

  if (!cat.collection) {
    notFound();
  }

  // Get bundle deals information (this would come from your backend/API)
  const bundleDeals = [
    { quantity: 2, discount: 10 },
    { quantity: 3, discount: 20 },
  ];

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* BUNDLE DEALS HERO BANNER */}
      <div className="my-6 md:my-8 p-6 md:p-8 rounded-2xl overflow-hidden relative bg-gradient-to-r from-sky-600  to-cyan-500 animate-gradient-x text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Package size={256} strokeWidth={1} className="animate-pulse" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight">
          Bundle Deals
        </h1>
        <p className="text-lg md:text-xl max-w-2xl opacity-90 leading-relaxed">
          Save more when you shop together! Explore our special bundle offers
          and enjoy exclusive discounts on selected products.
        </p>

        {/* BUNDLE TIERS */}
        <div className="flex flex-wrap gap-4 mt-4">
          {bundleDeals.map((deal, index) => (
            <div
              key={index}
              className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm"
            >
              <ShoppingCart className="mr-2" size={20} />
              <span className="font-medium">
                Buy {deal.quantity}, Get {deal.discount}% Off
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="mb-2 bg-gray-50 rounded-xl p-6 md:p-8 -mt-4">
        <h2 className="text-xl md:text-2xl font-bold mb-2 -mt-4 text-gray-800 flex items-center">
          <Tag className="mr-2" size={22} />
          How Bundle Deals Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-cyan-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Choose Your Items</h3>
            <p className="text-gray-600">
              Browse through our bundle-eligible products and add them to your
              cart.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-cyan-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Quantity Matters</h3>
            <p className="text-gray-600">
              Buy 2 items for 10% off or 3+ items for 20% off from this
              collection.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-cyan-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Discount Applied</h3>
            <p className="text-gray-600">
              Discounts are automatically applied at checkout when requirements
              are met.
            </p>
          </div>
        </div>
      </div>

      {/* CATEGORY DESCRIPTION */}
      {cat.collection?.description && (
        <div className="my-4 md:my-8 p-4 md:p-8 rounded-lg md:rounded-2xl shadow-md hover:shadow-lg md:shadow-lg md:hover:shadow-xl transition-shadow duration-300 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 via-cyan-100 to-pink-50 animate-gradient-x"></div>
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

      {/* PRODUCTS WITH BUNDLE BADGE */}
      <h2 className="mt-8 text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
        <Package className="mr-2" size={24} />
        Bundle-Eligible Products
      </h2>
      <p className="text-gray-600 mb-2">
        Mix and match these products to qualify for special bundle discounts
      </p>

      <Suspense fallback={<Skeleton />}>
        {/* Bundle Savings Calculator */}
        {/* <div className="mb-12 p-6 bg-gradient-to-r from-cyan-50 to-cyan-50 rounded-xl border border-cyan-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Package size={20} className="mr-2 text-cyan-600" />
            Calculate Your Bundle Savings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-4xl font-bold text-cyan-600 mb-2">2</div>
              <p className="text-gray-600">Items</p>
              <div className="mt-3 text-sm font-medium bg-cyan-100 text-cyan-700 py-1 px-3 rounded-full inline-block">
                Save 10%
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-cyan-200">
              <div className="text-4xl font-bold text-cyan-600 mb-2">3+</div>
              <p className="text-gray-600">Items</p>
              <div className="mt-3 text-sm font-medium bg-cyan-100 text-cyan-700 py-1 px-3 rounded-full inline-block">
                Save 20%
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Example Savings:</p>
              <div className="text-xl font-bold text-green-600 mb-1">
                $24.00
              </div>
              <p className="text-gray-600 text-sm">on a $120 bundle</p>
            </div>
          </div>
        </div> */}

        <ProductList
          categoryId={
            cat.collection._id || "00000000-000000-000000-000000000001"
          }
          searchParams={searchParams}
          isBundleCategory={true}
        />

        {/* Bundle Benefits */}
        <div className="mt-12 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            Why Shop Our Bundles?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-cyan-50 rounded-lg">
              <div className="font-bold text-cyan-700 mb-2">
                Greater Savings
              </div>
              <p className="text-gray-600 text-sm">
                The more you buy, the more you save with our tiered discount
                system.
              </p>
            </div>

            <div className="p-4 bg-cyan-100  rounded-lg">
              <div className="font-bold text-cyan-800 mb-2">
                Curated Collections
              </div>
              <p className="text-gray-600 text-sm">
                Products that work perfectly together for the best experience.
              </p>
            </div>

            <div className="p-4 bg-cyan-50 sm:bg-cyan-100 rounded-lg">
              <div className="font-bold text-cyan-800 mb-2">Mix & Match</div>
              <p className="text-gray-600 text-sm">
                Freedom to create your own perfect bundle based on your needs.
              </p>
            </div>

            <div className="p-4 bg-cyan-100 sm:bg-cyan-50 rounded-lg">
              <div className="font-bold text-cyan-700 mb-2">
                Simplified Shopping
              </div>
              <p className="text-gray-600 text-sm">
                Get everything you need in one convenient purchase.
              </p>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default BundleDealsPage;
