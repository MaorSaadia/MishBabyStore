"use client";

import { BookOpen, Star, ExternalLink, TrendingUp } from "lucide-react";

const GuidePromoBanner = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-50 via-sky-50 to-cyan-50 border border-cyan-200 rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Left side - Icon and badge */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1.5 shadow-md">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Middle - Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <span className="bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">
                NEW
              </span>
              <span className="text-gray-600 text-sm font-medium flex items-center gap-1">
                <TrendingUp size={14} />
                Expert Resources
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Discover Our New Parenting Website Guides
            </h2>

            <p className="text-gray-700 text-base md:text-lg mb-1">
              Expert buying guides, honest product reviews, blogs, and parenting
              tips to help you make the best choices for your baby.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                <span>Product Recommendation</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                <span>Buying Guides</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                <span>Parenting Tips & Blogs</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                <span>Expert Reviews</span>
              </div>
            </div>
          </div>

          {/* Right side - CTA */}
          <div className="flex-shrink-0">
            <a
              href="https://mishbabyguide.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-lg">Explore Guides</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            {/* <p className="text-center text-xs text-gray-500 mt-2">
              Available on Amazon
            </p> */}
          </div>
        </div>
      </div>

      {/* Bottom decorative strip */}
      <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-cyan-600"></div>
    </div>
  );
};

export default GuidePromoBanner;
