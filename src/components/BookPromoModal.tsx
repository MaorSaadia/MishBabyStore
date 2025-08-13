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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-8 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-gradient-to-br from-slate-50 to-cyan-50 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative border border-slate-300 animate-slideUp max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 bg-black/5 rounded-full p-2 text-slate-500 hover:text-slate-900 hover:bg-black/10 transition-all duration-200"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Left Side: Image */}
          <div className="lg:w-2/5 flex items-center justify-center p-6 lg:p-8 bg-slate-200/40 relative">
            <div className="relative w-full max-w-sm">
              <Image
                src="/bundle-cover.png" // Make sure this path is correct
                alt="Smart Money, Simplified and The ICT Playbook Book Bundle by Maor Saadia"
                width={1834}
                height={1032}
                className="rounded-lg shadow-xl w-full h-auto"
                priority
              />
              <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full px-4 py-2 shadow-lg animate-pulse">
                <div className="text-xs font-semibold">ONLY</div>
                <div className="text-xl sm:text-2xl font-bold">$16.17</div>
              </div>
            </div>
          </div>

          {/* Right Side: Content with new beginner-friendly text */}
          <div className="lg:w-3/5 p-6 lg:p-10 flex flex-col justify-center">
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                Ready for a New Way to Grow Your Income?
              </h2>
              <p className="text-cyan-600 font-semibold text-lg">
                Your Complete Guide to Learning a New Financial Skill, From
                Scratch.
              </p>
            </div>

            <p className="text-slate-600 mb-2 sm:mb-2 leading-relaxed -mt-2">
              Ever looked at the financial markets and felt like it was a
              complicated world you couldn&apos;t access? This two-part bundle
              is designed to change that. It&apos;s a simple, step-by-step
              blueprint that teaches you how the markets{" "}
              <em className="font-semibold text-slate-700">really</em> work,
              giving you the confidence to start trading—no experience needed.
            </p>

            <div className="space-y-4 mb-4 sm:mb-6">
              <div className="flex items-start">
                <span className="text-cyan-600 mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-slate-800">
                    Part 1: Your Solid Foundation
                  </strong>
                  <p className="text-slate-500 text-sm">
                    Start from zero and learn the essential building blocks of
                    trading. We&apos;ll teach you how to read price charts and
                    understand why prices move, helping you spot the best
                    opportunities with clarity.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-cyan-600 mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-slate-800">
                    Part 2: Your Professional Playbook
                  </strong>
                  <p className="text-slate-500 text-sm">
                    Once you have the basics, you&apos;ll learn powerful and
                    repeatable trading strategies. This book gives you specific
                    patterns to look for each day, taking the guesswork out of
                    when to buy and sell.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-cyan-600 mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-slate-800">
                    Complete Daily Trading Plan
                  </strong>
                  <p className="text-slate-500 text-sm">
                    Receive a step-by-step checklist to guide you every single
                    day. You&apos;ll have a clear plan, from your morning
                    analysis to executing your trades with confidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 mb-6 text-center">
              <p className="text-cyan-800 text-sm font-semibold">
                🔥 Limited Time Bundle Offer – Get Both Books & Save!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://www.etsy.com/il-en/listing/4348424284/smart-money-simplified-the-ict-playbook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Your Bundle Now →
              </a>
              <button
                onClick={handleClose}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Maybe Later
              </button>
            </div>

            <p className="text-slate-400 text-xs mt-4 text-center">
              Digital download • Instant access • 2 PDF files included
            </p>
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
