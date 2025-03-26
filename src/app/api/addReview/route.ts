import fs from "fs";
import path from "path";
import { stringify } from "csv-stringify/sync";
import { NextRequest, NextResponse } from "next/server";

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

    // Make sure the headers match exactly the columns in the correct order
    // (based on your screenshot)
    const headers = [
      "Date of Published",
      "Sku Info",
      "Logistics",
      "Vote Count",
      "Translation Review",
      "Review",
      "Is Anonymous",
      "Images",
      "Rating",
      "Name",
      "Avatar",
      "Country",
    ];

    // If the file does not exist, create it with headers
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, stringify([headers], { header: false }));
    }

    // Build the row in the same order as the headers
    const csvRow = [
      // 1) Date of Published
      review.date || new Date().toLocaleDateString("en-CA"),
      // 2) Sku Info
      review.skuInfo || "",
      // 3) Logistics
      review.logistics || "",
      // 4) Vote Count
      review.voteCount || 0,
      // 5) Translation Review
      review.translationReview || "",
      // 6) Review
      review.content || "",
      // 7) Is Anonymous
      review.isAnonymous ? "TRUE" : "FALSE",
      // 8) Images
      review.images ? review.images.join(",") : "",
      // 9) Rating
      review.rating || "",
      // 10) Name
      review.userName || "",
      // 11) Avatar
      review.avatar || "",
      // 12) Country
      review.country || "",
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
