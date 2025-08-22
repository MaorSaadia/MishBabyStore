"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react"; // Added Download icon
import Image from "next/image";

export default function BookPromoModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Using localStorage to ensure the popup is only seen once ever per browser
    const hasSeenPopup = localStorage.getItem("bookPromoSeen");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShow(true);
        localStorage.setItem("bookPromoSeen", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-gradient-to-br from-slate-50 to-cyan-50 w-full max-w-lg sm:max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative border border-slate-300 animate-slideUp max-h-[95vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 bg-black/5 rounded-full p-2 text-slate-500 hover:text-slate-900 hover:bg-black/10 transition-all duration-200"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Image Section - Now at the top for all screen sizes */}
        <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-200/40 relative">
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <Image
              src="/bundle-cover.png"
              alt="Book bundle cover"
              width={1834}
              height={1032}
              className="rounded-lg shadow-xl w-full h-auto"
              priority
            />
            <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full px-3 py-1 sm:px-4 sm:py-2 shadow-lg animate-pulse">
              <div className="text-xs font-semibold">ONLY</div>
              <div className="text-lg sm:text-xl font-bold">$17.80</div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 -mt-4">
              Ready for a New Way to Grow Your Income?
            </h2>
            <p className="text-cyan-600 font-semibold text-base sm:text-lg mt-1">
              Your Complete Guide to Learning a New Financial Skill, From
              Scratch.
            </p>
          </div>

          <p className="text-slate-600 mb-2 -mt-1 sm:mb-5 leading-relaxed text-sm sm:text-base">
            Ever looked at the financial markets and felt like it was a
            complicated world you couldn&apos;t access? This two-part bundle is
            designed to change that. It&apos;s a simple, step-by-step blueprint
            that teaches you how the markets{" "}
            <em className="font-semibold text-slate-700">really</em> work,
            giving you the confidence to start trading-no experience needed.
          </p>

          {/* Feature List */}
          <div className="space-y-2 sm:space-y-3 mb-2 sm:mb-2">
            <div className="flex items-start -mt-2">
              <span className="text-cyan-600 mr-3 mt-1">✓</span>
              <div>
                <strong className="text-slate-800 text-sm sm:text-base">
                  Part 1: Your Solid Foundation
                </strong>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Start from zero and learn the essential building blocks of
                  trading.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-600 mr-3 mt-1">✓</span>
              <div>
                <strong className="text-slate-800 text-sm sm:text-base">
                  Part 2: Your Professional Playbook
                </strong>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Learn powerful and repeatable trading strategies to take the
                  guesswork out.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 mb-4 sm:mb-5 text-center">
            <p className="text-cyan-800 text-xs sm:text-sm font-semibold">
              🔥 Limited Time Bundle Offer – Get Both Books & Save!
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-5">
            <a
              href="https://smartmoneyms.gumroad.com/l/smartmoneysimplified_theictplaybook_bundle"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-center transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Get Your Bundle Now →
            </a>
            <button
              onClick={handleClose}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base"
            >
              Maybe Later
            </button>
          </div>

          {/* Free Demo Links Section */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">
              Or, try a free sample first:
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-x-4 sm:gap-x-6 gap-y-2">
              <a
                href="https://smartmoneyms.gumroad.com/l/smartmoneysimplified_demo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-slate-600 hover:text-cyan-700 text-xs sm:text-sm font-medium transition-colors"
              >
                <Download size={12} className="mr-2 flex-shrink-0" />
                <span>Demo: Smart Money, Simplified</span>
              </a>
              <a
                href="https://smartmoneyms.gumroad.com/l/theictplaybook_demo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-slate-600 hover:text-cyan-700 text-xs sm:text-sm font-medium transition-colors"
              >
                <Download size={12} className="mr-2 flex-shrink-0" />
                <span>Demo: The ICT Playbook</span>
              </a>
            </div>
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
