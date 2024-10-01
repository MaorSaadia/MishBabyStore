"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ProductImagesProps {
  items: any[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ items }) => {
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preventBodyScroll = (e: WheelEvent | TouchEvent) => {
      if (isModalOpen) {
        e.preventDefault();
      }
    };

    document.body.addEventListener("wheel", preventBodyScroll, {
      passive: false,
    });
    document.body.addEventListener("touchmove", preventBodyScroll, {
      passive: false,
    });

    return () => {
      document.body.removeEventListener("wheel", preventBodyScroll);
      document.body.removeEventListener("touchmove", preventBodyScroll);
    };
  }, [isModalOpen]);

  const nextImage = () => {
    setIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevImage = () => {
    setIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const handleSwipe = (event: React.TouchEvent) => {
    const touch = event.changedTouches[0];
    const swipeThreshold = 50;

    if (touch.pageX - swipeStartX > swipeThreshold) {
      prevImage();
    } else if (touch.pageX - swipeStartX < -swipeThreshold) {
      nextImage();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !modalRef.current) return;

    const { left, top, width, height } =
      modalRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setPan({ x: (0.5 - x) * 100, y: (0.5 - y) * 100 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isZoomed || !modalRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const container = modalRef.current.getBoundingClientRect();
    const x = (touch.clientX - container.left) / container.width;
    const y = (touch.clientY - container.top) / container.height;

    setPan({ x: (0.5 - x) * 100, y: (0.5 - y) * 100 });
  };

  let swipeStartX = 0;

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
    <>
      <div
        ref={containerRef}
        className="relative h-[400px] md:h-[600px] overflow-hidden rounded-lg shadow-lg"
        onTouchStart={(e) => (swipeStartX = e.touches[0].pageX)}
        onTouchEnd={handleSwipe}
      >
        <div className="absolute inset-0" onClick={() => setIsModalOpen(true)}>
          <Image
            src={items[index].image.url}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
          />
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
        {items.map((item, i) => (
          <button
            key={item._id}
            onClick={() => setIndex(i)}
            className={`flex-shrink-0 relative w-24 h-24 rounded-md overflow-hidden m-2 mt-4 -mr-1 ${
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
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
            onClick={() => {
              setIsModalOpen(false);
              setIsZoomed(false);
              setPan({ x: 0, y: 0 });
            }}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-[90%] h-[90%] max-w-4xl max-h-[80vh] bg-slate-50 rounded-lg overflow-hidden -mb-2"
              onClick={(e) => e.stopPropagation()}
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
                animate={{
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
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 60vw"
                  priority={true}
                />
              </motion.div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsZoomed(false);
                  setPan({ x: 0, y: 0 });
                }}
                className="absolute top-6 right-6 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200 focus:outline-none z-10"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductImages;
