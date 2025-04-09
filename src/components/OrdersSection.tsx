import Link from "next/link";
import { Package } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

// Helper function to format address
const formatAddress = (recipientInfo?: any): string => {
  if (!recipientInfo?.address) return "No address available";

  const address = recipientInfo.address;
  const street = address.streetAddress || {};
  const streetLine = [street.name, street.number, street.apt]
    .filter(Boolean)
    .join(" ");

  return [
    streetLine,
    address.city,
    address.postalCode,
    address.countryFullname || address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

// Helper function to format recipient info
const formatRecipient = (recipientInfo?: any): string => {
  if (!recipientInfo?.contactDetails) return "No recipient info";

  const contact = recipientInfo.contactDetails;
  return [
    [contact.firstName, contact.lastName].filter(Boolean).join(" "),
    contact.phone,
  ]
    .filter(Boolean)
    .join(" • ");
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
                      Order Number
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Shipping Address
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Recipient
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
                    const address = formatAddress(order.recipientInfo);
                    const recipient = formatRecipient(order.recipientInfo);

                    return (
                      <tr
                        key={order._id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium">
                          #{order.number}
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
                        <td className="py-4 px-4 max-w-xs truncate">
                          {address}
                        </td>
                        <td className="py-4 px-4 max-w-xs truncate">
                          {recipient}
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
                const address = formatAddress(order.recipientInfo);
                const recipient = formatRecipient(order.recipientInfo);

                return (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">#{order.number}</span>
                      <Badge variant="outline" className={`${statusColor}`}>
                        {statusLabel}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {order._createdDate
                            ? new Date(order._createdDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Shipping Address
                        </p>
                        <p className="font-medium break-words">{address}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Recipient</p>
                        <p className="font-medium">{recipient}</p>
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
            <ScrollBar orientation="horizontal" />
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
