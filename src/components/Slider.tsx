"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  img: string;
  url: string;
  accent: string;
  bg: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Baby Clothing",
    subtitle: "NEW COLLECTION 2025",
    description: "Luxury Organic Cotton | Up to 50% Off",
    img: "/slides/Baby-Clothing.jpeg",
    url: "/list?cat=baby-clothing&filter=Sale",
    accent: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    id: 2,
    title: "Toys & Games",
    subtitle: "PLAYTIME ESSENTIALS",
    description: "Educational & Fun | Premium Selection",
    img: "/slides/Toys-Games.jpeg",
    url: "/list?cat=toys-games",
    accent: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 3,
    title: "Nursery Decor",
    subtitle: "DESIGNER COLLECTION",
    description: "Transform Their Space | Limited Time",
    img: "/slides/Nursery-Decor.jpeg",
    url: "/list?cat=nursery-decor",
    accent: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    id: 4,
    title: "Room Lighting",
    subtitle: "AMBIENT SERIES",
    description: "Smart & Stylish | New Arrivals",
    img: "/slides/Baby-Gadgets.jpeg",
    url: "/list?cat=night-lights-room-lighting",
    accent: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.9,
  }),
};

const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.2,
    },
  },
};

const imageVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const Slider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number): number => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number): void => {
    setDirection(newDirection);
    setCurrentIndex(
      (prevIndex) => (prevIndex + newDirection + slides.length) % slides.length
    );
  };

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ): void => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  return (
    <div
      className="relative h-[calc(100vh-80px)] md:h-[calc(80vh-80px)] overflow-hidden bg-gray-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
          className="absolute w-full h-full"
        >
          <div
            className={`w-full h-full flex flex-col md:flex-row ${slides[currentIndex].bg}`}
          >
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full order-2 md:order-1">
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center"
              >
                <span
                  className={`text-sm md:text-base font-medium tracking-widest ${slides[currentIndex].accent}`}
                >
                  {slides[currentIndex].subtitle}
                </span>
                <h1 className="mt-4 text-4xl md:text-7xl font-bold text-gray-900 leading-tight">
                  {slides[currentIndex].title}
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-600">
                  {slides[currentIndex].description}
                </p>
                <Link href={slides[currentIndex].url} className="mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full overflow-hidden"
                  >
                    <span className="relative z-10">Shop Collection</span>
                    <ShoppingBag className="w-5 h-5 relative z-10" />
                    <motion.div
                      className={`absolute inset-0 ${slides[currentIndex].accent} opacity-0 group-hover:opacity-100`}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            <div className="relative w-full md:w-1/2 h-1/2 md:h-full order-1 md:order-2">
              <motion.div
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                className="relative w-full h-full"
              >
                <Image
                  src={slides[currentIndex].img}
                  alt={slides[currentIndex].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-1 transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 bg-gray-900"
                : "w-4 bg-gray-400 hover:bg-gray-600"
            }`}
          />
        ))}
      </div>

      <motion.button
        // whileHover={{ scale: 1.1 }}
        // whileTap={{ scale: 0.9 }}
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>

      <motion.button
        // whileHover={{ scale: 1.1 }}
        // whileTap={{ scale: 0.9 }}
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default Slider;
