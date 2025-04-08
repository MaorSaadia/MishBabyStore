/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { wixClientServer } from "@/lib/wixClientServer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Package,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Tag,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { convertWixImageToUrl } from "@/lib/utils";

const OrderPage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const wixClient = await wixClientServer();

  let order;
  try {
    order = await wixClient.orders.getOrder(id);
  } catch (err) {
    return notFound();
  }

  // console.log("order info", JSON.stringify(order, null, 2));

  // Format purchase date
  const purchaseDate = order.purchasedDate
    ? format(new Date(order.purchasedDate), "PPP 'at' p")
    : "N/A";

  function getStatusBadgeStyles(status: string) {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "APPROVED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "NOT_FULFILLED":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>

        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="border-b bg-white rounded-t-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Order #{order.number}
                </CardTitle>
                <CardDescription className="mt-1 text-gray-500">
                  <span className="flex items-center mt-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    Placed on {purchaseDate}
                  </span>
                </CardDescription>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                <Badge
                  className={`${getStatusBadgeStyles(
                    order.paymentStatus
                  )} font-medium text-xs px-3 py-1 mb-2`}
                >
                  {order.paymentStatus}
                </Badge>
                <Badge
                  className={`${getStatusBadgeStyles(
                    order.status
                  )} font-medium text-xs px-3 py-1`}
                >
                  {order.status}
                </Badge>
                <Badge
                  className={`${getStatusBadgeStyles(
                    order.fulfillmentStatus
                  )} font-medium text-xs px-3 py-1 mt-2`}
                >
                  {order.fulfillmentStatus}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Billing & Contact Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                  Shipping & Billing Information
                </h3>
                <Card className="border rounded-md">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">
                          {order.billingInfo?.contactDetails?.firstName}{" "}
                          {order.billingInfo?.contactDetails?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.billingInfo?.address?.streetAddress?.name}{" "}
                          {order.billingInfo?.address?.streetAddress?.number}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.billingInfo?.address?.city},{" "}
                          {order.billingInfo?.address?.postalCode}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.billingInfo?.address?.addressLine1}
                        </p>
                      </div>
                      <Separator />
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">
                          {order.billingInfo?.contactDetails?.phone}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">
                          {order.buyerInfo?.email}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                  Payment Information
                </h3>
                <Card className="border rounded-md">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {order.priceSummary?.subtotal?.formattedAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {order.priceSummary?.shipping?.formattedAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -{order.priceSummary?.discount?.formattedAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">
                        {order.priceSummary?.tax?.formattedAmount}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg">
                        {order.priceSummary?.total?.formattedAmount}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Paid Amount</span>
                      <span className="font-medium text-green-600">
                        {order.balanceSummary?.paid?.formattedAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining Balance</span>
                      <span className="font-medium">
                        {order.balanceSummary?.balance?.formattedAmount}
                      </span>
                    </div> */}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader className="border-b bg-white rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {order.lineItems?.map((item: any, index: number) => (
              <div key={item._id || index} className="mb-6 last:mb-0">
                <div className="flex flex-col md:flex-row gap-4">
                  {item.image && (
                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={convertWixImageToUrl(item.image) || ""}
                        alt={item.productName?.original}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h4 className="font-medium text-lg">
                      {item.productName?.original}
                    </h4>
                    <div className="mt-1 text-sm text-gray-600">
                      {item.descriptionLines?.map(
                        (desc: any, dIndex: number) => (
                          <div key={dIndex}>
                            <span className="font-medium">
                              {desc.name?.original}:
                            </span>{" "}
                            {desc.plainText?.original}
                          </div>
                        )
                      )}
                      {item.physicalProperties?.sku && (
                        <div className="mt-1 flex items-center">
                          <Tag className="mr-1 h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            SKU: {item.physicalProperties.sku}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <div className="font-medium">
                      {item.price?.formattedAmount} x {item.quantity}
                    </div>
                    {item.totalDiscount?.amount > 0 && (
                      <div className="text-sm text-green-600">
                        Discount: -{item.totalDiscount?.formattedAmount}
                      </div>
                    )}
                    <div className="font-bold mt-1">
                      {item.totalPriceAfterTax?.formattedAmount}
                    </div>
                  </div>
                </div>
                {index < order.lineItems.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader className="border-b bg-white rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-900">
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="w-full">
              {order.appliedDiscounts && order.appliedDiscounts.length > 0 && (
                <AccordionItem value="discounts">
                  <AccordionTrigger className="py-4 text-gray-900 hover:text-gray-900 hover:no-underline">
                    Applied Discounts
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 px-4">
                    {order.appliedDiscounts.map(
                      (discount: any, index: number) => (
                        <div key={index} className="mb-2 last:mb-0">
                          <div className="flex items-center">
                            <Tag className="mr-2 h-4 w-4 text-green-600" />
                            <span className="font-medium">
                              {discount.coupon?.name || "Discount"}
                            </span>
                          </div>
                          {discount.coupon?.code && (
                            <div className="text-sm text-gray-600 ml-6">
                              Code: {discount.coupon.code}
                            </div>
                          )}
                          {discount.coupon?.amount && (
                            <div className="text-sm text-green-600 ml-6">
                              Amount: {discount.coupon.amount.formattedAmount}
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="shipping">
                <AccordionTrigger className="py-4 text-gray-900 hover:text-gray-900 hover:no-underline">
                  Shipping Details
                </AccordionTrigger>
                <AccordionContent className="pb-4 px-4">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Method:</span>{" "}
                      {order.shippingInfo?.title || "Standard Shipping"}
                    </div>
                    {order.shippingInfo?.region?.name && (
                      <div>
                        <span className="font-medium">Region:</span>{" "}
                        {order.shippingInfo.region.name}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Cost:</span>{" "}
                      {order.shippingInfo?.cost?.price?.formattedAmount ||
                        "Free"}
                    </div>
                    <div className="flex items-center mt-2">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 font-medium">
                        {order.fulfillmentStatus}
                      </Badge>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment">
                <AccordionTrigger className="py-4 text-gray-900 hover:text-gray-900 hover:no-underline">
                  Payment Details
                </AccordionTrigger>
                <AccordionContent className="pb-4 px-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      {order.paymentStatus === "PAID" ? (
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="mr-2 h-4 w-4 text-yellow-600" />
                      )}
                      <span className="font-medium">
                        Status:{" "}
                        <span
                          className={
                            order.paymentStatus === "PAID"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }
                        >
                          {order.paymentStatus}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Currency:</span>{" "}
                      {order.currency}
                    </div>
                    <div>
                      <span className="font-medium">Payment Method:</span>{" "}
                      Credit Card
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-gray-900">
                  Need Help With Your Order?
                </h3>
                <p className="text-gray-600">
                  Our customer service team is ready to assist you
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" className="bg-white">
                  <Link href="/order-tracking">
                    <Clock className="mr-2 h-4 w-4" />
                    Track Order
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/customer-service">Contact Support</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderPage;
