"use client";

import { useState } from "react";
import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface AddProps {
  productId: string;
  variantId: string;
  stockNumber: number;
  allOptionsSelected?: boolean;
  missingOptions?: string[];
}

const Add: React.FC<AddProps> = ({
  productId,
  variantId,
  stockNumber,
  allOptionsSelected = true,
  missingOptions = [],
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const wixClient = useWixClient();
  const { addItem, isLoading } = useCartStore();

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!productId || !wixClient) {
      toast.error("Unable to add to cart: Missing required information");
      return;
    }

    try {
      setIsAddingToCart(true);

      // Validate stock before adding
      if (quantity > stockNumber) {
        toast.error(`Sorry, only ${stockNumber} items available`);
        return;
      }

      const success = await addItem(wixClient, productId, variantId, quantity);

      if (success) {
        toast.success("Item added to cart successfully!");
        // Optionally reset quantity after successful add
        setQuantity(1);
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add item to cart. Please try again."
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isDisabled =
    isLoading ||
    isAddingToCart ||
    !allOptionsSelected ||
    quantity > stockNumber ||
    !productId;

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("d")}
              disabled={quantity === 1 || isAddingToCart}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span aria-label="Current quantity">{quantity}</span>
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("i")}
              disabled={quantity === stockNumber || isAddingToCart}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isDisabled}
            className="w-48 text-sm rounded-3xl ring-1 ring-slate-800 text-slate-900 py-3 px-2 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:ring-0 disabled:text-white disabled:ring-none"
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
        <AnimatePresence>
          {!allOptionsSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-red-600 mt-2"
              role="alert"
            >
              Please select {missingOptions?.join(" and ")} to add to cart.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Add;
