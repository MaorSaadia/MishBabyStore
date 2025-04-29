import { Suspense } from "react";
import Link from "next/link";
import { Info } from "lucide-react"; // Import Info icon

import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Slider from "@/components/Slider";
import BestSellersContainer from "@/components/BestSellersContainer";

const HomePage = async () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto">
        <Slider />
      </div>

      {/* Best Sellers Section */}
      <div className="mt-6">
        <Suspense fallback={<Skeleton />}>
          <BestSellersContainer limit={10} />
        </Suspense>
      </div>

      <div className="container mx-auto mt-6 px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Featured Products
        </h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.FEATURED_PRODUCTS_FEATURED_ALL_CATEGORY_ID!}
            limit={12}
          />
        </Suspense>

        <div className="flex justify-center mt-6 -mb-6">
          <Link
            href="/list?cat=all-products"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-500 to-cyan-300 p-0.5 font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <span className="relative rounded-full bg-white px-8 py-3.5 transition-all duration-300 ease-in-out group-hover:bg-opacity-0">
              View All Products
            </span>
          </Link>
        </div>
      </div>
      <div className="mt-12 bg-gray-50 py-10">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Explore Categories
          </h2>
          <Suspense fallback={<Skeleton />}>
            <CategoryList />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
