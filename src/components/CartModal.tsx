"use client";

import { useEffect, useRef } from "react";
import { media as wixMedia } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import { Button } from "./ui/button";

interface CartModalProps {
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();

  const router = useRouter();

  // console.log(cart);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleCheckout = async () => {
    try {
      const checkout =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: currentCart.ChannelType.WEB,
        });
      console.log("1:", checkout);
      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/success`,
          },
        });
      console.log("2:", redirectSession);

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      ref={modalRef}
      className="w-80 md:w-[26rem] absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-4 z-20 max-h-[80vh]"
    >
      {!cart.lineItems ? (
        <div className="text-center py-8">Your Cart is Empty</div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2">
            {cart.lineItems.map((item) => (
              <div className="flex gap-6" key={item._id}>
                {item.image && (
                  <Image
                    src={wixMedia.getScaledToFillImageUrl(
                      item.image,
                      96,
                      120,
                      {}
                    )}
                    alt=""
                    title={`Go to product page`}
                    width={96}
                    height={120}
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
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <div className="flex items-center justify-between gap-8">
                      <h3 className="font-semibold text-lg">
                        {item.productName?.original}
                      </h3>

                      <div className="bg-gray-50 rounded-md flex flex-row items-center gap-2">
                        {item.quantity && item.quantity > 1 && (
                          <div className="text-sm text-green-600">
                            {item.quantity}x{" "}
                          </div>
                        )}
                        <span className="font-semibold">
                          ${item.price?.amount}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {item.availability?.status}
                    </div>
                  </div>
                  {item.descriptionLines?.[0]?.name?.original === "Size" && (
                    <div className="text-slate-500 text-xs">
                      Size: {item.descriptionLines[0]?.plainText?.original}
                    </div>
                  )}
                  {item.descriptionLines?.[0]?.name?.original === "Type" && (
                    <div className="text-slate-500 text-xs">
                      Type: {item.descriptionLines[0]?.plainText?.original}
                    </div>
                  )}
                  {item.descriptionLines?.[0]?.colorInfo?.original && (
                    <div className="text-slate-500 text-xs">
                      Color: {item.descriptionLines[0].colorInfo.original}
                    </div>
                  )}
                  {item.descriptionLines?.[1]?.colorInfo?.original && (
                    <div className="text-slate-500 text-xs">
                      Color: {item.descriptionLines[1].colorInfo.original}
                    </div>
                  )}
                  <div className="flex justify-between text-sm mt-4">
                    <span className="text-slate-800">Qty. {item.quantity}</span>
                    <button
                      className="text-rose-500 hover:text-rose-600 hover:underline"
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                      onClick={() => removeItem(wixClient, item._id!)}
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between font-semibold text-lg">
              <span>Subtotal</span>
              {
                // @ts-ignore
                <span>${cart.subtotal?.amount}</span>
              }
            </div>
            <p className="text-gray-500 text-sm mt-2 mb-6">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-between gap-4">
              <Link href="/cart" onClick={onClose}>
                <Button className="flex-1 rounded-md py-3 px-4 ring-1 bg-white text-black ring-gray-300 hover:bg-slate-100 transition-colors">
                  View Cart
                </Button>
              </Link>

              <Button
                className="flex-1 rounded-md py-3 px-4 bg-black text-white hover:bg-slate-800 transition-colors disabled:cursor-not-allowed disabled:opacity-75"
                disabled={isLoading}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
