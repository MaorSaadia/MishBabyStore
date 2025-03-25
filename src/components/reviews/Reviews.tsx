/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";

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
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const handleHelpfulClick = (reviewId: string) => {
    if (!helpfulClicked[reviewId]) {
      setHelpfulClicked((prev) => ({ ...prev, [reviewId]: true }));

      // Update the vote count in the UI
      if (data) {
        const updatedReviews = data.reviews.map((review) => {
          if (review.id === reviewId) {
            return {
              ...review,
              voteCount: (review.voteCount || 0) + 1,
            };
          }
          return review;
        });

        setData({
          ...data,
          reviews: updatedReviews,
        });
      }
    }
  };

  const filteredReviews =
    data?.reviews.filter(
      (review) => filter === 0 || review.rating === filter
    ) || [];

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
      {/* Summary */}
      <div className="md:flex items-start">
        <div className="md:w-1/3">
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

        <div className="md:w-2/3 md:pl-8 mt-4 md:mt-0">
          <h3 className="text-lg font-medium mb-2">Rating Distribution</h3>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = data.ratingDistribution[stars] || 0;
            const percentage =
              data.totalReviews > 0 ? (count / data.totalReviews) * 100 : 0;

            return (
              <div key={`star-${stars}`} className="flex items-center mb-1">
                <button
                  onClick={() => setFilter(filter === stars ? 0 : stars)}
                  className={`text-sm mr-2 ${
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
              className="text-sm text-cyan-600 hover:underline mt-2"
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
          filteredReviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">
                        {review.userName}
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
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>

              {review.skuInfo && (
                <div className="text-sm text-gray-500 mt-2">
                  Purchased: {review.skuInfo}
                </div>
              )}

              <div className="mt-3">
                <p className="text-gray-700">{review.translationReview}</p>
                {/* {review.translationReview &&
                  review.translationReview !== review.content && (
                    <div className="mt-1 text-gray-500 text-sm italic">
                      <span className="font-medium">Translated:</span>{" "}
                      {review.translationReview}
                    </div>
                  )} */}
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
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholder.jpg";
                          }}
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

      {/* Image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-75"
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
