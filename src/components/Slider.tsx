"use client";

import { useState, useEffect, useRef, TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Room Lighting",
    description: "Discover Charming Night Lights",
    img: "/slides/Baby-Gadgets.jpeg",
    url: "/list?cat=consumer-electronics",
    bg: "bg-gradient-to-r from-sky-100 to-amber-100",
  },
  {
    id: 2,
    title: "Baby Clothing",
    description: "Sale! Up to 50% off!",
    img: "/slides/Baby-Clothing.jpeg",
    url: "/list?cat=baby-clothing&filter=Sale",
    bg: "bg-gradient-to-r from-cyan-50 to-blue-100",
  },
  {
    id: 3,
    title: "Toys & Games",
    description: "Explore Our Collection",
    img: "/slides/Toys-Games.jpeg",
    url: "/list?cat=toys-games",
    bg: "bg-gradient-to-r from-blue-50 to-rose-50",
  },
  {
    id: 4,
    title: "Nursery Decor",
    description: "Create Magical Spaces",
    img: "/slides/Nursery-Decor.jpeg",
    url: "/list?cat=nursery-decor",
    bg: "bg-gradient-to-r from-gray-50 to-orange-100",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 75) {
      nextSlide();
    }

    if (touchEndX.current - touchStartX.current > 75) {
      prevSlide();
    }
  };

  return (
    <div
      className="relative h-[calc(100vh-80px)] md:h-[calc(70vh-80px)] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            className={`${slide.bg} w-full h-full flex-shrink-0 flex flex-col md:flex-row items-center justify-center p-8 md:p-16`}
            key={slide.id}
          >
            <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl mb-4">
                {slide.description}
              </h2>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {slide.title}
              </h1>
              <Link href={slide.url}>
                <button className="bg-black text-white py-3 px-6 rounded-full hover:bg-gray-800 transition-colors duration-300">
                  SHOP NOW
                </button>
              </Link>
            </div>
            <div className="w-full md:w-1/2 h-64 md:h-full relative">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 transition-colors duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 transition-colors duration-300"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index ? "bg-black scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute bottom-4 right-4 bg-white/50 hover:bg-white/80 rounded-full p-2 transition-colors duration-300"
      >
        {isAutoPlaying ? "❚❚" : "▶"}
      </button>
    </div>
  );
};

export default Slider;
