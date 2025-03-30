import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { wixClientServer } from "@/lib/wixClientServer";

const CategoryList = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().find();

  // Filter for only visible categories
  const visibleCategories = cats.items.filter((item) => item.visible);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {visibleCategories.map((item) => (
        <Link
          href={`/list?cat=${item.slug}`}
          key={item._id}
          className="block group"
        >
          <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={
                  item.media?.mainMedia?.image?.url || "/placeholder-image.jpg"
                }
                quality={90}
                alt="Category Image"
                fill
                sizes="(max-width: 640px) 100vw, 
                (max-width: 1024px) 50vw,
                (max-width: 1280px) 33vw,
                25vw"
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
              <h3 className="text-lg md:text-xl font-medium mb-1 group-hover:translate-x-1 transition-transform duration-300">
                {item.name}
              </h3>
              <div className="flex items-center text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-300">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
