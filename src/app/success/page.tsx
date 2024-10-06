"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const SuccessPage = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Get the orderId from the URL on the client side
    const searchParams = new URLSearchParams(window.location.search);
    const orderIdFromUrl = searchParams.get("orderId");
    setOrderId(orderIdFromUrl);

    if (!orderIdFromUrl) return;

    const timer = setTimeout(() => {
      router.push("/orders/" + orderIdFromUrl);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-[calc(100vh-180px)]">
      <Confetti width={2000} height={1000} />
      <h1 className="text-6xl text-green-600">Successful</h1>
      <h2 className="text-xl font-medium">
        We sent the invoice to your e-mail
      </h2>
      <h3 className="">You are being redirected to the order page...</h3>
    </div>
  );
};

export default SuccessPage;
