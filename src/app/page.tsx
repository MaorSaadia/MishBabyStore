import { Suspense } from "react";

import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Slider from "@/components/Slider";

const HomePage = async () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto">
        <Slider />
      </div>
      <div className="container mx-auto mt-10 px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Featured Products
        </h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.FEATURED_PRODUCTS_FEATURED_ALL_CATEGORY_ID!}
            limit={16}
          />
        </Suspense>
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
