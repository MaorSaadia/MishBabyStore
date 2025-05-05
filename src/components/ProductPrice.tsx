"use client";

import { useState, useEffect } from "react";

interface ProductPriceProps {
  initialPrice?: number | undefined;
  initialDiscountedPrice?: number | undefined;
}

const ProductPrice: React.FC<ProductPriceProps> = ({
  initialPrice = 0,
  initialDiscountedPrice,
}) => {
  const [price, setPrice] = useState(initialPrice);
  const [discountedPrice, setDiscountedPrice] = useState(
    initialDiscountedPrice
  );
  const [formattedPrice, setFormattedPrice] = useState(
    `$${initialPrice.toFixed(2)}`
  );
  const [formattedDiscountedPrice, setFormattedDiscountedPrice] = useState(
    initialDiscountedPrice ? `$${initialDiscountedPrice.toFixed(2)}` : undefined
  );

  useEffect(() => {
    // Listen for variant changes
    const handleVariantChange = (event: any) => {
      const {
        price,
        discountedPrice,
        formattedPrice,
        formattedDiscountedPrice,
      } = event.detail;

      if (price) setPrice(price);
      if (discountedPrice) setDiscountedPrice(discountedPrice);
      if (formattedPrice) setFormattedPrice(formattedPrice);
      if (formattedDiscountedPrice)
        setFormattedDiscountedPrice(formattedDiscountedPrice);
    };

    window.addEventListener("variantChanged", handleVariantChange);

    return () => {
      window.removeEventListener("variantChanged", handleVariantChange);
    };
  }, []);

  const hasDiscount = discountedPrice !== undefined && discountedPrice < price;
  const discount = hasDiscount
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {hasDiscount ? (
        <>
          <div className="flex items-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {formattedDiscountedPrice}
            </p>
            <p className="ml-1 text-sm md:text-lg font-medium text-gray-500 line-through">
              {formattedPrice}
            </p>
          </div>
          <span className="flex-shrink-0 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-md">
            {discount}% OFF
          </span>
        </>
      ) : (
        <p className="text-2xl md:text-3xl font-bold text-gray-900">
          {formattedPrice}
        </p>
      )}
    </div>
  );
};

export default ProductPrice;
