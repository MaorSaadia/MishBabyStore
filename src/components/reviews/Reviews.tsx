/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "lucide-react";

import { Review } from "@/lib/reviewUtils";
import { useWixClient } from "@/hooks/useWixClient";
import { AddReviewDialog } from "./AddReviewDialog";
import StarRating from "./StarRating";

interface ReviewsProps {
  productId: string;
  productSlug?: string;
}

interface ReviewsData {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const REVIEWS_PER_PAGE = 5;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Reviews = ({ productId, productSlug }: ReviewsProps) => {
  const wixClient = useWixClient();
  const isLoggedIn = wixClient.auth.loggedIn();

  const [filter, setFilter] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewImagesForModal, setReviewImagesForModal] = useState<string[]>(
    []
  );

  // --- 1. Swapped useSWR for useSWRInfinite ---
  const getKey = (pageIndex: number, previousPageData: any) => {
    // Reached the end of the data
    if (previousPageData && !previousPageData.data?.hasNextPage) return null;

    if (!productSlug) return null;
    const params = new URLSearchParams({
      page: (pageIndex + 1).toString(),
      limit: REVIEWS_PER_PAGE.toString(),
      ...(filter > 0 && { rating: filter.toString() }),
    });
    return `/api/reviews/${productSlug}?${params}`;
  };

  const {
    data: pages,
    error,
    size,
    setSize,
    isLoading,
    isValidating,
    mutate,
  } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  });

  // --- 2. Create state derived from useSWRInfinite ---
  const reviews: Review[] = pages
    ? pages.flatMap((page) => (page.success ? page.data.reviews : []))
    : [];
  const initialData: ReviewsData | null = pages?.[0]?.success
    ? pages[0].data
    : null;
  const isLoadingInitialData = isLoading && !initialData;
  const hasMore = pages ? pages[pages.length - 1]?.data?.hasNextPage : false;

  // Reset to the first page when the filter changes
  useEffect(() => {
    setSize(1);
  }, [filter, setSize]);

  // Body scroll lock for modal
  useEffect(() => {
    if (selectedImage) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [selectedImage]);

  // Modal handlers
  const handleImageClick = useCallback(
    (image: string, images: string[], index: number) => {
      setSelectedImage(image);
      setReviewImagesForModal(images);
      setCurrentImageIndex(index);
    },
    []
  );

  const navigateImages = useCallback(
    (direction: "prev" | "next") => {
      setCurrentImageIndex((prev) =>
        direction === "prev"
          ? prev === 0
            ? reviewImagesForModal.length - 1
            : prev - 1
          : prev === reviewImagesForModal.length - 1
          ? 0
          : prev + 1
      );
    },
    [reviewImagesForModal.length]
  );

  const closeModal = useCallback(() => setSelectedImage(null), []);

  // Filter handler
  const handleFilterChange = useCallback(
    (newFilter: number) => {
      setFilter(newFilter === filter ? 0 : newFilter);
    },
    [filter]
  );

  // Loading state
  if (isLoadingInitialData) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  // Error state
  if (error || !initialData) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded">
        Failed to load reviews. Please try again later.
      </div>
    );
  }

  // No reviews
  if (initialData.totalReviews === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600 mb-4">
          No reviews yet. Be the first to share your experience!
        </p>
        {isLoggedIn ? (
          <AddReviewDialog
            productSlug={productSlug || ""}
            onReviewAdded={() => mutate()}
          />
        ) : (
          <div className="p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
            Please log in to add a review
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Review */}
      <div className="flex justify-end mb-4">
        {isLoggedIn ? (
          <AddReviewDialog
            productSlug={productSlug || ""}
            onReviewAdded={() => mutate()}
          />
        ) : (
          <div className="p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
            Please log in to add a review
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Average Rating */}
        <div className="w-full md:w-1/3">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold">
              {initialData.averageRating.toFixed(1)}
            </h3>
            <StarRating
              rating={initialData.averageRating}
              size={24}
              className="my-2"
            />
            <p className="text-sm text-gray-500">
              Based on {initialData.totalReviews}{" "}
              {initialData.totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="w-full md:w-2/3">
          <h3 className="text-lg font-medium mb-2">Rating Distribution</h3>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = initialData.ratingDistribution[stars] || 0;
            const percentage =
              initialData.totalReviews > 0
                ? (count / initialData.totalReviews) * 100
                : 0;

            return (
              <div key={stars} className="flex items-center mb-1">
                <button
                  onClick={() => handleFilterChange(stars)}
                  className={`text-sm mr-2 w-16 text-left hover:text-cyan-600 transition-colors ${
                    filter === stars ? "font-bold text-cyan-600" : ""
                  }`}
                >
                  {stars} star{stars !== 1 ? "s" : ""}
                </button>
                <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm ml-2 w-8 text-right">{count}</span>
              </div>
            );
          })}
          {filter > 0 && (
            <button
              onClick={() => setFilter(0)}
              className="text-sm text-cyan-600 hover:underline mt-2 block"
            >
              Show all reviews
            </button>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6 mt-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex flex-col sm:flex-row justify-between items-start">
              <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                <div className="mb-2 sm:mb-0 sm:mr-4">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-medium mr-2 mb-1 sm:mb-0">
                      {review.userName === "AliExpress Shopper"
                        ? "Anonymous"
                        : review.userName}
                    </span>
                    {review.country && (
                      <span className="text-xs text-gray-500">
                        {review.country}
                      </span>
                    )}
                  </div>
                  <StarRating rating={review.rating} className="mt-1" />
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                {review.date}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-gray-700">{review.translationReview}</p>
            </div>

            {review.images && review.images.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {review.images.map((image, idx) => (
                    <div
                      key={`${review.id}-img-${idx}`}
                      className="w-16 h-16 rounded overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() =>
                        handleImageClick(image, review.images!, idx)
                      }
                    >
                      <img
                        src={image}
                        alt={`Review by ${review.userName}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- 3. REPLACED Pagination with "Load More" button --- */}
      <div className="flex justify-center">
        {hasMore && (
          <button
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isValidating ? "Loading..." : "Load More Reviews"}
          </button>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors"
              onClick={closeModal}
            >
              <XIcon className="w-6 h-6" />
            </button>

            {reviewImagesForModal.length > 1 && (
              <>
                <button
                  className="absolute left-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors"
                  onClick={() => navigateImages("prev")}
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors"
                  onClick={() => navigateImages("next")}
                >
                  <ArrowRightIcon className="w-6 h-6" />
                </button>
              </>
            )}

            <img
              src={reviewImagesForModal[currentImageIndex]}
              alt="Review image"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />

            {reviewImagesForModal.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {currentImageIndex + 1} / {reviewImagesForModal.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
