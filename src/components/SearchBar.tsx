"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside search to close mobile search
  useEffect(() => {
    if (!isSearchVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchVisible(false);
      }
    };

    // Focus input when search becomes visible
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchVisible]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/list?name=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsSearchVisible(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const focusClass = isFocused
    ? "border-cyan-400 ring-2 ring-cyan-100"
    : "border-gray-200";

  return (
    <div className="relative" ref={searchContainerRef}>
      {/* Mobile search toggle button */}
      <button
        onClick={() => setIsSearchVisible(!isSearchVisible)}
        className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-cyan-600 transition-colors"
        aria-label="Toggle search"
      >
        <Search size={20} />
      </button>

      {/* Mobile search overlay */}
      {isSearchVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden" />
      )}

      {/* Mobile search form */}
      <div
        className={`
          fixed lg:hidden top-0 left-0 right-0 p-4 bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isSearchVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSearchVisible(false)}
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-label="Close search"
          >
            <X size={20} />
          </button>

          <div
            className={`flex-1 flex items-center border rounded-full px-4 py-2 ${focusClass}`}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="mr-1 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Desktop search form */}
      <div className="hidden lg:block relative">
        <form
          onSubmit={handleSearch}
          className={`
            flex items-center bg-white rounded-full 
            px-4 py-2 w-64 xl:w-80 2xl:w-96
            border ${focusClass} transition-all duration-200
          `}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search products..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="mr-1 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            className="ml-1 text-gray-600 hover:text-cyan-600 transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
