import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Helper function to get status badge color
const getStatusColor = (
  status?: string,
  paymentStatus?: string,
  fulfillmentStatus?: string
): string => {
  if (paymentStatus === "PAID" && fulfillmentStatus === "FULFILLED")
    return "bg-green-50 text-green-700 border-green-200";
  if (paymentStatus === "PAID" && fulfillmentStatus === "NOT_FULFILLED")
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "APPROVED")
    return "bg-green-50 text-green-700 border-green-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
};

// Helper function to get status label
const getStatusLabel = (
  status?: string,
  paymentStatus?: string,
  fulfillmentStatus?: string
): string => {
  if (paymentStatus === "PAID" && fulfillmentStatus === "FULFILLED")
    return "Completed";
  if (paymentStatus === "PAID" && fulfillmentStatus === "NOT_FULFILLED")
    return "Processing";
  if (status === "APPROVED") return "Approved";
  return status || "Processing";
};

// @ts-ignore
const OrdersSection = ({ orders }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package size={18} />
          Order History
        </CardTitle>
        <CardDescription>
          View and track all your previous orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <ScrollArea className="h-[500px]">
            {/* Desktop view - only visible on md screens and above */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Discount
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Total Price
                    </th>
                    <th className="text-right py-3 px-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => {
                    const statusColor = getStatusColor(
                      order.status,
                      order.paymentStatus,
                      order.fulfillmentStatus
                    );
                    const statusLabel = getStatusLabel(
                      order.status,
                      order.paymentStatus,
                      order.fulfillmentStatus
                    );
                    const hasDiscount =
                      Number(order.priceSummary?.discount?.amount) > 0;
                    const couponCode =
                      order.appliedDiscounts?.[0]?.coupon?.code;

                    return (
                      <tr
                        key={order._id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium">
                          {order.number}
                        </td>
                        <td className="py-4 px-4">
                          {order._createdDate
                            ? new Date(order._createdDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className={`${statusColor}`}>
                            {statusLabel}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          $
                          {Number(
                            order.priceSummary?.subtotal?.amount
                          )?.toFixed(2) || "0.00"}
                        </td>
                        <td className="py-4 px-4">
                          {hasDiscount ? (
                            <div className="flex flex-col">
                              <span className="text-green-600 font-medium">
                                -$
                                {Number(
                                  order.priceSummary?.discount?.amount
                                )?.toFixed(2)}
                              </span>
                              {couponCode && (
                                <span className="text-xs text-gray-500">
                                  {couponCode}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          $
                          {Number(
                            order.priceSummary?.totalPrice?.amount
                          )?.toFixed(2) || "0.00"}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/orders/${order._id}`}>Details</Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile view - only visible on small screens */}
            <div className="md:hidden space-y-4">
              {orders.map((order: any) => {
                const statusColor = getStatusColor(
                  order.status,
                  order.paymentStatus,
                  order.fulfillmentStatus
                );
                const statusLabel = getStatusLabel(
                  order.status,
                  order.paymentStatus,
                  order.fulfillmentStatus
                );
                const hasDiscount =
                  Number(order.priceSummary?.discount?.amount) > 0;

                return (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">#{order.number}</span>
                      <Badge variant="outline" className={`${statusColor}`}>
                        {statusLabel}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {order._createdDate
                            ? new Date(order._createdDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          $
                          {Number(
                            order.priceSummary?.subtotal?.amount
                          )?.toFixed(2) || "0.00"}
                        </p>
                      </div>

                      {hasDiscount && (
                        <div>
                          <p className="text-muted-foreground">Discount</p>
                          <p className="font-medium text-green-600">
                            -$
                            {Number(
                              order.priceSummary?.discount?.amount
                            )?.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Price</p>
                      <p className="font-medium">
                        $
                        {Number(
                          order.priceSummary?.totalPrice?.amount
                        )?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                    >
                      <Link href={`/orders/${order._id}`}>View Details</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven&apos;t placed any orders yet.
            </p>
            <Button asChild>
              <Link href="/list?cat=all-products">Start Shopping</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersSection;
