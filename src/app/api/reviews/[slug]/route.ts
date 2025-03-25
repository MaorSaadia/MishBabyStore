import { NextRequest, NextResponse } from "next/server";
import {
  getProductReviews,
  calculateAverageRating,
  getRatingDistribution,
} from "@/lib/reviewUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const reviews = await getProductReviews(slug);
    const averageRating = calculateAverageRating(reviews);
    const ratingDistribution = getRatingDistribution(reviews);

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        totalReviews: reviews.length,
        averageRating,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
