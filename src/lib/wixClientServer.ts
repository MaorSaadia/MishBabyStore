import { cookies } from "next/headers";
import { OAuthStrategy, createClient } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { orders } from "@wix/ecom";
import { members } from "@wix/members";

export const wixClientServer = async () => {
  let refreshToken;

  try {
    const cookieStore = cookies();
    refreshToken = JSON.parse(cookieStore.get("refreshToken")?.value || "{}");
  } catch (e) {}

  const wixClient = createClient({
    modules: {
      products,
      collections,
      orders,
      members,
    },
    auth: refreshToken
      ? OAuthStrategy({
          clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
          tokens: {
            refreshToken,
            accessToken: { value: "", expiresAt: 0 },
          },
        })
      : undefined, // Don't use OAuth strategy if no refresh token exists
  });

  return wixClient;
};
