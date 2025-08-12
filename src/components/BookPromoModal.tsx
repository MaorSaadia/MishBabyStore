"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

export default function BookPromoModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("bookPromoSeen");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShow(true);
        sessionStorage.setItem("bookPromoSeen", "true");
      }, 3000); // 3-second delay
      return () => clearTimeout(timer);
    }
  }, []);

  // Lock/unlock body scroll when modal opens/closes
  useEffect(() => {
    if (show) {
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Restore body scroll
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [show]);

  const handleClose = () => {
    setShow(false);
  };

  // Prevent modal from closing when clicking inside the modal content
  const handleModalClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose} // Close when clicking the backdrop
    >
      {/* FIX: Added max-h-[90vh] and overflow-y-auto to make the modal scrollable on small screens */}
      <div
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-black w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative border border-gray-500 animate-slideUp max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick} // Prevent closing when clicking inside modal
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 bg-white backdrop-blur-sm rounded-full p-2 text-gray-900 hover:text-white hover:bg-white/20 transition-all duration-200"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Left Side: Image */}
          <div className="lg:w-2/5 flex items-center justify-center p-6 lg:p-8 bg-black/20 relative">
            <div className="relative w-full max-w-sm">
              <Image
                src="/bundle-cover.png" // Make sure this path is correct
                alt="Smart Money, Simplified and The ICT Playbook Book Bundle by Maor Saadia"
                width={1834}
                height={1032}
                className="rounded-lg shadow-2xl w-full h-auto"
                priority
              />
              <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full px-4 py-2 shadow-lg animate-pulse">
                <div className="text-xs font-semibold">ONLY</div>
                <div className="text-xl sm:text-2xl font-bold">$16.17</div>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="lg:w-3/5 p-6 lg:p-10 flex flex-col justify-center">
            <div className="mb-4">
              {/* FIX: Reduced heading size on mobile for better fit */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Master Institutional Trading
              </h2>
              <p className="text-blue-400 font-semibold text-lg">
                The Complete A-to-Z Bundle
              </p>
            </div>

            {/* FIX: Reduced bottom margin on mobile */}
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed">
              For the first time, get the{" "}
              <strong className="text-white">full two-part blueprint</strong>{" "}
              that takes you from absolute beginner to elite funded trader. This
              is the
              <strong className="text-white">
                {" "}
                only system you&apos;ll ever need
              </strong>{" "}
              – covering both foundational principles and advanced ICT models.
            </p>

            <div className="space-y-3 mb-4 sm:mb-6">
              <div className="flex items-start">
                <span className="text-green-400 mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-white">
                    Part 1: Smart Money, Simplified
                  </strong>
                  <p className="text-gray-400 text-sm">
                    Master Market Structure, Liquidity, FVGs & Order Blocks.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-white">
                    Part 2: The ICT Playbook
                  </strong>
                  <p className="text-gray-400 text-sm">
                    Advanced models: Silver Bullet, Breaker Blocks & SMT
                    Divergence.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-white">
                    Complete Daily Trading Plan
                  </strong>
                  <p className="text-gray-400 text-sm">
                    Step-by-step checklist from analysis to execution
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6 text-center">
              <p className="text-yellow-300 text-sm font-semibold">
                🔥 Limited Time Bundle Offer – Get Both Books & Save!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://www.etsy.com/il-en/listing/4348424284/smart-money-simplified-the-ict-playbook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Your Bundle Now →
              </a>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Maybe Later
              </button>
            </div>

            <p className="text-gray-300 text-xs mt-4 text-center">
              Digital download • Instant access • 2 PDF files included
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* This CSS is for the fade-in animations and doesn't need to be changed */
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
