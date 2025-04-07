import { WixClient } from "@/context/wixContext";
import { OauthData } from "@wix/sdk";

export async function generateOAuthData(
  wixClient: WixClient,
  originPath?: string
) {
  return wixClient.auth.generateOAuthData(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback",
    process.env.NEXT_PUBLIC_BASE_URL + "/" + (originPath || "")
  );
}

export async function getLoginUrl(wixClient: WixClient, oAuthData: OauthData) {
  const { authUrl } = await wixClient.auth.getAuthUrl(oAuthData, {
    responseMode: "query",
  });

  return authUrl;
}

export async function getLogoutUrl(wixClient: WixClient) {
  const { logoutUrl } = await wixClient.auth.logout(
    process.env.NEXT_PUBLIC_BASE_URL!
  );

  return logoutUrl;
}
