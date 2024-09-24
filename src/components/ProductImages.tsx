"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

interface ProductImagesProps {
  items: any;
}

interface PanState {
  x: number;
  y: number;
}

const ProductImages: React.FC<ProductImagesProps> = ({ items }) => {
  const [index, setIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [pan, setPan] = useState<PanState>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

    setPan({ x: (0.5 - x) * 100, y: (0.5 - y) * 100 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isZoomed || !containerRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const container = containerRef.current.getBoundingClientRect();
    const x = (touch.clientX - container.left) / container.width;
    const y = (touch.clientY - container.top) / container.height;

    setPan({ x: (0.5 - x) * 100, y: (0.5 - y) * 100 });
  };

  useEffect(() => {
    const preventDefaultTouch = (e: TouchEvent) => {
      if (isZoomed) {
        e.preventDefault();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchmove", preventDefaultTouch, {
        passive: false,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener("touchmove", preventDefaultTouch);
      }
    };
  }, [isZoomed]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative h-[400px] md:h-[600px] overflow-hidden rounded-lg shadow-lg"
      >
        <div
          className="absolute inset-0"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => {
            setIsZoomed(false);
            setPan({ x: 0, y: 0 });
          }}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsZoomed(true)}
          onTouchEnd={() => {
            setIsZoomed(false);
            setPan({ x: 0, y: 0 });
          }}
          onTouchMove={handleTouchMove}
        >
          <motion.div
            ref={imageRef}
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              scale: isZoomed ? 1.2 : 1,
              x: isZoomed ? pan.x : 0,
              y: isZoomed ? pan.y : 0,
              transition: { duration: 0.05 },
            }}
            className="h-full w-full"
          >
            <Image
              src={items[index].image.url}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            className={`flex-shrink-0 relative w-24 h-24 rounded-md overflow-hidden m-2 -mr-1 ${
              i === index ? "ring-2 ring-slate-600" : ""
            }`}
          >
            <Image
              src={item.image.url}
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
