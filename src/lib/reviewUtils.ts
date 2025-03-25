// lib/reviewUtils.ts

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

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
    // Define the path to the CSV file
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "reviews",
      productSlug,
      "reviews.csv"
    );

    console.log("Current working directory:", process.cwd());
    console.log("Full path being checked:", filePath);

    console.log("Attempting to read reviews from:", filePath);

    const fileExists = fs.existsSync(filePath);
    console.log("File exists:", fileExists);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.log(`No reviews found for product: ${productSlug}`);
      return [];
    }

    // Read the file
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Parse the CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Transform and validate the records based on your CSV structure
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
