"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Search, ArrowRight, TruckIcon } from "lucide-react";

const TrackingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    // Redirect to Cainiao tracking page
    window.open(
      `https://global.cainiao.com/newDetail.htm?mailNoList=${trackingNumber}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-36 mr-2 px-6 sm:px-6 lg:px-8 -mb-14">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-xl shadow-cyan-100">
          <CardHeader className="text-center py-8">
            <div className="mx-auto w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-cyan-500" />
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
              Track Your Order
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Enter your tracking number to see the latest delivery status
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                    setError("");
                  }}
                  className={`pl-12 h-16 text-lg ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              </div>
              {error && <p className="text-red-500 text-base mt-2">{error}</p>}
              <Button
                type="submit"
                className="w-full h-16 bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center space-x-3 text-lg"
              >
                <span>Track Package</span>
                <ArrowRight className="w-6 h-6" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-base text-gray-500">
            <TruckIcon className="mr-1 text-cyan-500" /> Track your package
            delivery status anytime, anywhere.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TrackingPage;
