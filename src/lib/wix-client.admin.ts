import { files } from "@wix/media";
import { ApiKeyStrategy, createClient } from "@wix/sdk";
import { cache } from "react";

export const getWixAdminClient = cache(() => {
  const wixClient = createClient({
    modules: {
      files,
    },
    auth: ApiKeyStrategy({
      apiKey: process.env.WIX_API_KEY!,
      siteId: process.env.NEXT_PUBLIC_WIX_SITE_ID!,
    }),
  });

  return wixClient;
});
