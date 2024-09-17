"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { products } from "@wix/stores";

import Add from "./Add";

interface CustomizeProductsProps {
  productId: string;
  variants: products.Variant[];
  productOptions: products.ProductOption[];
}

const CustomizeProducts: React.FC<CustomizeProductsProps> = ({
  productId,
  variants,
  productOptions,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [selectedVariant, setSelectedVariant] = useState<products.Variant>();

  useEffect(() => {
    const variant = variants.find((v) => {
      const variantChoices = v.choices;
      if (!variantChoices) return false;
      return Object.entries(selectedOptions).every(
        ([key, value]) => variantChoices[key] === value
      );
    });
    setSelectedVariant(variant);
  }, [selectedOptions, variants]);

  const handleOptionSelect = (optionType: string, choice: string) => {
    setSelectedOptions((prev) => {
      if (prev[optionType] === choice) {
        // If the clicked option is already selected, deselect it
        const updatedOptions = { ...prev };
        delete updatedOptions[optionType]; // Remove the selected option
        return updatedOptions;
      }
      // Otherwise, select the new option
      return { ...prev, [optionType]: choice };
    });
  };

  // Keep this function to check if a variant is available based on selected options
  const isVariantInStock = (optionName: string, optionValue: string) => {
    return variants.some((variant) => {
      const variantChoices = variant.choices;
      if (!variantChoices) return false;

      // Check if current options (including deselected ones) match the variant
      const isMatch = Object.entries({
        ...selectedOptions,
        [optionName]: optionValue,
      }).every(([key, value]) => variantChoices[key] === value);

      return (
        isMatch &&
        variant.stock?.inStock &&
        variant.stock?.quantity &&
        variant.stock?.quantity > 0
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8 bg-gray-50 p-6 rounded-lg shadow-md"
    >
      {productOptions.map((option) => (
        <div className="flex flex-col gap-4" key={option.name}>
          <h4 className="font-semibold text-lg text-gray-700">
            Choose {option.name}
          </h4>
          <ul className="flex flex-wrap items-center gap-4">
            <AnimatePresence>
              {option.choices?.map((choice) => {
                const disabled = !isVariantInStock(
                  option.name!,
                  choice.description!
                );

                const selected =
                  selectedOptions[option.name!] === choice.description;

                const clickHandler = disabled
                  ? undefined
                  : () => handleOptionSelect(option.name!, choice.description!);

                return option.name === "Color" ? (
                  <motion.li
                    key={choice.description}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-full ring-2 ${
                        selected
                          ? "ring-slate-600"
                          : disabled
                          ? "ring-gray-300"
                          : "ring-gray-200 hover:ring-sky-100"
                      } transition-all duration-200`}
                      style={{
                        backgroundColor: choice.value,
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.5 : 1,
                      }}
                      onClick={clickHandler}
                    >
                      {selected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check className="text-white" size={20} />
                        </motion.div>
                      )}
                    </motion.div>
                    {disabled && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <X className="text-red-500" size={24} />
                      </motion.div>
                    )}

                    {/* Tooltip for color name */}
                    <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-600 text-slate-100 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {choice.description}
                    </span>
                  </motion.li>
                ) : (
                  <motion.li
                    key={choice.description}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`ring-2 rounded-md py-2 px-4 text-sm font-medium transition-all duration-200 ${
                      selected
                        ? "ring-slate-400 bg-slate-500 text-white"
                        : disabled
                        ? "ring-gray-300 bg-gray-100 text-gray-400"
                        : "ring-gray-200 bg-white text-gray-700 hover:ring-slate-300"
                    }`}
                    style={{
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                    onClick={clickHandler}
                  >
                    {choice.description}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Add
          productId={productId}
          variantId={
            selectedVariant?._id || "00000000-0000-0000-0000-000000000000"
          }
          stockNumber={selectedVariant?.stock?.quantity || 0}
        />
      </motion.div>
    </motion.div>
  );
};

export default CustomizeProducts;
