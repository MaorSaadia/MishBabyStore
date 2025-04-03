// import { getWixAdminClient } from "@/lib/wix-client.server";
import { getWixAdminClient } from "@/lib/wix-client.admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileName = searchParams.get("fileName");
    const mimeType = searchParams.get("mimeType");
    const productSlug = searchParams.get("productSlug");

    if (!fileName || !mimeType || !productSlug) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const wixClient = getWixAdminClient();
    const uniqueFileName = `${Date.now()}_${fileName}`;
    const folderPath = `/Reviews/${productSlug}`;
    const storagePath = `${folderPath}/${uniqueFileName}`;

    const uploadUrlResponse = await wixClient.files.generateFileUploadUrl(
      mimeType,
      {
        fileName: uniqueFileName,
        filePath: folderPath,
        private: false,
      }
    );

    return NextResponse.json({
      success: true,
      uploadUrl: uploadUrlResponse.uploadUrl,
      storagePath,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
