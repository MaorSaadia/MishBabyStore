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

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "";

/**
 * GET reviews with pagination
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const productSlug = params.slug;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    if (!productSlug) {
      return NextResponse.json(
        { success: false, message: "Missing slug" },
        { status: 400 }
      );
    }

    const filePath = `${productSlug}/reviews.csv`;

    // Check if file exists
    try {
      await s3Client.send(
        new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: filePath })
      );
    } catch {
      return NextResponse.json({
        success: true,
        data: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          reviews: [],
        },
      });
    }

    // Fetch file from S3
    const fileResponse = await s3Client.send(
      new GetObjectCommand({ Bucket: BUCKET_NAME, Key: filePath })
    );
    const fileStream = fileResponse.Body;
    if (!fileStream) throw new Error("No file body");

    const chunks: Uint8Array[] = [];
    for await (const chunk of fileStream as any)
      chunks.push(chunk as Uint8Array);
    const fileContent = Buffer.concat(chunks).toString("utf-8");

    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Summary
    const totalReviews = records.length;
    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let totalRating = 0;

    const processedReviews = records.map((record: any) => {
      const rating = parseFloat(record.Rating) || 0;
      totalRating += rating;
      if (rating >= 1 && rating <= 5) ratingDistribution[Math.floor(rating)]++;

      return {
        id: `${record.Name}-${record["Date of Published"]}`,
        date: record["Date of Published"],
        skuInfo: record["Sku Info"],
        logistics: record.Logistics,
        voteCount: parseInt(record["Vote Count"]) || 0,
        translationReview: record["Translation Review"] || record.Review,
        isAnonymous: record["Is Anonymous"] === "TRUE",
        images: record.Images
          ? record.Images.split(",").filter((i: string) => i.trim())
          : [],
        rating,
        userName: record.Name,
        avatar: record.Avatar,
        country: record.Country,
      };
    });

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    // Pagination
    const start = (page - 1) * limit;
    const paginatedReviews = processedReviews.slice(start, start + limit);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingDistribution,
          reviews: paginatedReviews,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300", // 1 min edge cache
        },
      }
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
