"use client";

import { Suspense } from "react";
import Reviews from "@/components/Reviews";

const ReviewsClickable = ({ productId }: { productId: string }) => {
  const scrollToReviews = () => {
    const reviewsSection = document.getElementById("full-reviews");
    reviewsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button onClick={scrollToReviews}>
      <Suspense fallback="Loading...">
        <Reviews productId={productId} isAverageRating={true} />
      </Suspense>
    </button>
  );
};

export default ReviewsClickable;
