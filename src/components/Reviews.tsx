import Image from "next/image";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import ReviewsImage from "./ReviewsImage";

// This is your main server-side component
const Reviews = async ({ productId }: { productId: string }) => {
  const reviewRes = await fetch(
    `https://api.fera.ai/v3/public/reviews?product.id=${productId}&public_key=${process.env.NEXT_PUBLIC_FERA_ID}`
  );
  const reviews = await reviewRes.json();

  return (
    <div className="space-y-6">
      {reviews.data.map((review: any) => (
        <ReviewCard key={review.id} review={review} />
      ))}
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
          <span className="text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString()}
          </span>
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
