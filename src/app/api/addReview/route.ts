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

    // Define the path to the CSV file in S3
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
      review.images && review.images.length > 0 ? review.images.join(",") : "";

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
      // Get existing file
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

      // Parse existing CSV with the exact header names
      const records = parse(fileContent, {
        columns: true, // This will use the first row as column names
        skip_empty_lines: true,
      });

      // Append new row
      records.push(newRowObj);

      // Convert back to CSV, using the same headers from the file
      const updatedCsv = stringify(records, {
        header: true,
        columns: headers, // Use the same order of columns
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
    } else {
      // Create new file with headers - make one row with the object
      const csvContent = stringify([newRowObj], {
        header: true,
        columns: headers, // Force the specific column order
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
