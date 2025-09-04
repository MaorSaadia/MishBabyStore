/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
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
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Reviews = ({ productId, productSlug }: ReviewsProps) => {
  const wixClient = useWixClient();
  const isLoggedIn = wixClient.auth.loggedIn();

  const {
    data: responseData,
    error,
    isLoading,
  } = useSWR(
    productSlug ? `/api/reviews/aws/${productSlug}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 5 * 60 * 1000 } // cache 5 min
  );

  const data: ReviewsData | null = responseData?.success
    ? responseData.data
    : null;

  const [filter, setFilter] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewImagesForModal, setReviewImagesForModal] = useState<string[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Toggle body scroll lock on modal open
  useEffect(() => {
    if (selectedImage) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [selectedImage]);

  // Filter & paginate reviews
  const filteredReviews =
    data?.reviews.filter(
      (review) => filter === 0 || review.rating === filter
    ) || [];

  const indexOfLastReview = currentPage * reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfLastReview - reviewsPerPage,
    indexOfLastReview
  );
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  // Reset pagination on filter change
  useEffect(() => setCurrentPage(1), [filter]);

  // Modal handlers
  const handleImageClick = (image: string, images: string[], index: number) => {
    setSelectedImage(image);
    setReviewImagesForModal(images);
    setCurrentImageIndex(index);
  };
  const navigateImages = (direction: "prev" | "next") => {
    setCurrentImageIndex((prev) =>
      direction === "prev"
        ? prev === 0
          ? reviewImagesForModal.length - 1
          : prev - 1
        : prev === reviewImagesForModal.length - 1
        ? 0
        : prev + 1
    );
  };

  // Loading state
  if (isLoading) {
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
          <AddReviewDialog productSlug={productSlug || ""} />
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
          <AddReviewDialog productSlug={productSlug || ""} />
        ) : (
          <div className="p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
            Please log in to add a review
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex flex-col md:flex-row items-start">
        {/* Average Rating */}
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
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
        <div className="w-full md:w-2/3 md:pl-8 mt-4 md:mt-0">
          <h3 className="text-lg font-medium mb-2">Rating Distribution</h3>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = data.ratingDistribution[stars] || 0;
            const percentage =
              data.totalReviews > 0 ? (count / data.totalReviews) * 100 : 0;
            return (
              <div key={`star-${stars}`} className="flex items-center mb-1">
                <button
                  onClick={() => setFilter(filter === stars ? 0 : stars)}
                  className={`text-sm mr-2 w-16 text-left ${
                    filter === stars ? "font-bold" : ""
                  }`}
                >
                  {stars} star{stars !== 1 ? "s" : ""}
                </button>
                <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
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

      {/* Reviews */}
      <div className="space-y-6 mt-6">
        {currentReviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
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
      {filteredReviews.length > reviewsPerPage && (
        <div className="flex justify-center items-center gap-1 mt-6">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-1 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
          >
            <ArrowLeftIcon />
          </button>
          <span className="px-3 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-1 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
          >
            <ArrowRightIcon />
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center"
              onClick={() => setSelectedImage(null)}
            >
              <XIcon className="w-6 h-6" />
            </button>
            {reviewImagesForModal.length > 1 && (
              <button
                className="absolute left-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center"
                onClick={() => navigateImages("prev")}
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
            )}
            <img
              src={reviewImagesForModal[currentImageIndex]}
              alt="Review image"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            {reviewImagesForModal.length > 1 && (
              <button
                className="absolute right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center"
                onClick={() => navigateImages("next")}
              >
                <ArrowRightIcon className="w-6 h-6" />
              </button>
            )}
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
