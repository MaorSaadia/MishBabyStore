/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewImagesForModal, setReviewImagesForModal] = useState<string[]>(
    []
  );

  // Build API URL with query parameters for server-side filtering and pagination
  const apiUrl = useMemo(() => {
    if (!productSlug) return null;
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: REVIEWS_PER_PAGE.toString(),
      ...(filter > 0 && { rating: filter.toString() }),
    });
    return `/api/reviews/aws/${productSlug}?${params}`;
  }, [productSlug, currentPage, filter]);

  const {
    data: responseData,
    error,
    isLoading,
    mutate,
  } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000, // Cache for 5 minutes
    keepPreviousData: true, // Keep previous data while loading new page
  });

  const data: ReviewsData | null = responseData?.success
    ? responseData.data
    : null;

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

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

  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Pagination handlers
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) =>
      data ? Math.min(data.totalPages, prev + 1) : prev
    );
  }, [data]);

  // Filter handlers
  const handleFilterChange = useCallback(
    (newFilter: number) => {
      setFilter(newFilter === filter ? 0 : newFilter);
    },
    [filter]
  );

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded">
        Failed to load reviews. Please try again later.
      </div>
    );
  }

  // No reviews
  if (data.totalReviews === 0) {
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
              {data.averageRating.toFixed(1)}
            </h3>
            <StarRating
              rating={data.averageRating}
              size={24}
              className="my-2"
            />
            <p className="text-sm text-gray-500">
              Based on {data.totalReviews}{" "}
              {data.totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="w-full md:w-2/3">
          <h3 className="text-lg font-medium mb-2">Rating Distribution</h3>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = data.ratingDistribution[stars] || 0;
            const percentage =
              data.totalReviews > 0 ? (count / data.totalReviews) * 100 : 0;

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
        {data.reviews.map((review) => (
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

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={goToPrevPage}
            disabled={!data.hasPrevPage || isLoading}
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors text-sm flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              const isCurrentPage = pageNum === data.currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  disabled={isLoading}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    isCurrentPage
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 disabled:cursor-not-allowed"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={goToNextPage}
            disabled={!data.hasNextPage || isLoading}
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors text-sm flex items-center"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="text-sm text-gray-500">Loading reviews...</div>
        </div>
      )}

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
