// app/order-tracking/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Order",
  description:
    "Track your package delivery status in real-time. Get instant updates on your shipment location and estimated delivery time.",
  keywords:
    "order tracking, package tracking, shipping status, delivery tracking, track shipment",
  openGraph: {
    title: "Track Order",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
