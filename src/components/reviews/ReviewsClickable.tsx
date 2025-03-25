"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import Link from "next/link";

import StarRating from "./StarRating";

interface ReviewsClickableProps {
  productId: string;
  productSlug?: string;
}

interface ReviewsSummary {
  totalReviews: number;
  averageRating: number;
}

const ReviewsClickable = ({
  productId,
  productSlug,
}: ReviewsClickableProps) => {
  const [summary, setSummary] = useState<ReviewsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (!productSlug) return;

        const response = await fetch(`/api/reviews/${productSlug}`);
        const data = await response.json();

        if (data.success) {
          setSummary({
            totalReviews: data.data.totalReviews,
            averageRating: data.data.averageRating,
          });
        }
      } catch (error) {
        console.error("Error fetching review summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [productId, productSlug]);

  if (loading) {
    return (
      <div className="flex items-center mt-2 animate-pulse">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="text-gray-200 fill-gray-200" />
          ))}
        </div>
        <div className="ml-2 h-4 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!summary || summary.totalReviews === 0) {
    return (
      <div className="flex items-center mt-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="text-gray-300 fill-gray-300" />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-500">No reviews yet</span>
      </div>
    );
  }

  return (
    <Link href="#full-reviews" className="block mt-2 group">
      <div className="flex items-center">
        <StarRating rating={summary.averageRating} size={16} />
        <span className="ml-2 text-sm text-gray-600 group-hover:text-cyan-600 group-hover:underline">
          {summary.averageRating.toFixed(1)} ({summary.totalReviews}{" "}
          {summary.totalReviews === 1 ? "review" : "reviews"})
        </span>
      </div>
    </Link>
  );
};

export default ReviewsClickable;
