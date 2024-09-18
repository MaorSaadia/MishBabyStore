"use client";

import { useState } from "react";
import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { motion, AnimatePresence } from "framer-motion";

const Add = ({
  productId,
  variantId,
  stockNumber,
  allOptionsSelected,
  missingOptions,
}: {
  productId: string;
  variantId: string;
  stockNumber: number;
  allOptionsSelected?: boolean;
  missingOptions?: string[];
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const wixClient = useWixClient();

  const { addItem, isLoading } = useCartStore();

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("d")}
              disabled={quantity === 1}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("i")}
              disabled={quantity === stockNumber}
            >
              +
            </button>
          </div>
          <button
            onClick={() => addItem(wixClient, productId, variantId, quantity)}
            disabled={isLoading || !allOptionsSelected}
            className="w-36 text-sm rounded-3xl ring-1 ring-slate-800 text-slate-900 py-2 px-4 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:ring-0 disabled:text-white disabled:ring-none"
          >
            Add to Cart
          </button>
        </div>
        <AnimatePresence>
          {!allOptionsSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-slate-700 mt-2"
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
