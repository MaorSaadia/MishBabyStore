/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Review } from "@/lib/reviewUtils";
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

const Reviews = ({ productId, productSlug }: ReviewsProps) => {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(0); // 0 means all reviews
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5; // Number of reviews to show per page

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!productSlug) return;

        const response = await fetch(`/api/reviews/${productSlug}`);
        const responseData = await response.json();

        if (responseData.success) {
          setData(responseData.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, productSlug]);

  // Filter reviews based on star rating
  const filteredReviews =
    data?.reviews.filter(
      (review) => filter === 0 || review.rating === filter
    ) || [];

  // Pagination calculations
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  // Pagination controls logic
  const renderPaginationButtons = () => {
    const buttons = [];
    const range = 1; // Number of pages to show around current page

    // First page button
    if (totalPages > 5) {
      buttons.push(
        <button
          key="first"
          onClick={() => paginate(1)}
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded text-sm ${
            currentPage === 1
              ? "bg-cyan-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          1
        </button>
      );
    }

    // Left ellipsis
    if (currentPage > range + 2) {
      buttons.push(
        <span key="left-ellipsis" className="mx-1">
          ..
        </span>
      );
    }

    // Page range around current page
    const start = Math.max(2, currentPage - range);
    const end = Math.min(totalPages - 1, currentPage + range);

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded text-sm ${
            currentPage === i
              ? "bg-cyan-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    // Right ellipsis
    if (currentPage < totalPages - (range + 1)) {
      buttons.push(
        <span key="right-ellipsis" className="mx-1">
          ..
        </span>
      );
    }

    // Last page button
    if (totalPages > 5) {
      buttons.push(
        <button
          key="last"
          onClick={() => paginate(totalPages)}
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded text-sm ${
            currentPage === totalPages
              ? "bg-cyan-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  // Pagination handlers
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset current page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!data || data.totalReviews === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-center text-gray-500">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary - Modified for better mobile responsiveness */}
      <div className="flex flex-col md:flex-row items-start">
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

      {/* Filter info */}
      {filter > 0 && (
        <div className="text-sm text-gray-600 italic">
          Showing only {filter}-star reviews ({filteredReviews.length} of{" "}
          {data.totalReviews})
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-6 mt-6">
        {filteredReviews.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No reviews match the current filter.
          </p>
        ) : (
          currentReviews.map((review) => (
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
                        className="w-16 h-16 rounded overflow-hidden cursor-pointer"
                        onClick={() => setSelectedImage(image)}
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
          ))
        )}
      </div>

      {/* Pagination Controls - Improved with dynamic page range */}
      {filteredReviews.length > reviewsPerPage && (
        <div className="flex justify-center items-center gap-1 mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-1 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
          >
            <ArrowLeftIcon />
          </button>

          <div className="flex items-center gap-1">
            {renderPaginationButtons()}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-1 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
          >
            <ArrowRightIcon />
          </button>
        </div>
      )}

      {/* Image modal - Improved for mobile */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-opacity-75"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Review image"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
