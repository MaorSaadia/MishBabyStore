// app/orders/page.jsx
import Link from "next/link";
import { members } from "@wix/members";
import { format } from "timeago.js";
import { ShoppingBag, CreditCard } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { wixClientServer } from "@/lib/wixClientServer";
import OrdersSection from "@/components/OrdersSection";

const OrdersPage = async () => {
  const wixClient = await wixClientServer();
  let user;

  try {
    user = await wixClient.members.getCurrentMember({
      fieldsets: [members.Set.FULL],
    });

    if (!user?.member?.contactId) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <div className="text-3xl font-bold text-gray-800">
            Please log in to view your orders
          </div>
          <Button asChild className="mt-4">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      );
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-3xl font-bold text-red-500">
          Unable to load orders
        </div>
        <p className="text-gray-600">
          Please try again later or contact support
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    );
  }

  const orderRes = await wixClient.orders.searchOrders({
    search: {
      filter: { "buyerInfo.contactId": { $eq: user?.member?.contactId } },
    },
  });

  // Calculate order stats
  const totalOrders = orderRes.orders.length;
  const totalSpent = orderRes.orders
    .reduce(
      (sum, order) => sum + (Number(order.priceSummary?.subtotal?.amount) || 0),
      0
    )
    .toFixed(2);

  // Get recent orders (last 5)
  const recentOrders = orderRes.orders
    .sort(
      (a, b) =>
        new Date(b._createdDate || 0).getTime() -
        new Date(a._createdDate || 0).getTime()
    )
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Button asChild variant="outline">
          <Link href="/profile">Back to Profile</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag size={18} />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">{totalOrders}</span>
                <span className="text-sm text-muted-foreground">
                  Total Orders
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">${totalSpent}</span>
                <span className="text-sm text-muted-foreground">
                  Total Spent
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <OrdersSection orders={orderRes.orders} />

      {recentOrders.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={18} />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Your most recent orders and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={order._id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {order.status}
                        </Badge>
                        <span className="text-sm font-medium">
                          Order #{order.number}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order._createdDate
                          ? format(order._createdDate)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        $
                        {Number(order.priceSummary?.subtotal?.amount)?.toFixed(
                          2
                        ) || "0.00"}
                      </div>
                      <Button
                        asChild
                        variant="link"
                        size="sm"
                        className="h-auto p-0"
                      >
                        <Link href={`/orders/${order._id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrdersPage;
