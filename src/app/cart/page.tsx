/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Trash2, Tag } from "lucide-react";
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
import SuggestedProducts from "@/components/SuggestedProducts";

// Define types for cart items and discounts
type CartItem = {
  _id: string;
  rootCatalogItemId: string;
  productName?: { original: string };
  image?: string;
  quantity?: number;
  price?: { amount?: number };
  fullPrice?: { amount?: number };
  priceBeforeDiscounts?: { amount?: number };
  availability?: { status?: string };
  descriptionLines?: Array<{
    name?: { original: string };
    plainText?: { original: string };
    colorInfo?: { original: string };
  }>;
};

type DiscountRule = {
  name: { original: string };
  amount: { amount: number };
};

type AppliedDiscount = {
  lineItemIds?: string[];
  discountRule: DiscountRule;
};

type Cart = {
  contactInfo: any;
  lineItems?: CartItem[];
  appliedDiscounts?: AppliedDiscount[];
  subtotal?: { amount?: number };
  discount?: { amount?: number };
};

const ViewCartPage = () => {
  const wixClient = useWixClient();
  const router = useRouter();
  const isLargeScreen = useScreenSize();
  const { cart, isLoading, removeItem, updateItemQuantity } =
    useCartStore() as {
      cart: Cart;
      isLoading: boolean;
      removeItem: (client: any, id: string) => void;
      updateItemQuantity: (client: any, id: string, qty: number) => void;
    };
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);

  // Fetch suggested products from "bundle-deals" category
  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        const response = await wixClient.products
          .queryProducts()
          .hasSome("collectionIds", ["4453646d-6f62-1925-d9cc-a6297010b276"])
          .limit(6)
          .find();
        setSuggestedProducts(response.items);
      } catch (error) {
        console.error("Failed to fetch suggested products:", error);
      }
    };
    fetchSuggestedProducts();
  }, [wixClient]);

  // Group applied discounts by product ID for easy access
  const discountsByProduct: { [key: string]: DiscountRule } = {};
  cart?.appliedDiscounts?.forEach((discount) => {
    if (discount.lineItemIds && discount.lineItemIds.length > 0) {
      discount.lineItemIds.forEach((lineItemId) => {
        discountsByProduct[lineItemId] = discount.discountRule;
      });
    }
  });

  // Group items by product ID to show combined discounts
  const productGroups: {
    [productId: string]: {
      items: CartItem[];
      totalQuantity: number;
      productName?: string;
    };
  } = {};
  cart?.lineItems?.forEach((item) => {
    const productId = item.rootCatalogItemId;
    if (!productGroups[productId]) {
      productGroups[productId] = {
        items: [],
        totalQuantity: 0,
        productName: item.productName?.original,
      };
    }
    productGroups[productId].items.push(item);
    productGroups[productId].totalQuantity += item.quantity || 0;
  });

  const handleCheckout = async () => {
    try {
      const checkout =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: currentCart.ChannelType.WEB,
        });
      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId },
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

  const handleDeleteClick = (item: CartItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeItem(wixClient, itemToDelete._id);
    }
    setIsDeleteDialogOpen(false);
  };

  const getDiscountInfo = (productId: string) => {
    const items = productGroups[productId]?.items || [];
    for (const item of items) {
      if (discountsByProduct[item._id]) {
        return discountsByProduct[item._id];
      }
    }
    return null;
  };

  const calculateTotalSavings = (productId: string) => {
    const items = productGroups[productId]?.items || [];
    let totalSavings = 0;
    items.forEach((item) => {
      const discount = discountsByProduct[item._id];
      if (discount) {
        totalSavings += Number(discount.amount.amount || 0);
      }
    });
    return totalSavings.toFixed(2);
  };

  const calculateOriginalSubtotal = () => {
    if (!cart || !cart.lineItems) return 0;
    let originalSubtotal = 0;

    cart.lineItems.forEach((item) => {
      // Use priceBeforeDiscounts if available and there's a promotional discount,
      // otherwise use fullPrice
      const hasPromotionalDiscount = discountsByProduct[item._id];
      const basePrice = hasPromotionalDiscount
        ? Number(item.fullPrice?.amount || 0)
        : Number(item.fullPrice?.amount || 0);

      originalSubtotal += basePrice * (item.quantity || 1);
    });

    return originalSubtotal.toFixed(2);
  };

  const calculateItemDiscounts = () => {
    if (!cart || !cart.lineItems) return 0;
    let itemDiscounts = 0;

    cart.lineItems.forEach((item) => {
      // Only show item discount if the item has a promotional discount applied
      // AND there's an actual price difference that's NOT from promotional discounts
      const hasPromotionalDiscount = discountsByProduct[item._id];
      const fullPrice = Number(item.fullPrice?.amount || 0);
      const priceBeforeDiscounts = Number(
        item.priceBeforeDiscounts?.amount || 0
      );
      const currentPrice = Number(item.price?.amount || 0);

      if (!hasPromotionalDiscount) {
        // If no promotional discount, show the full difference as item discount
        itemDiscounts += (fullPrice - currentPrice) * (item.quantity || 1);
      } else {
        // If promotional discount exists, only show the sale discount portion
        // (difference between full price and price before promotional discounts)
        const saleDiscount = fullPrice - priceBeforeDiscounts;
        itemDiscounts += saleDiscount * (item.quantity || 1);
      }
    });

    return itemDiscounts.toFixed(2);
  };

  const calculateShipping = () => {
    return cart?.contactInfo?.address?.country === "US" ? 2.99 : 0;
  };

  const calculateFinalTotal = () => {
    if (!cart || !cart.lineItems) return 0;
    let total = 0;
    cart.lineItems.forEach((item) => {
      total += Number(item.price?.amount || 0) * (item.quantity || 1);
    });
    total += calculateShipping();
    return total.toFixed(2);
  };

  // console.log("cart", JSON.stringify(cart, null, 2));

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

      {/* Special Offers Banner */}
      {Object.keys(productGroups).map((productId) => {
        const discountInfo = getDiscountInfo(productId);
        if (discountInfo) {
          const totalSavings = calculateTotalSavings(productId);
          return (
            <Alert
              key={productId}
              className="mb-4 bg-green-50 border-green-200"
            >
              <Tag className="h-4 w-4 text-green-600 mt-4 sm:mt-0" />
              <AlertDescription className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-green-600">
                    {discountInfo.name.original}
                  </span>{" "}
                  applied to {productGroups[productId].productName}
                </div>
                <div className="text-green-600 font-semibold">
                  You saved ${totalSavings}
                </div>
              </AlertDescription>
            </Alert>
          );
        }
        return null;
      })}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.lineItems.map((item) => {
            const discount = discountsByProduct[item._id];
            return (
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
                        <div>
                          <h3 className="text-sm md:text-lg font-semibold">
                            {item.productName?.original}
                          </h3>
                          {discount && (
                            <div className="mt-1 inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              <Tag className="h-3 w-3 mr-1" />
                              {discount.name.original}
                            </div>
                          )}
                        </div>
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
                      <div className="flex justify-between items-center mt-2">
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
                              Number(item.price?.amount ?? 0) *
                              (item.quantity || 1)
                            ).toFixed(2)}
                          </p>
                          {Number(item.fullPrice?.amount) !==
                            Number(item.price?.amount) && (
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
                                    Number(item.price?.amount ?? 0)) *
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
            );
          })}
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${calculateOriginalSubtotal()}</span>
              </div>
              {cart.appliedDiscounts?.map((discount, index) => {
                const relatedProductNames = discount.lineItemIds
                  ?.map((lineItemId) => {
                    const item = cart.lineItems?.find(
                      (item) => item._id === lineItemId
                    );
                    return item?.productName?.original;
                  })
                  .filter(Boolean)
                  .join(", ");
                return (
                  <div
                    key={index}
                    className="flex justify-between mb-2 text-green-600 text-sm"
                  >
                    <span>
                      {discount.discountRule.name.original}{" "}
                      {relatedProductNames && `(${relatedProductNames})`}
                    </span>
                    <span>
                      -$
                      {Number(discount.discountRule.amount.amount || 0).toFixed(
                        2
                      )}
                    </span>
                  </div>
                );
              })}
              {Number(calculateItemDiscounts()) > 0 && (
                <div className="flex justify-between mb-2 text-green-600 text-sm">
                  <span>Item discounts</span>
                  <span>-${calculateItemDiscounts()}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>${calculateShipping().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-4">
                <span>Total</span>
                <span>${calculateFinalTotal()}</span>
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

      {/* Suggested Products Component */}
      <SuggestedProducts suggestedProducts={suggestedProducts} />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the item from your cart.
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
