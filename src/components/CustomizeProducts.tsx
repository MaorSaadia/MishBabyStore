"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
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
  const validProductOptions = productOptions.filter(
    (option) => option.choices && option.choices.length >= 2
  );

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

    // Dynamically find the option that has media associated with its choices
    let imageUrl;
    const mediaOption = productOptions.find((option) =>
      option?.choices?.some((choice) => (choice?.media?.items ?? []).length > 0)
    );

    if (mediaOption) {
      const selectedChoiceValue = selectedOptions[mediaOption?.name ?? ""];
      if (selectedChoiceValue) {
        const selectedChoice = mediaOption?.choices?.find(
          (choice) => choice.description === selectedChoiceValue
        );
        if (selectedChoice && selectedChoice.media?.items?.[0]?.image?.url) {
          imageUrl = selectedChoice.media.items[0].image.url;
        }
      }
    }

    // Dispatch custom event with variant and image URL
    if (typeof window !== "undefined") {
      const event = new CustomEvent("variantChanged", {
        detail: { variant, imageUrl },
      });
      window.dispatchEvent(event);
    }
  }, [selectedOptions, variants, productOptions]);

  const handleOptionSelect = (optionType: string, choice: string) => {
    setSelectedOptions((prev) => {
      if (prev[optionType] === choice) {
        const updatedOptions = { ...prev };
        delete updatedOptions[optionType];
        return updatedOptions;
      }
      return { ...prev, [optionType]: choice };
    });
  };

  const isVariantInStock = (optionName: string, optionValue: string) => {
    return variants.some((variant) => {
      const variantChoices = variant.choices;
      if (!variantChoices) return false;

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

  const allOptionsSelected = validProductOptions.every(
    (option) => selectedOptions[option.name!]
  );

  const missingOptions = validProductOptions
    .filter((option) => !selectedOptions[option.name!])
    .map((option) => option.name!);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 bg-gray-50 p-4 rounded-lg shadow-md"
    >
      {validProductOptions.map((option) => (
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
                        className="absolute w-12 h-[2px] bg-slate-300 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      ></motion.div>
                    )}
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
          allOptionsSelected={allOptionsSelected}
          missingOptions={missingOptions}
        />
        <AnimatePresence>
          {allOptionsSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden"
            >
              {selectedVariant?.stock?.quantity === 0 ? (
                <div className="text-xs text-red-500">
                  Product is out of stock
                </div>
              ) : selectedVariant?.stock?.quantity &&
                selectedVariant.stock.quantity < 20 ? (
                <div className="text-xs text-red-500">
                  Only a few units left!
                  <br /> {"Don't"} miss it
                </div>
              ) : (
                <div className="text-md m-2 text-green-700">In Stock</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CustomizeProducts;
