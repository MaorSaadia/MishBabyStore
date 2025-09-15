// app/api/reviews/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getProductReviews,
  calculateAverageRating,
  getRatingDistribution,
  Review, // Assuming Review type is exported from here
} from "@/lib/reviewUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);

    // --- 1. Get query parameters ---
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const ratingFilter = parseInt(searchParams.get("rating") || "0");

    // --- 2. Fetch all reviews from the source (S3) ---
    const allReviews = await getProductReviews(slug);

    // --- 3. Calculate overall metrics from the complete, unfiltered dataset ---
    const averageRating = calculateAverageRating(allReviews);
    const ratingDistribution = getRatingDistribution(allReviews);

    // --- 4. Filter reviews if a rating filter is applied ---
    const filteredReviews =
      ratingFilter > 0
        ? allReviews.filter((review) => review.rating === ratingFilter)
        : allReviews;

    // --- 5. Paginate the filtered reviews on the server ---
    const totalFilteredReviews = filteredReviews.length;
    const totalPages = Math.ceil(totalFilteredReviews / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

    // --- 6. Return the paginated data and overall stats ---
    return NextResponse.json({
      success: true,
      data: {
        reviews: paginatedReviews, // Only the reviews for the current page
        totalReviews: allReviews.length, // Total unfiltered reviews for summary
        averageRating, // Overall average
        ratingDistribution, // Overall distribution
        // Pagination info based on the filtered set
        currentPage: page,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
