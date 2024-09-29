import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { WixClientContextProvider } from "@/context/wixContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import "./globals.css";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import ResetPasswordModal from "@/components/modals/ResetPasswordModal";
import ToastProvider from "@/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MishBaby",
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
          <LoginModal />
          <RegisterModal />
          <ResetPasswordModal />
          <ToastProvider />
          <Navbar />
          {children}
          <Footer />
        </WixClientContextProvider>
      </body>
    </html>
  );
}
