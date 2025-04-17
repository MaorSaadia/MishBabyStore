// lib/reviewUtils.ts
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { parse } from "csv-parse/sync";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "";

export interface Review {
  id?: string;
  rating: number;
  userName: string;
  avatar?: string;
  country?: string;
  date: string;
  title?: string;
  content: string;
  verified: boolean;
  images?: string[];
  logistics?: string;
  voteCount?: number;
  translationReview?: string;
  skuInfo?: string;
}

export async function getProductReviews(
  productSlug: string
): Promise<Review[]> {
  try {
    // Define the path to the CSV file in S3
    const filePath = `${productSlug}/reviews.csv`;

    try {
      // Get the file from S3
      const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
      });

      const fileResponse = await s3Client.send(getCommand);
      const fileStream = fileResponse.Body;

      if (!fileStream) {
        console.log(`No reviews found for product: ${productSlug}`);
        return [];
      }

      // Convert stream to string
      const chunks = [];
      for await (const chunk of fileStream as any) {
        chunks.push(chunk);
      }

      const fileContent = Buffer.concat(chunks).toString("utf-8");

      // Parse the CSV content
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      // Transform and validate the records - using the exact same transformation as your original code
      const reviews: Review[] = records.map((record: any, index: number) => ({
        id: `review-${index}`,
        rating: parseInt(record.Rating, 10) || 0,
        userName: record.Name || "Anonymous",
        avatar: record.Avatar || "",
        country: record.Country || "",
        date:
          record["Date of Published"] || new Date().toISOString().split("T")[0],
        content: record.Review || "",
        translationReview: record["Translation Review"] || "",
        verified: record["Is Anonymous"] === "TRUE",
        images: record.Images
          ? record.Images.split(",").map((url: string) => url.trim())
          : [],
        logistics: record.Logistics || "",
        voteCount: parseInt(record["Vote Count"], 10) || 0,
        skuInfo: record["Sku Info"] || "",
      }));

      return reviews;
    } catch (error) {
      // Specific handling for when the file is not found or another S3 error occurs
      console.log(`No reviews found in S3 for product: ${productSlug}`);
      return [];
    }
  } catch (error) {
    console.error(`Error reading reviews for ${productSlug}:`, error);
    return [];
  }
}

export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;

  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
}

export function getRatingDistribution(
  reviews: Review[]
): Record<number, number> {
  const distribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++;
    }
  });

  return distribution;
}
