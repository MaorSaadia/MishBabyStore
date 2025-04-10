import { NextRequest, NextResponse } from "next/server";
import { OAuthStrategy, createClient } from "@wix/sdk";

export const middleware = async (request: NextRequest) => {
  const cookies = request.cookies;
  const res = NextResponse.next();

  if (cookies.get("refreshToken")) {
    return res;
  }

  const wixClient = createClient({
    auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
  });

  const tokens = await wixClient.auth.generateVisitorTokens();
  res.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
};

// Add this config export at the bottom of the same file
export const config = {
  matcher: [
    // Add only the paths that need Wix authentication
    // Excludes static files, API routes, etc.
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
