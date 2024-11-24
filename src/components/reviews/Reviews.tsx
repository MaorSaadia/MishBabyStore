import Image from "next/image";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReviewsImage from "./ReviewsImage";

interface ReviewsProps {
  productId: string;
  isAverageRating?: boolean;
}

const Reviews: React.FC<ReviewsProps> = async ({
  productId,
  isAverageRating,
}) => {
  const reviewRes = await fetch(
    `https://api.fera.ai/v3/public/reviews?product.id=${productId}&public_key=${process.env.NEXT_PUBLIC_FERA_ID}`
  );
  const reviews = await reviewRes.json();

  // Calculate average rating
  const averageRating =
    reviews.data.reduce((acc: number, review: any) => acc + review.rating, 0) /
      reviews.data.length || 0;

  const initialReviews = reviews.data.slice(0, 5);
  const hasMoreReviews = reviews.data.length > 5;

  return (
    <div className="space-y-6">
      {isAverageRating ? (
        <RatingSummary
          averageRating={averageRating}
          totalReviews={reviews.data.length}
        />
      ) : (
        <div>
          <div className="space-y-6">
            {initialReviews.map((review: any) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {hasMoreReviews && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-6">
                  View All {reviews.data.length} Reviews
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>All Reviews</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {reviews.data.map((review: any) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
};

const RatingSummary = ({
  averageRating,
  totalReviews,
}: {
  averageRating: number;
  totalReviews: number;
}) => {
  return (
    <div className="mt-2 flex items-center space-x-2 py-2">
      <div className="flex items-center">
        <span className="text-2xl font-bold mr-2">
          {averageRating.toFixed(1)}
        </span>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={16}
              className={
                index < Math.round(averageRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-500">
        {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
      </div>
    </div>
  );
};

const ReviewCard = ({ review }: { review: any }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Image
              src={review.customer.avatar_url}
              alt=""
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold text-lg">
                {review.customer.display_name}
              </h3>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    className={
                      index < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          {/* <span className="text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString()}
          </span> */}
        </div>

        {review.heading && (
          <h4 className="font-medium text-lg mb-2">{review.heading}</h4>
        )}

        <p className="text-gray-700">{review.body}</p>

        {review.media && review.media.length > 0 && (
          <ReviewsImage images={review.media} />
        )}
      </CardContent>
    </Card>
  );
};

export default Reviews;
