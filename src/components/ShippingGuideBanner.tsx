"use client";

import { useState } from "react";
import { X, ExternalLink, MapPin } from "lucide-react";

const ShippingGuideBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-cyan-50 to-sky-50 border border-cyan-200 rounded-lg p-4 mb-6 shadow-sm">
      {/* <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close banner"
      >
        <X size={18} />
      </button> */}

      <div className="flex items-start gap-3 pr-6">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-cyan-600" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            We Don&apos;t Ship to Your Area?
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            No worries! Find the best baby product options available on Amazon
            with our expert buying guides and recommendations.
          </p>

          <a
            href="https://mishbabyguide.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
          >
            Browse Our Buying Guides
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShippingGuideBanner;
