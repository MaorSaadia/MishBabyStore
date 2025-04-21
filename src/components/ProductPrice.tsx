"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ProductPriceProps {
  initialPrice: number | null | undefined;
  initialDiscountedPrice: number | null | undefined;
}

const ProductPrice: React.FC<ProductPriceProps> = ({
  initialPrice,
  initialDiscountedPrice,
}) => {
  const [price, setPrice] = useState(initialPrice);
  const [discountedPrice, setDiscountedPrice] = useState(
    initialDiscountedPrice
  );

  // Set up a listener for custom events dispatched when variant changes
  useEffect(() => {
    // Function to handle variant change events
    const handleVariantChange = (e: CustomEvent) => {
      const variant = e.detail;
      if (variant && variant.variant && variant.variant.priceData) {
        setPrice(variant.variant.priceData.price);
        setDiscountedPrice(variant.variant.priceData.discountedPrice);
      } else {
        // Reset to initial prices if no variant is selected
        setPrice(initialPrice);
        setDiscountedPrice(initialDiscountedPrice);
      }
    };

    // Add event listener (need to cast to any because CustomEvent is not in the standard Event types)
    window.addEventListener("variantChanged", handleVariantChange as any);

    // Cleanup
    return () => {
      window.removeEventListener("variantChanged", handleVariantChange as any);
    };
  }, [initialPrice, initialDiscountedPrice]);

  // Calculate discount percentage
  const discountPercentage =
    price && discountedPrice
      ? Math.round((1 - discountedPrice / price) * 100)
      : 0;

  return (
    <motion.div
      className="mt-2 sm:mt-4 flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {price === discountedPrice ? (
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
          ${price?.toFixed(2)}
        </span>
      ) : (
        <>
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
            ${discountedPrice?.toFixed(2)}
          </span>
          <span className="ml-2 text-md sm:text-lg font-medium text-gray-500 line-through">
            ${price?.toFixed(2)}
          </span>
          <span className="ml-2 text-sm font-medium text-rose-500">
            {discountPercentage}% OFF
          </span>
        </>
      )}
    </motion.div>
  );
};

export default ProductPrice;
