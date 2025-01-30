"use client";

import { createContext, ReactNode } from "react";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import Cookies from "js-cookie";

// Only get the refresh token if it exists
const refreshToken = Cookies.get("refreshToken")
  ? JSON.parse(Cookies.get("refreshToken")!)
  : null;

const wixClient = createClient({
  modules: {
    products,
    collections,
    currentCart,
    redirects,
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

export type WixClient = typeof wixClient;

export const WixClientContext = createContext<WixClient>(wixClient);

export const WixClientContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <WixClientContext.Provider value={wixClient}>
      {children}
    </WixClientContext.Provider>
  );
};
