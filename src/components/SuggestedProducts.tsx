/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tag, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { media as wixMedia } from "@wix/sdk";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  price?: {
    price: number;
    discountedPrice?: number;
  };
  media?: {
    mainMedia?: {
      image?: {
        url: string;
      };
    };
  };
}

const SuggestedProducts = ({
  suggestedProducts,
}: {
  suggestedProducts: Product[];
}) => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(2);

  console.log(suggestedProducts, JSON.stringify(suggestedProducts, null, 2));

  // Handle responsive visible items
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setVisibleItems(5); // xl
      else if (window.innerWidth >= 1024) setVisibleItems(4); // lg
      else if (window.innerWidth >= 768) setVisibleItems(3); // md
      else if (window.innerWidth >= 640) setVisibleItems(2); // sm
      else setVisibleItems(2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll event listener to update active page
  useEffect(() => {
    if (!scrollContainerRef.current || !suggestedProducts.length) return;

    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const cardWidth =
        scrollContainer.querySelector(".product-card")?.clientWidth || 160;
      const gap = 16;
      const itemWidth = cardWidth + gap;
      const firstVisibleCardIndex = Math.round(scrollLeft / itemWidth);
      const newActivePage = Math.floor(firstVisibleCardIndex / visibleItems);
      const numberOfPages = Math.ceil(suggestedProducts.length / visibleItems);
      const clampedPage = Math.max(
        0,
        Math.min(newActivePage, numberOfPages - 1)
      );

      if (clampedPage !== activeIndex) setActiveIndex(clampedPage);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [visibleItems, suggestedProducts.length, activeIndex]);

  // Scroll with chevron buttons
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth =
        container.querySelector(".product-card")?.clientWidth || 160;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * visibleItems;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Scroll to specific page when clicking a dot
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth =
        container.querySelector(".product-card")?.clientWidth || 160;
      const gap = 16;

      container.scrollTo({
        left: index * (cardWidth + gap) * visibleItems,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  if (!suggestedProducts || suggestedProducts.length === 0) {
    return null;
  }

  const handleProductClick = (productName: string) => {
    router.push(`/${productName.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const numberOfPages = Math.ceil(suggestedProducts.length / visibleItems);

  return (
    <div className="mt-8 -mb-8">
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-100 shadow-sm">
        {/* Header with bundle information */}
        <div className="mb-3">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Special Bundle Offers
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Add these items to your cart for exclusive discounts!
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs mt-2">
            <span className="inline-flex items-center bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full font-medium">
              <Tag className="h-3 w-3 mr-1" />
              Buy 2: 10% OFF
            </span>
            <span className="inline-flex items-center bg-sky-100 text-sky-700 px-2 py-1 rounded-full font-medium">
              <Tag className="h-3 w-3 mr-1" />
              Buy 3+: 20% OFF
            </span>
          </div>
        </div>

        {/* Product Cards in horizontal scroll with navigation */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex space-x-4 px-1">
              {suggestedProducts.map((product) => (
                <div
                  key={product._id}
                  className="product-card flex-shrink-0 w-40 sm:w-48 md:w-56 snap-start bg-white rounded-lg overflow-hidden shadow-sm hover:shadow border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-1 first:ml-4 last:mr-4"
                >
                  <div className="relative">
                    {product.media?.mainMedia?.image && (
                      <img
                        src={wixMedia.getScaledToFillImageUrl(
                          product.media.mainMedia.image.url,
                          200,
                          150,
                          {}
                        )}
                        alt={product.name}
                        className="w-full h-24 object-cover cursor-pointer"
                        onClick={() => handleProductClick(product.name)}
                      />
                    )}
                    <div className="absolute top-1 left-1 bg-cyan-600 text-white px-1.5 py-0.5 rounded-full text-xs flex items-center">
                      <Package className="h-2.5 w-2.5 mr-0.5" />
                      <span className="text-[10px]">Bundle</span>
                    </div>
                  </div>

                  <div className="p-2 flex-grow flex flex-col justify-between">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex flex-col">
                      {product.price?.discountedPrice !==
                      product.price?.price ? (
                        <>
                          <span className="text-gray-500 line-through text-xs">
                            ${(product?.price?.price || 0).toFixed(2)}
                          </span>
                          <span className="text-cyan-600 font-bold text-sm">
                            ${product?.price?.discountedPrice?.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-cyan-600 font-bold text-sm">
                          ${(product.price?.price || 0).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <Button
                      className="w-full py-1 h-auto text-xs bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700 text-white"
                      onClick={() => handleProductClick(product.name)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          {suggestedProducts.length > visibleItems && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-8 bg-white bg-opacity-70 rounded-full p-1 md:p-2 shadow-md z-10 hover:bg-opacity-90 transition-all 2xl:hidden"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} className="text-gray-800" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-8 bg-white bg-opacity-70 rounded-full p-1 md:p-2 shadow-md z-10 hover:bg-opacity-90 transition-all 2xl:hidden"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} className="text-gray-800" />
              </button>
            </>
          )}

          {/* Pagination dots */}
          {numberOfPages > 1 && (
            <div className="flex justify-center space-x-3 sm:-mb-4 2xl:hidden">
              {Array.from({ length: numberOfPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-cyan-500 transform scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                ></button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 lg:mt-0 text-right">
          <Link
            href="/bundle-deals"
            className="text-cyan-600 hover:text-cyan-800 text-sm font-medium inline-flex items-center transition-colors duration-200 "
          >
            See all bundles <span className="ml-1">→</span>
          </Link>
        </div>

        {/* CSS for hiding scrollbar but allowing scroll */}
        <style jsx global>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SuggestedProducts;
