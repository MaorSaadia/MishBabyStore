"use client";

import { Suspense } from "react";
import Reviews from "@/components/reviews/Reviews";
import Loader from "@/components/Loader";
import { Skeleton } from "@/components/ui/skeleton";

const ReviewsClickable = ({ productId }: { productId: string }) => {
  const scrollToReviews = () => {
    const reviewsSection = document.getElementById("full-reviews");
    reviewsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button onClick={scrollToReviews} className="mt-2">
      <Suspense
        fallback={
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
        }
      >
        <Reviews productId={productId} isAverageRating={true} />
      </Suspense>
    </button>
  );
};

export default ReviewsClickable;
