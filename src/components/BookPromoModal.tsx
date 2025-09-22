"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function BookPromoModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("bookPromoSeen");
    // if (!hasSeenPopup) {
    const timer = setTimeout(() => {
      setShow(true);
      localStorage.setItem("bookPromoSeen", "true");
    }, 3000);
    return () => clearTimeout(timer);
    // }
  }, []);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [show]);

  const handleClose = () => {
    setShow(false);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-gradient-to-br from-slate-50 to-cyan-50 w-full max-w-sm sm:max-w-md lg:max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative border border-slate-300 animate-slideUp max-h-[95vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 bg-black/5 rounded-full p-2 text-slate-500 hover:text-slate-900 hover:bg-black/10 transition-all duration-200"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Top Section: Image */}
        <div className="flex items-center justify-center p-3 sm:p-6 bg-slate-200/40 -mb-2 md:-mb-4">
          <div className="relative w-58 sm:w-72 md:w-80 lg:w-96">
            <Image
              src="/Book-Cover.png" // <-- UPDATE: Use your new cover image file
              alt="The Modern ICT Trader's Masterclass Book Cover"
              width={1184}
              height={864} // Use the actual dimensions of your cover for best results
              className="rounded-lg shadow-xl w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Bottom Section: Content */}
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="mb-2 text-center">
            <h2 className="text-md sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
              Your A-Z Path to a New Financial Skill
            </h2>
            <p className="text-cyan-600 font-semibold text-sm sm:text-base lg:text-lg -mt-1">
              The 3-in-1 Masterclass for Absolute Beginners.
            </p>
          </div>

          <p className="text-slate-600 mb-1 leading-relaxed text-xs sm:text-base -mt-2">
            Feeling lost on where to start your trading journey? This
            masterclass is the single, definitive guide you&apos;ll ever need.
            It combines three complete books into one unified path, taking you
            from zero knowledge to a full, professional strategy.
          </p>

          {/* Feature List */}
          <div className="space-y-3 mb-2 -mt-1">
            <div className="flex items-start">
              <span className="text-cyan-600 mr-3 mt-0.5 text-base">✓</span>
              <div>
                <strong className="text-slate-800 text-sm sm:text-base">
                  The Absolute Basics
                </strong>
                <p className="text-slate-500 text-xs sm:text-sm -mb-1 -mt-1">
                  Learn to read charts, understand the markets, and place your
                  first trade.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-600 mr-3 mt-0.5 text-base">✓</span>
              <div>
                <strong className="text-slate-800 text-sm sm:text-base">
                  A Professional Strategy
                </strong>
                <p className="text-slate-500 text-xs sm:text-sm -mb-1 -mt-1">
                  Master a complete, repeatable strategy that demystifies how
                  markets move.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-600 mr-3 mt-0.5 text-base">✓</span>
              <div>
                <strong className="text-slate-800 text-sm sm:text-base">
                  Your Complete Trading Plan
                </strong>
                <p className="text-slate-500 text-xs sm:text-sm -mt-1">
                  Get a step-by-step daily checklist and master the mindset for
                  success.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden sm:block bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2 sm:p-2 m-4 text-center">
            <p className="text-cyan-800 text-sm sm:text-base font-semibold">
              🔥 Get the Complete 3-in-1 Masterclass!
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://smartmoneysimplified.etsy.com/listing/4373947421"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-lg text-center transition-all duration-200 transform hover:scale-105 shadow-lg text-xs sm:text-base"
            >
              Buy Now on Etsy
            </a>
            <button
              onClick={handleClose}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-1 px-4 rounded-lg transition-all duration-200 text-xs sm:text-base"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
