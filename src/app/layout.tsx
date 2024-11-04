import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { WixClientContextProvider } from "@/context/wixContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import ResetPasswordModal from "@/components/modals/ResetPasswordModal";
import PromoBanner from "@/components/PromoBanner";
import GiveawayAnnouncement, {
  GiveawayProvider,
} from "@/components/GiveawayAnnouncement";
import ToastProvider from "@/providers/ToastProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | MishBaby",
    absolute: "MishBaby",
  },
  description: "MishBaby Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WixClientContextProvider>
          <GiveawayProvider>
            <Analytics />
            <LoginModal />
            <RegisterModal />
            <ResetPasswordModal />
            <ToastProvider />
            <PromoBanner />
            <GiveawayAnnouncement />
            <Navbar />
            {children}
            <Footer />
            <div id="portal"></div>
          </GiveawayProvider>
        </WixClientContextProvider>
      </body>
    </html>
  );
}
