import fs from "fs";
import path from "path";
import { stringify } from "csv-stringify/sync";
import { NextRequest, NextResponse } from "next/server";

import { formatDate } from "@/lib/utils";

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

    // Define the path to the CSV file
    const directoryPath = path.join(
      process.cwd(),
      "src",
      "data",
      "reviews",
      productSlug
    );

    // Ensure directory exists
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const filePath = path.join(directoryPath, "reviews.csv");

    // Define headers to match your existing CSV structure
    const headers = [
      "Country",
      "Avatar",
      "Name",
      "Rating",
      "Images",
      "Is Anonymous",
      "Review",
      "Translation Review",
      "Vote Count",
      "Logistics",
      "Sku Info",
      "Date of Published",
    ];

    // If the file does not exist, create it with headers
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, stringify([headers], { header: false }));
    }

    // Convert the images array to a pipe-separated string
    const imagesString =
      review.images && review.images.length > 0 ? review.images.join("|") : "";

    // Build the row in the same order as the headers
    const csvRow = [
      "", // Country
      "", // Avatar
      review.userName || "", // Name
      review.rating || "", // Rating
      imagesString, // Images (pipe-separated URLs)
      review.userName === "Anonymous" ? "TRUE" : "FALSE", // Is Anonymous
      review.content || "", // Review content
      "", // Translation Review
      0, // Vote Count
      "", // Logistics
      "", // Sku Info
      review.date || formatDate(new Date()),
    ];

    // Append the new row
    fs.appendFileSync(filePath, stringify([csvRow], { header: false }));

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
      },
      { status: 500 }
    );
  }
}
