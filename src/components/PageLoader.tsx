"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const PageLoader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [transition, setTransition] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [progress, setProgress] = useState(0);

  // Track route changes
  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Update current URL on mount and when pathname/searchParams change
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    // Show the loader
    const handleStart = () => {
      setLoading(true);
      setProgress(0); // Reset progress when loading starts
      clearTimeout(timer);
    };

    // Begin hiding the loader
    const handleComplete = () => {
      // Force progress to 100 when completing
      setProgress(100);

      timer = setTimeout(() => {
        setTransition(true);

        // Fully hide the loader after transition
        setTimeout(() => {
          setLoading(false);
          setTransition(false);
        }, 300);
      }, 300); // Keep showing for a bit even when loaded
    };

    // Create a simple router change detector
    if (typeof window !== "undefined") {
      // Log initial render - only on first mount
      if (currentUrl === "") {
        handleStart();
        handleComplete();
      }

      // Add click listener for navigation
      const handleLinkClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest("a");

        if (
          link &&
          link.href &&
          link.href.startsWith(window.location.origin) &&
          !link.href.includes("#") &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          // Check if this is the same URL we're currently on
          const isSameUrl = link.href === currentUrl;

          // Only show loader for new destinations
          if (!isSameUrl) {
            handleStart();
          }
        }
      };

      document.addEventListener("click", handleLinkClick);

      return () => {
        document.removeEventListener("click", handleLinkClick);
        clearTimeout(timer);
      };
    }
  }, [pathname, searchParams, currentUrl]);

  // Simulate progress when loader is shown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading && !transition) {
      interval = setInterval(() => {
        setProgress((prev) => {
          // Move faster at beginning, slower near completion, but never reach 100%
          // (we'll set it to 100% when actually complete)
          const increment = Math.max(1, 8 - Math.floor(prev / 10));
          const newValue = prev + increment;
          // Cap at 95% during simulated progress
          return newValue >= 95 ? 95 : newValue;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [loading, transition]);

  // Complete the loader when pathname or searchParams change
  useEffect(() => {
    if (loading && currentUrl !== "") {
      // URL has changed, complete the loading
      const timer = setTimeout(() => {
        // Force progress to 100%
        setProgress(100);
        setTransition(true);

        setTimeout(() => {
          setLoading(false);
          setTransition(false);
        }, 300);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, loading, currentUrl]);

  if (!loading) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center transition-all duration-500"
      style={{ opacity: transition ? 0 : 1 }}
    >
      {/* Main progress bar */}
      <div className="w-full h-2 bg-gray-200/20">
        <div
          className="h-full bg-gradient-to-r from-cyan-300 via-cyan-500 to-blue-500 relative transition-all duration-300"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute top-0 right-0 bottom-0 left-0 w-24 h-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          {/* Pulsing glow effect */}
          <div className="absolute right-0 top-0 h-full w-6 -mr-3 rounded-full bg-blue-500 animate-pulse blur-sm"></div>
        </div>
      </div>

      {/* Loading indicator below the progress bar - just the dots */}
      <div className="mt-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full flex items-center shadow-lg">
        <div className="flex">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="h-1.5 w-1.5 bg-blue-500 rounded-full mx-0.5 animate-bounce"
              style={{
                animationDelay: `${dot * 0.15}s`,
                animationDuration: "0.6s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
