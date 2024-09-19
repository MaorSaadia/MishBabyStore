"use client";

import { useEffect, useRef } from "react";
import { media as wixMedia } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Image from "next/image";

import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";

interface CartModalProps {
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();
  const router = useRouter();

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

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleCheckout = async () => {
    try {
      const checkout =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: currentCart.ChannelType.WEB,
        });

      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/success`,
          },
        });

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-14 left-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
        >
          <X size={24} />
        </button>
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-lg overflow-hidden z-50"
        >
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
            </div>
            {!cart.lineItems ? (
              <div className="text-center py-8">Cart is Empty</div>
            ) : (
              <>
                <div className="max-h-[60vh] overflow-y-auto mb-4">
                  {cart.lineItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 mb-4 pb-4 border-b"
                    >
                      {item.image && (
                        <Image
                          src={wixMedia.getScaledToFillImageUrl(
                            item.image,
                            72,
                            96,
                            {}
                          )}
                          alt=""
                          width={72}
                          height={96}
                          className="object-cover rounded-md cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/${item.productName?.original?.toLowerCase()}`
                            )
                          }
                        />
                      )}
                      <div className="flex flex-col justify-between w-full">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold">
                              {item.productName?.original}
                            </h3>
                            <div className="p-1 bg-gray-50 rounded-sm text-sm whitespace-nowrap">
                              {item.quantity && item.quantity > 1 && (
                                <span className="text-green-500 mr-1">
                                  {item.quantity} x{" "}
                                </span>
                              )}
                              ${item.price?.amount}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.availability?.status}
                          </div>
                        </div>
                        {item.descriptionLines?.[0]?.colorInfo?.original && (
                          <div className="text-slate-500 text-xs">
                            Color: {item.descriptionLines[0].colorInfo.original}
                          </div>
                        )}
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-slate-800">
                            Qty. {item.quantity}
                          </span>
                          <span
                            className="text-rose-500"
                            style={{
                              cursor: isLoading ? "not-allowed" : "pointer",
                            }}
                            onClick={() => removeItem(wixClient, item._id!)}
                          >
                            Remove
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between font-semibold mb-2">
                    <span>Subtotal</span>
                    {
                      // @ts-ignore
                      <span>${cart.subtotal.amount}</span>
                    }
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      className="w-full rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
                      disabled={isLoading}
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                    <button
                      className="w-full rounded-md py-3 px-4 ring-1 ring-gray-300"
                      onClick={() => router.push("/cart")}
                    >
                      View Cart
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
