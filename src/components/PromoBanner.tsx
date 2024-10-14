"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const PromoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Start animation after a short delay
    const timer = setTimeout(() => setAnimate(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-cyan-600 overflow-hidden">
      <div className="max-w-7xl mx-auto py-1 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-cyan-800">
              <svg
                className="h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </span>
            <div className="ml-3 font-medium text-white truncate">
              <span className="md:hidden inline-flex whitespace-nowrap">
                <span
                  className={`${animate ? "animate-marquee" : ""} inline-block`}
                >
                  New customers 🎉: Use code FIRSTBUY10 for 10% off ALL products
                  on your first purchase!
                </span>
              </span>
              <span className="hidden md:inline">
                New customers 🎉: Use code FIRSTBUY10 for 10% off ALL products
                on your first purchase!
              </span>
            </div>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:-scroll-ml-3">
            <button
              type="button"
              className="-mr-1 flex p-2 rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              onClick={() => setIsVisible(false)}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
