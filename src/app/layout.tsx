import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import { WixClientContextProvider } from "@/context/wixContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import ResetPasswordModal from "@/components/modals/ResetPasswordModal";
import ToastProvider from "@/providers/ToastProvider";

import "./globals.css";
import PromoBanner from "@/components/PromoBanner";
import FreeShippingBanner from "@/components/FreeShippingBanner";

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
          {/* <Suspense  fallback={<div className="h-8 w-8 bg-gray-200 rounded-full" />}>
            <PageLoader />
          </Suspense> */}
          {/* <Analytics /> */}
          {/* <ShippingBanner /> */}
          <PromoBanner />
          <LoginModal />
          <RegisterModal />
          <ResetPasswordModal />
          <ToastProvider />
          <Navbar />
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
