"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo, Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
} from "lucide-react";
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
    id: 0,
    title: "Bundle & Save",
    subtitle: "SPECIAL PROMOTION",
    description: "Buy 2 Get 10% Off | Buy 3 Get 20% Off",
    img: "/slides/Bundle-Deals.jpeg",
    url: "/bundle-deals",
    accent: "text-cyan-600",
    bg: "bg-gradient-to-r from-cyan-50 to-sky-200",
  },
  {
    id: 1,
    title: "Free Shipping On All Orders",
    subtitle: "PEACE OF MIND GUARANTEE",
    description: "",
    img: "/slides/shipping-security.jpeg", // ** REMEMBER TO ADD YOUR IMAGE HERE **
    url: "/shipping-policy",
    accent: "text-cyan-600",
    bg: "bg-gradient-to-r from-gray-50 to-cyan-50",
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

// Payment icons to display on the new slide
const paymentMethods = [
  { name: "Visa", src: "/payment-icons/visa.png" },
  { name: "Mastercard", src: "/payment-icons/mastercard.png" },
  { name: "American Express", src: "/payment-icons/american-express.png" },
  { name: "Discover", src: "/payment-icons/discover.png" },
  { name: "Max", src: "/payment-icons/max.png" },
  { name: "Isracard", src: "/payment-icons/isracard.png" },
  { name: "Diners Club", src: "/payment-icons/diners-club.png" },
  { name: "JCB", src: "/payment-icons/jcb.png" },
  { name: "Maestro", src: "/payment-icons/maestro.png" },
  { name: "PayPal", src: "/payment-icons/paypal.png" },
];

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const Slider: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([
      (page + newDirection + slides.length) % slides.length,
      newDirection,
    ]);
  };

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 8000); // Slowed down timer slightly
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDragEnd = (_: any, { offset, velocity }: PanInfo) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -10000) {
      paginate(1);
    } else if (swipe > 10000) {
      paginate(-1);
    }
  };

  const currentSlide = slides[page];

  return (
    <div className="relative h-[50vh] max-h-[450px] min-h-[320px] w-full overflow-hidden bg-gray-100 rounded-b-2xl shadow-lg">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
          className={`absolute w-full h-full flex flex-col md:flex-row items-center justify-center ${currentSlide.bg}`}
        >
          {/* Text Content Area */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-4 md:p-6 lg:p-8 text-center md:text-left order-2 md:order-1">
            <motion.p
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className={`text-sm font-bold tracking-widest uppercase ${currentSlide.accent}`}
            >
              {currentSlide.subtitle}
            </motion.p>
            <motion.h1
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="text-2xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mt-1 leading-tight"
            >
              {currentSlide.title}
            </motion.h1>
            <motion.p
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mt-2 text-sm lg:text-base text-gray-600 max-w-lg mx-auto md:mx-0"
            >
              {currentSlide.description}
            </motion.p>

            {/* Conditional content for the shipping slide */}
            {currentSlide.id === 1 && (
              <motion.div
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="mt-2"
              >
                <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Truck className={`w-4 h-4 ${currentSlide.accent}`} />
                    <span className="text-sm font-semibold text-gray-700">
                      Fast & Free Delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 ${currentSlide.accent}`} />
                    <span className="text-sm font-semibold text-gray-700">
                      100% Secure Payments
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">
                    We proudly accept:
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-1">
                    {paymentMethods.map((p) => (
                      <div
                        key={p.name}
                        className="h-5 w-8 bg-white rounded-md border p-0.5 flex items-center justify-center shadow-sm"
                      >
                        <Image
                          src={p.src}
                          alt={p.name}
                          width={24}
                          height={16}
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA Button for other slides */}
            {currentSlide.id !== 1 && (
              <motion.div
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="mt-4"
              >
                <Link href={currentSlide.url}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-6 py-2 bg-cyan-500 ${currentSlide.accent.replace(
                      "text",
                      "bg"
                    )} text-white font-bold rounded-full shadow-lg mx-auto md:mx-0 text-sm`}
                  >
                    {currentSlide.id === 1
                      ? "Shop Bundle Deals"
                      : "Shop Collection"}
                    <ShoppingBag className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Image Area */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full relative order-1 md:order-2">
            <motion.div
              key={page + "_image"}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="w-full h-full"
            >
              <Image
                src={currentSlide.img}
                alt={currentSlide.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={page === 1}
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setPage([index, index > page ? 1 : -1])}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              page === index
                ? "w-4 bg-gray-900"
                : "w-1.5 bg-gray-400 hover:bg-gray-600"
            }`}
          />
        ))}
      </div>
      <button
        onClick={() => paginate(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/70 hover:bg-white transition shadow-md"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/70 hover:bg-white transition shadow-md"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Slider;
