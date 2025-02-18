"use client";

import { useState, FormEvent } from "react";
import { Send, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormData {
  customerEmail: string;
  discountCode: string;
  cartUrl: string;
}

const AbandonedCartEmailForm = () => {
  const [formData, setFormData] = useState<FormData>({
    customerEmail: "",
    discountCode: "",
    cartUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/emails/abandoned-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      toast.success("Recovery email sent successfully!");
      setFormData({
        customerEmail: "",
        discountCode: "",
        cartUrl: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <ShoppingCart className="mx-auto h-12 w-12 text-cyan-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">
            Send Abandoned Cart Recovery Email
          </h1>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white p-6 rounded-t-xl">
            <h2 className="text-xl font-semibold">Recovery Email Details</h2>
            <p className="text-cyan-50">
              Send a special discount to encourage cart completion
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email
                </label>
                <Input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  className="h-12"
                  placeholder="customer@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Code
                </label>
                <Input
                  type="text"
                  value={formData.discountCode}
                  onChange={(e) =>
                    setFormData({ ...formData, discountCode: e.target.value })
                  }
                  className="h-12"
                  placeholder="WELCOME10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cart URL
                </label>
                <Input
                  type="url"
                  value={formData.cartUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, cartUrl: e.target.value })
                  }
                  className="h-12"
                  placeholder="https://your-store.com/cart/..."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Recovery Email
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AbandonedCartEmailForm;
