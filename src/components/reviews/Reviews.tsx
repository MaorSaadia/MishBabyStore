/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "lucide-react";

import { Review } from "@/lib/reviewUtils";
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

const Reviews = ({ productId, productSlug }: ReviewsProps) => {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(0); // 0 means all reviews
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // New states for image modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewImagesForModal, setReviewImagesForModal] = useState<string[]>(
    []
  );

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

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

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

  // Image click handler
  const handleImageClick = (image: string, images: string[], index: number) => {
    setSelectedImage(image);
    setReviewImagesForModal(images);
    setCurrentImageIndex(index);
  };

  // Image navigation handlers
  const navigateImages = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 0 ? reviewImagesForModal.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === reviewImagesForModal.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Pagination controls logic (previous implementation remains the same)
  const renderPaginationButtons = () => {
    // If totalPages is 5 or less, just show all pages
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map(
        (pageNum) => (
          <button
            key={pageNum}
            onClick={() => paginate(pageNum)}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded text-sm ${
              currentPage === pageNum
                ? "bg-cyan-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {pageNum}
          </button>
        )
      );
    }

    // Otherwise, show first page button, ellipses, etc.
    const buttons = [];
    const range = 1; // Number of pages to show around current page

    // First page button
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

    // Left ellipsis
    if (currentPage > range + 2) {
      buttons.push(
        <span key="left-ellipsis" className="mx-1">
          ...
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
          ...
        </span>
      );
    }

    // Last page button
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

    return buttons;
  };

  // Pagination handlers
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset current page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  // No reviews state
  if (!data || data.totalReviews === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600 mb-4">No reviews yet.</p>
        {/* <p className="text-gray-600 mb-4">
          No reviews yet. Be the first to share your experience!
        </p> */}
        {/* <AddReviewDialog productSlug={productSlug || ""} /> */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-end mb-4">
        <AddReviewDialog productSlug={productSlug || ""} />
      </div> */}
      {/* Summary Section */}
      <div className="flex flex-col md:flex-row items-start">
        {/* Average Rating Section */}
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

        {/* Rating Distribution Section */}
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

      {/* Filter Info */}
      {filter > 0 && (
        <div className="text-sm text-gray-600 italic">
          Showing only {filter}-star reviews ({filteredReviews.length} of{" "}
          {data.totalReviews})
        </div>
      )}

      {/* Reviews List */}
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
                        className="w-16 h-16 rounded overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() =>
                          handleImageClick(image, review.images || [], idx)
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
          ))
        )}
      </div>

      {/* Pagination Controls */}
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

      {/* Improved Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-hidden"
          onClick={() => {
            setSelectedImage(null);
            setCurrentImageIndex(0);
          }}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center z-50"
              onClick={() => {
                setSelectedImage(null);
                setCurrentImageIndex(0);
              }}
            >
              <XIcon className="w-6 h-6" />
            </button>

            {/* Previous Image Button */}
            {reviewImagesForModal.length > 1 && (
              <button
                className="absolute left-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImages("prev");
                }}
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <div className="relative max-w-full max-h-[90vh] flex items-center justify-center">
              <img
                src={reviewImagesForModal[currentImageIndex]}
                alt="Review image"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Next Image Button */}
            {reviewImagesForModal.length > 1 && (
              <button
                className="absolute right-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImages("next");
                }}
              >
                <ArrowRightIcon className="w-6 h-6" />
              </button>
            )}

            {/* Image Counter */}
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
