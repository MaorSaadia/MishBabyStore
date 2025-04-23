"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string | undefined;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  slug: string;
}

interface ProductWithReviews extends Product {
  rating: number;
  reviewCount: number;
}

interface BestSellersProps {
  products: Product[];
  limit?: number;
}

const BestSellers = ({ products, limit = 10 }: BestSellersProps) => {
  const [productsWithReviews, setProductsWithReviews] = useState<
    ProductWithReviews[]
  >([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Calculate visible items based on screen size
  const [visibleItems, setVisibleItems] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      // Update number of visible items based on screen width
      if (window.innerWidth >= 1280) {
        // xl
        setVisibleItems(5);
      } else if (window.innerWidth >= 1024) {
        // lg
        setVisibleItems(4);
      } else if (window.innerWidth >= 768) {
        // md
        setVisibleItems(3);
      } else if (window.innerWidth >= 640) {
        // sm
        setVisibleItems(2);
      } else {
        setVisibleItems(2);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const limitedProducts = products.slice(0, limit);

        // Fetch reviews data for each product
        const productsWithReviewsData = await Promise.all(
          limitedProducts.map(async (product) => {
            try {
              const response = await fetch(`/api/reviews/${product.slug}`);
              const data = await response.json();

              if (data.success) {
                return {
                  ...product,
                  rating: data.data.averageRating,
                  reviewCount: data.data.totalReviews,
                };
              }

              // Fallback if the API call wasn't successful
              return {
                ...product,
                rating: 0,
                reviewCount: 0,
              };
            } catch (error) {
              console.error(
                `Error fetching reviews for ${product.slug}:`,
                error
              );
              return {
                ...product,
                rating: 0,
                reviewCount: 0,
              };
            }
          })
        );

        setProductsWithReviews(productsWithReviewsData);
      } catch (error) {
        console.error("Error fetching review data:", error);
        // If there's an error, use products without review data
        setProductsWithReviews(
          products.slice(0, limit).map((product) => ({
            ...product,
            rating: 0,
            reviewCount: 0,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    if (products && products.length > 0) {
      fetchReviewsData();
    } else {
      setLoading(false);
    }
  }, [products, limit]);

  // Setup scroll observer to update active index
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const cardWidth =
      scrollContainer.querySelector(".product-card")?.clientWidth || 160;
    const gap = 16; // gap between cards
    const itemWidth = cardWidth + gap;

    // Update active index based on scroll position
    const handleScroll = () => {
      if (!scrollContainer) return;
      const scrollLeft = scrollContainer.scrollLeft;
      const newIndex = Math.round(scrollLeft / itemWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={16}
          className="text-yellow-400 fill-current"
        />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          {/* Half filled star */}
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star size={16} className="text-yellow-400 fill-current" />
          </div>
          {/* Background star */}
          <Star size={16} className="text-gray-300 fill-current" />
        </div>
      );
    }

    // Add remaining empty stars
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={16}
          className="text-gray-300 fill-current"
        />
      );
    }

    return stars;
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth =
        container.querySelector(".product-card")?.clientWidth || 160;
      const gap = 16; // gap between cards
      const scrollAmount = (cardWidth + gap) * visibleItems;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Scroll to specific item index
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth =
        container.querySelector(".product-card")?.clientWidth || 160;
      const gap = 16; // gap between cards

      container.scrollTo({
        left: index * (cardWidth + gap) * visibleItems,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  // Show loading skeleton when data is being fetched
  if (loading) {
    return (
      <div className="py-8 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="flex overflow-x-auto space-x-4 pb-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-40 sm:w-56 md:w-64 bg-white rounded-lg shadow-md overflow-hidden p-3"
                >
                  <div className="h-36 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  const ProductCard = ({ product }: { product: ProductWithReviews }) => (
    <Link href={`/${product.slug}`} className="group product-card">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl transform group-hover:-translate-y-1 h-full">
        <div className="relative h-36 sm:h-44 md:h-48 overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-0 left-0 flex flex-col gap-1 p-1 md:p-2">
            {product.discountPrice && (
              <div className="bg-red-500 text-white text-xs font-bold rounded-full px-1 py-0.5 md:px-2 md:py-1">
                {Math.round(
                  ((product.price - product.discountPrice) / product.price) *
                    100
                )}
                % OFF
              </div>
            )}
            {product.reviewCount >= 50 && (
              <div className="bg-yellow-500 text-white text-xs font-bold rounded-full px-1 py-0.5 md:px-2 md:py-1">
                TOP RATED
              </div>
            )}
          </div>
        </div>
        <div className="p-2 md:p-4">
          <h3 className="text-gray-800 font-medium text-sm md:text-lg mb-1 truncate">
            {product.name}
          </h3>
          <div className="flex items-center mb-1 md:mb-2">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-gray-500 text-xs ml-1 md:ml-2">
              {product.reviewCount > 0
                ? `(${product.reviewCount})`
                : "(No reviews yet)"}
            </span>
          </div>
          <div className="flex items-center">
            {product.discountPrice ? (
              <>
                <span className="text-gray-800 font-bold text-sm md:text-base mr-2">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="text-gray-500 text-xs md:text-sm line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-gray-800 font-bold text-sm md:text-base">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  // Calculate the number of pages based on visible items per screen
  const numberOfPages = Math.ceil(productsWithReviews.length / visibleItems);

  return (
    <div className="py-8 bg-gradient-to-r from-cyan-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 relative inline-block">
            <span className="relative z-10">
              Best Sellers
              <span className="absolute -bottom-1 left-0 w-full h-3 bg-cyan-300 opacity-40 z-0"></span>
            </span>
          </h2>
        </div>

        {/* Horizontal scrollable container with navigation buttons for all screen sizes */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex space-x-4 px-1">
              {productsWithReviews.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-40 sm:w-56 md:w-64 lg:w-72 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Scroll buttons - larger on desktop */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-8 bg-white bg-opacity-70 rounded-full p-1 md:p-2 shadow-md z-10 hover:bg-opacity-90 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-gray-800" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-8 bg-white bg-opacity-70 rounded-full p-1 md:p-2 shadow-md z-10 hover:bg-opacity-90 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-gray-800" />
          </button>

          {/* Interactive scroll indicator dots */}
          <div className="flex justify-center space-x-3 -mb-2">
            {Array.from({ length: numberOfPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  Math.floor(activeIndex / visibleItems) === index
                    ? "bg-cyan-500 transform scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
