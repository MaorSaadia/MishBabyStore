"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SearchBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false); // State to toggle search input visibility

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/list?name=${encodeURIComponent(searchTerm.trim())}`);
    }
    setSearchTerm("");
    setIsSearchVisible(false);
  };

  return (
    <div className="relative">
      {/* Search Icon (visible on mobile) */}
      <button
        onClick={() => setIsSearchVisible(!isSearchVisible)}
        className="sm:hidden text-white rounded-full p-2 transition-colors duration-200 hover:opacity-60"
      >
        <Image src="/search.png" alt="Search" width={20} height={20} />
      </button>

      {isSearchVisible && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setIsSearchVisible(false)}
          ></div>

          <form
            className="fixed top-0 left-0 right-0 z-50 flex items-center bg-white shadow-md px-4 py-2 w-full rounded-sm"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            <button
              type="submit"
              className="text-white rounded-full p-2 transition-colors duration-200 hover:opacity-60"
            >
              <Image src="/search.png" alt="Search" width={20} height={20} />
            </button>
          </form>
        </>
      )}

      <form
        className="hidden sm:flex items-center justify-between gap-16 bg-white shadow-md rounded-full px-4 py-2 max-w-md w-full mx-auto mr-8"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        <button
          type="submit"
          className="text-white rounded-full p-2 transition-colors duration-200 hover:opacity-60"
        >
          <Image src="/search.png" alt="Search" width={20} height={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
