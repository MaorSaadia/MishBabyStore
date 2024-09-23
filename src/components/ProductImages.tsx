"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const ProductImages = ({ items }: { items: any }) => {
  const [index, setIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const nextImage = () => {
    setIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevImage = () => {
    setIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    imageRef.current.style.transformOrigin = `${x * 100}% ${y * 100}%`;
  };

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] md:h-[600px] overflow-hidden rounded-lg shadow-lg">
        <div
          className="absolute inset-0 cursor-context-menu"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <motion.div
            ref={imageRef}
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              scale: isZoomed ? 1.5 : 1,
              transition: { duration: 0.3 },
            }}
            className="h-full w-full"
          >
            <Image
              src={items[index].image?.url}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={true}
            />
          </motion.div>
        </div>
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200 focus:outline-none z-10"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200 focus:outline-none z-10"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {items.map((item: any, i: number) => (
          <button
            key={item._id}
            onClick={() => setIndex(i)}
            className={`flex-shrink-0 relative w-24 h-24 rounded-md overflow-hidden m-2 ${
              i === index ? "ring-2 ring-slate-600" : ""
            }`}
          >
            <Image
              src={item.image?.url}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
              priority={true}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
