import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";
import { formatDate } from "@/lib/utils";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "";

// Cache for parsed CSV data to avoid re-parsing on every request
const csvCache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedCSVData(filePath: string): Promise<any[]> {
  const cacheKey = filePath;
  const cached = csvCache.get(cacheKey);

  // Return cached data if it's still fresh
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Get the file from S3
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
    });

    const fileResponse = await s3Client.send(getCommand);
    const fileStream = fileResponse.Body;

    if (!fileStream) {
      throw new Error("Failed to read file stream");
    }

    const chunks = [];
    for await (const chunk of fileStream as any) {
      chunks.push(chunk);
    }

    const fileContent = Buffer.concat(chunks).toString("utf-8");

    // Parse the CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Cache the parsed data
    csvCache.set(cacheKey, {
      data: records,
      timestamp: Date.now(),
    });

    return records;
  } catch (error) {
    // Clear cache on error
    csvCache.delete(cacheKey);
    throw error;
  }
}

function processReviews(records: any[]): any[] {
  return records.map((record: any) => {
    const rating = parseFloat(record.Rating) || 0;

    return {
      id: `${record.Name}-${record["Date of Published"]}-${Date.now()}`, // More unique ID
      date: record["Date of Published"],
      skuInfo: record["Sku Info"],
      logistics: record.Logistics,
      voteCount: parseInt(record["Vote Count"]) || 0,
      translationReview: record["Translation Review"] || record.Review,
      isAnonymous: record["Is Anonymous"] === "TRUE",
      images: record.Images
        ? record.Images.split(",")
            .map((img: string) => img.trim())
            .filter((img: string) => img.length > 0)
        : [],
      rating: rating,
      userName: record.Name,
      avatar: record.Avatar,
      country: record.Country,
    };
  });
}

function calculateSummaryStats(reviews: any[]) {
  const totalReviews = reviews.length;
  let totalRating = 0;
  const ratingDistribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((review) => {
    const rating = review.rating;
    totalRating += rating;

    // Count rating distribution
    if (rating >= 1 && rating <= 5) {
      ratingDistribution[Math.floor(rating)]++;
    }
  });

  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
  };
}

