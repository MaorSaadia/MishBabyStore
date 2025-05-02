import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

import { WixClientContextProvider } from "@/context/wixContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import ResetPasswordModal from "@/components/modals/ResetPasswordModal";
import PromoBanner from "@/components/PromoBanner";
import ToastProvider from "@/providers/ToastProvider";

import "./globals.css";
import { Info } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const viewport = "width=device-width, initial-scale=1";

export const metadata: Metadata = {
  title: {
    template: "%s | MishBaby",
    absolute: "MishBaby",
  },
  description:
    "Premium baby products, toys, clothing, and accessories. Shop our curated collection of safe and high-quality items for your little ones.",
  keywords:
    "baby store, baby products, baby clothes, baby toys, baby accessories",
  alternates: {
    canonical: "https://www.mishbaby.com",
  },
  verification: {
    google: "Oxr0dTqwTA6RsfU0Z2PurQ_CNXOpZeDq-WfL-YTv0Ms",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "MishBaby - Baby Products Store",
    description: "Premium baby products, toys, clothing, and accessories",
    url: "https://www.mishbaby.com",
    siteName: "MishBaby",
    images: [
      {
        url: "https://www.mishbaby.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MishBaby - Baby Products Store",
    description: "Premium baby products, toys, clothing, and accessories",
    images: ["https://www.mishbaby.com/twitter-image.png"],
  },
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
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="7e575a4d-d8b0-4ff1-9600-11b31543ae15"
            strategy="beforeInteractive"
          />

          <Analytics />
          <LoginModal />
          <RegisterModal />
          <ResetPasswordModal />
          <ToastProvider />
          {/* <PromoBanner /> */}
          <Navbar />
          {/* Shipping Notice Banner */}
          <div className="bg-rose-200 py-3 text-center mb-2 shadow-md">
            <div className="container mx-auto px-4 flex items-center justify-center">
              <Info className="w-12 h-12 sm:w-5 sm:h-5 text-cyan-600 mr-2" />
              <p className="text-sm text-gray-700">
                Free shipping to most countries!
                <span className="font-medium"> $14.99 shipping to US</span> due
                to recent tariff changes.
                <Link
                  href="/shipping-restrictions"
                  className="ml-1 text-cyan-600 hover:underline"
                >
                  Learn more
                </Link>
              </p>
            </div>
          </div>
          {children}
          <Footer />
          <div id="portal"></div>
        </WixClientContextProvider>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              name: "MishBaby",
              description: "Premium baby products store",
              url: "https://www.mishbaby.com",
              priceRange: "$$",
              image: "https://www.mishbaby.com/og-image.png",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://www.mishbaby.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
              sameAs: [
                // Add your social media URLs here
                "https://www.tiktok.com/@mishbaby_shop",
                "https://www.instagram.com/mishbabystore",
                "https://www.youtube.com/@mishBaby-shop",
                "https://www.facebook.com/profile.php?id=61567086625746",
                "https://www.pinterest.com/mishbabys",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
