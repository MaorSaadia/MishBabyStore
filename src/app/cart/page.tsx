/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, ShoppingBag, Trash, Trash2 } from "lucide-react";
import { media as wixMedia } from "@wix/sdk";
import { currentCart } from "@wix/ecom";

import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useScreenSize from "@/hooks/useScreenSize";

const ViewCartPage = () => {
  const wixClient = useWixClient();
  const router = useRouter();
  const isLargeScreen = useScreenSize();
  const { cart, isLoading, removeItem, updateItemQuantity } = useCartStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleCheckout = async () => {
    try {
      const checkout =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: currentCart.ChannelType.WEB,
        });

      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId },
          // callbacks: {
          //   postFlowUrl: window.location.origin,
          //   thankYouPageUrl: `${window.location.origin}/success`,
          // },
        });

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateItemQuantity(wixClient, itemId, newQuantity);
    }
  };

  //@ts-ignore
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      //@ts-ignore
      removeItem(wixClient, itemToDelete._id);
    }
    setIsDeleteDialogOpen(false);
  };

  if (!cart || !cart.lineItems || cart.lineItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <ShoppingBag className="h-4 w-4" />
          <AlertDescription>
            Your cart is empty. Start shopping to add items to your cart!
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.lineItems.map((item) => (
            <Card key={item._id} className="mb-4">
              <CardContent className="p-2">
                <div className="flex gap-3">
                  {item.image && (
                    <img
                      src={wixMedia.getScaledToFillImageUrl(
                        item.image,
                        180,
                        180,
                        {}
                      )}
                      alt={item.productName?.original || ""}
                      width={isLargeScreen ? 180 : 80}
                      height={isLargeScreen ? 180 : 80}
                      className="rounded-md cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/${item.productName?.original
                            ?.toLowerCase()
                            .replace(/\s+/g, "-")}`
                        )
                      }
                    />
                  )}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm md:text-lg font-semibold">
                        {item.productName?.original}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(item)}
                        disabled={isLoading}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      {item.availability?.status}
                    </p>
                    {item.descriptionLines?.map((desc, index) => (
                      <p
                        key={index}
                        className="text-xs md:text-sm text-gray-600 mt-1"
                      >
                        {desc.name?.original}:{" "}
                        {desc.plainText?.original || desc.colorInfo?.original}
                      </p>
                    ))}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(
                              item._id!,
                              (item.quantity || 1) - 1
                            )
                          }
                          disabled={isLoading || (item.quantity || 0) <= 1}
                        >
                          <Minus size={8} />
                        </Button>
                        <span className="px-1">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(
                              item._id!,
                              (item.quantity || 1) + 1
                            )
                          }
                          disabled={isLoading}
                        >
                          <Plus size={8} />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-md md:text-lg">
                          $
                          {(
                            Number(item.priceBeforeDiscounts?.amount ?? 0) *
                            (item.quantity || 1)
                          ).toFixed(2)}
                        </p>
                        {item.fullPrice?.amount !==
                          item.priceBeforeDiscounts?.amount && (
                          <p className="text-xs md:text-sm">
                            <span className="line-through text-gray-500 mr-2">
                              $
                              {(
                                Number(item?.fullPrice?.amount ?? 0) *
                                (item.quantity || 1)
                              ).toFixed(2)}
                            </span>

                            <span className="text-rose-600">
                              Save $
                              {(
                                (Number(item.fullPrice?.amount ?? 0) -
                                  Number(
                                    item.priceBeforeDiscounts?.amount ?? 0
                                  )) *
                                (item.quantity || 1)
                              ).toFixed(2)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                {
                  // @ts-ignore
                  <span>${cart.subtotal?.amount}</span>
                }
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-4">
                <span>Total</span>
                {
                  // @ts-ignore
                  <span>${cart.subtotal?.amount}</span>
                }
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Tax included in the price.
              </p>
              <Button
                className="w-full mt-6"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the item from your cart. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ViewCartPage;
