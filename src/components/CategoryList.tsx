import React from "react";
import Image from "next/image";
import Link from "next/link";

import { wixClientServer } from "@/lib/wixClientServer";

const CategoryList = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().find();

  return (
    <div className="container mx-auto px-4 py-4 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {cats.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            key={item._id}
            className="block group"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={
                    item.media?.mainMedia?.image?.url ||
                    "/placeholder-image.jpg"
                  }
                  alt=""
                  fill
                  className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors duration-300">
                  {item.name}
                </h3>
                {/* <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description || "Discover our curated collection"}
                </p> */}
                <span className="inline-block text-cyan-600 font-medium group-hover:text-black transition-colors duration-300">
                  Explore →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
