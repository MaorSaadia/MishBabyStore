"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Package } from "lucide-react";
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
    title: "Bundle & Save",
    subtitle: "SPECIAL PROMOTION",
    description: "Buy 2 Get 10% Off | Buy 3 Get 20% Off",
    img: "/slides/Bundle-Deals.jpeg",
    url: "/bundle-deals",
    accent: "text-cyan-600",
    bg: "bg-gradient-to-r from-cyan-50 to-sky-200",
  },
  {
    id: 2,
    title: "Baby Cares",
    subtitle: "ESSENTIAL CARE PRODUCTS",
    description: "Gentle & Safe | For Everyday Needs",
    img: "/slides/Baby-Cares.jpeg",
    url: "/list?cat=baby-cares",
    accent: "text-teal-600",
    bg: "bg-gradient-to-r from-rose-50 to-cyan-100",
  },
  {
    id: 3,
    title: "Baby Clothing",
    subtitle: "NEW COLLECTION 2025",
    description: "Luxury Organic Cotton | Up to 50% Off",
    img: "/slides/Baby-Clothing-2.jpeg",
    url: "/list?cat=baby-clothing&filter=Sale",
    accent: "text-rose-600",
    bg: "bg-gradient-to-r from-orange-50 to-gray-50",
  },
  {
    id: 4,
    title: "Baby Essentials",
    subtitle: "INNOVATIVE TECHNOLOGY",
    description: "Smart Solutions | For Modern Parents",
    img: "/slides/Baby-Gadgets.jpeg",
    url: "/list?cat=baby-cares",
    accent: "text-orange-600",
    bg: "bg-gradient-to-r from-orange-50 to-white-400",
  },
  {
    id: 5,
    title: "Toys & Games",
    subtitle: "PLAYTIME ESSENTIALS",
    description: "Educational & Fun | Premium Selection",
    img: "/slides/Toys-Games-2.jpeg",
    url: "/list?cat=toys-games",
    accent: "text-blue-600",
    bg: "bg-gradient-to-r from-cyan-50 to-blue-200",
  },
];

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
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
    scale: 0.95,
  }),
};

const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.2,
    },
  },
};

const imageVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.05,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
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
    const timer = setInterval(() => paginate(1), 10000);
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

  // Special rendering for bundle deals slide
  const renderSlideContent = () => {
    const slide = slides[currentIndex];

    // Check if this is the bundle deals slide
    const isBundleSlide = slide.id === 1;

    return (
      <div className={`w-full h-full flex flex-col md:flex-row ${slide.bg}`}>
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full order-2 md:order-1">
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 p-6 md:p-12 flex flex-col justify-center"
          >
            {isBundleSlide ? (
              // Bundle deals slide content
              <>
                <div className="hidden sm:inline-block bg-rose-500 text-white px-3 py-1 rounded-md mb-2">
                  <span className="text-xs md:text-sm font-bold tracking-widest">
                    LIMITED TIME OFFER
                  </span>
                </div>
                <span
                  className={`text-xs md:text-sm font-semibold tracking-widest ${slide.accent}`}
                >
                  {slide.subtitle}
                </span>
                <h1 className="sm:mt-2 text-2xl md:text-5xl font-bold text-gray-900 leading-tight">
                  {slide.title}
                </h1>
                <p className="sm:mt-2 text-base md:text-lg text-gray-600">
                  {slide.description}
                </p>

                <div className="mt-1 sm:mt-2 flex items-center gap-1 text-gray-700">
                  <Package className="w-3 h-3 sm:w-5 sm:h-5" />
                  <span className="font-medium text-xs">
                    On all eligible products
                  </span>
                </div>

                <Link href={slide.url} className="mt-2 md:mt-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg overflow-hidden"
                  >
                    <span className="relative z-10 text-sm font-medium">
                      Shop Bundle Deals
                    </span>
                    <ShoppingBag className="w-4 h-4 relative z-10" />
                    <motion.div
                      className={`absolute inset-0 ${slide.accent} opacity-0 group-hover:opacity-100`}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Link>
              </>
            ) : (
              // Regular slide content
              <>
                <span
                  className={`text-xs md:text-sm font-semibold tracking-widest ${slide.accent}`}
                >
                  {slide.subtitle}
                </span>
                <h1 className="mt-2 text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                  {slide.title}
                </h1>
                <p className="mt-2 text-base md:text-lg text-gray-600">
                  {slide.description}
                </p>
                <Link href={slide.url} className="mt-4 md:mt-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg overflow-hidden"
                  >
                    <span className="relative z-10 text-sm font-medium">
                      Shop Collection
                    </span>
                    <ShoppingBag className="w-4 h-4 relative z-10" />
                    <motion.div
                      className={`absolute inset-0 ${slide.accent} opacity-0 group-hover:opacity-100`}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Link>
              </>
            )}
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
              src={slide.img}
              alt={slide.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-gray-50 rounded-b-2xl shadow-sm"
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
          {renderSlideContent()}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-1 transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-6 bg-gray-900"
                : "w-3 bg-gray-400 hover:bg-gray-600"
            }`}
          />
        ))}
      </div>

      <motion.button
        onClick={() => paginate(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10 text-gray-800"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      <motion.button
        onClick={() => paginate(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10 text-gray-800"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default Slider;
