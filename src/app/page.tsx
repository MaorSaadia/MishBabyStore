import { Suspense } from "react";

import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Slider from "@/components/Slider";

const HomePage = async () => {
  return (
    <div className="">
      <Slider />
      <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-gray-800">
          Featured Products
        </h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.FEATURED_PRODUCTS_FEATURED_ALL_CATEGORY_ID!}
            limit={12}
          />
        </Suspense>
      </div>
      <div className="mt-4 md:mt-8 container mx-auto px-4 py-12 bg-gray-50">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 text-gray-800">
          Explore Categories
        </h2>
        <Suspense fallback={<Skeleton />}>
          <CategoryList />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