// GET handler for fetching review summary with pagination
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const productSlug = params.slug;

    if (!productSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing product slug",
        },
        { status: 400 }
      );
    }

    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const ratingFilter = searchParams.get("rating")
      ? parseInt(searchParams.get("rating")!)
      : null;

    // Define the path to the CSV file in S3
    const filePath = `${productSlug}/reviews.csv`;

    // Check if file exists
    let fileExists = false;
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filePath,
        })
      );
      fileExists = true;
    } catch (error) {
      fileExists = false;
    }

    if (!fileExists) {
      return NextResponse.json({
        success: true,
        data: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          reviews: [],
          currentPage: 1,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    }

    // Get the file from S3
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
    });

    const fileResponse = await s3Client.send(getCommand);
    const fileStream = fileResponse.Body;

    if (!fileStream) {
      throw new Error("Failed to read file stream");
    }

    const chunks = [];
    for await (const chunk of fileStream as any) {
      chunks.push(chunk);
    }

    const fileContent = Buffer.concat(chunks).toString("utf-8");

    // Parse the CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Calculate summary statistics from all reviews
    const totalReviews = records.length;
    let totalRating = 0;
    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    const processedReviews = records.map((record: any) => {
      const rating = parseFloat(record.Rating) || 0;
      totalRating += rating;

      // Count rating distribution
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[Math.floor(rating)]++;
      }

      return {
        id: `${record.Name}-${record["Date of Published"]}-${Math.random()}`, // More unique ID
        date: record["Date of Published"],
        skuInfo: record["Sku Info"],
        logistics: record.Logistics,
        voteCount: parseInt(record["Vote Count"]) || 0,
        translationReview: record["Translation Review"] || record.Review,
        isAnonymous: record["Is Anonymous"] === "TRUE",
        images: record.Images
          ? record.Images.split(",").filter((img: string) => img.trim())
          : [],
        rating: rating,
        userName: record.Name,
        avatar: record.Avatar,
        country: record.Country,
      };
    });

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    // Apply rating filter if specified
    let filteredReviews = processedReviews;
    if (ratingFilter && ratingFilter >= 1 && ratingFilter <= 5) {
      filteredReviews = processedReviews.filter(
        (review: { rating: number }) =>
          Math.floor(review.rating) === ratingFilter
      );
    }

    // Sort reviews by date (newest first) - you can adjust this sorting
    filteredReviews.sort(
      (
        a: { date: string | number | Date },
        b: { date: string | number | Date }
      ) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Newest first
      }
    );

    // Calculate pagination
    const totalFilteredReviews = filteredReviews.length;
    const totalPages = Math.ceil(totalFilteredReviews / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        reviews: paginatedReviews,
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST handler for adding reviews
export async function POST(request: NextRequest) {
  try {
    const { productSlug, review } = await request.json();

    // Validate inputs
    if (!productSlug || !review) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing productSlug or review data",
        },
        { status: 400 }
      );
    }

    // Validate review data
    const requiredFields = ["content", "rating", "userName"];
    const missingFields = requiredFields.filter((field) => !review[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate rating
    if (review.rating < 1 || review.rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    const filePath = `${productSlug}/reviews.csv`;

    // Define headers - keep these exactly as they are in your existing CSV
    const headers = [
      "Date of Published",
      "Sku Info",
      "Logistics",
      "Vote Count",
      "Translation Review",
      "Is Anonymous",
      "Images",
      "Rating",
      "Name",
      "Avatar",
      "Country",
      "Review",
    ];

    // Convert the images array to a comma-separated string
    const imagesString =
      review.images && review.images.length > 0
        ? review.images.filter((img: string) => img && img.trim()).join(",")
        : "";

    // Build the row as an object with keys matching the headers
    const newRowObj = {
      "Date of Published": review.date || formatDate(new Date()),
      "Sku Info": review.skuInfo || "",
      Logistics: review.logistics || "",
      "Vote Count": "0",
      "Translation Review": review.content || "",
      "Is Anonymous": review.userName === "Anonymous" ? "TRUE" : "FALSE",
      Images: imagesString,
      Rating: review.rating?.toString() || "0",
      Name: review.userName || "Anonymous",
      Avatar: review.avatar || "",
      Country: review.country || "",
      Review: review.content || "",
    };

    // Check if file exists
    let fileExists = false;
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filePath,
        })
      );
      fileExists = true;
    } catch (error) {
      fileExists = false;
    }

    if (fileExists) {
      // Get existing file data (use cache if available)
      try {
        const records = await getCachedCSVData(filePath);

        // Append new row
        records.push(newRowObj);

        // Convert back to CSV
        const updatedCsv = stringify(records, {
          header: true,
          columns: headers,
        });

        // Write updated CSV back to S3
        await s3Client.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filePath,
            Body: updatedCsv,
            ContentType: "text/csv",
          })
        );
      } catch (cacheError) {
        // If cache fails, fall back to direct file read
        const getCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filePath,
        });

        const fileResponse = await s3Client.send(getCommand);
        const fileStream = fileResponse.Body;

        if (!fileStream) {
          throw new Error("Failed to read file stream");
        }

        const chunks = [];
        for await (const chunk of fileStream as any) {
          chunks.push(chunk);
        }

        const fileContent = Buffer.concat(chunks).toString("utf-8");
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
        });

        records.push(newRowObj);

        const updatedCsv = stringify(records, {
          header: true,
          columns: headers,
        });

        await s3Client.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filePath,
            Body: updatedCsv,
            ContentType: "text/csv",
          })
        );
      }
    } else {
      // Create new file
      const csvContent = stringify([newRowObj], {
        header: true,
        columns: headers,
      });

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filePath,
          Body: csvContent,
          ContentType: "text/csv",
        })
      );
    }

    // Clear cache after successful write
    csvCache.delete(filePath);

    return NextResponse.json(
      {
        success: true,
        message: "Review added successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error writing review:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to write review",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
