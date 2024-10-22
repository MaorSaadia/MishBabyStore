"use client";

import { Suspense } from "react";

import Reviews from "@/components/reviews/Reviews";
import Loader from "@/components/Loader";

const ReviewsClickable = ({ productId }: { productId: string }) => {
  const scrollToReviews = () => {
    const reviewsSection = document.getElementById("full-reviews");
    reviewsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button onClick={scrollToReviews} className="mt-2">
      <Suspense fallback={<Loader color="text-yellow-400" />}>
        <Reviews productId={productId} isAverageRating={true} />
      </Suspense>
    </button>
  );
};

export default ReviewsClickable;
