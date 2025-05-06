"use client";

import { Suspense, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";

import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

// Category data
const categories = [
  {
    name: "All Products",
    slug: "all-products",
    media: {
      mainMedia: {
        thumbnail: {
          url: "https://static.wixstatic.com/media/f33a90_3dc1fbdabced4021a2595e93267d561b~mv2.png/v1/fit/w_50,h_50,q_90/file.png",
        },
      },
    },
  },
  {
    name: "Baby Clothing",
    slug: "baby-clothing",
    media: {
      mainMedia: {
        thumbnail: {
          url: "https://static.wixstatic.com/media/f33a90_011223fc0b224ac3a1749155dcb3be0f~mv2.jpg/v1/fit/w_50,h_50,q_90/file.jpg",
        },
      },
    },
  },
  {
    name: "Baby Essentials",
    slug: "baby-cares",
    media: {
      mainMedia: {
        thumbnail: {
          url: "https://static.wixstatic.com/media/f33a90_fa2c310aae8b478fbdcbdd2280bc89a0~mv2.jpg/v1/fit/w_50,h_50,q_90/file.jpg",
        },
      },
    },
  },
  {
    name: "Bath Care & Accessories",
    slug: "bath-care",
    media: {
      mainMedia: {
        thumbnail: {
          url: "https://static.wixstatic.com/media/f33a90_df6d03eaabd54c629c2ae2366ec25a95~mv2.jpg/v1/fit/w_50,h_50,q_90/file.jpg",
        },
      },
    },
  },
  {
    name: "Feeding & Mealtime",
    slug: "feeding-mealtime",
    media: {
      mainMedia: {
        thumbnail: {
          url: "https://static.wixstatic.com/media/f33a90_2445162e828242ce8487a296025b597f~mv2.jpg/v1/fit/w_50,h_50,q_90/file.jpg",
        },
      },
    },
  },
  {
    name: "Nursery & Lighting",
    slug: "nursery-decor",
    media: {
      mainMedia: {
        thumbnail: {
          url: "https://static.wixstatic.com/media/f33a90_62e2eb01e46d41188050f9860f35adf0~mv2.jpg/v1/fit/w_50,h_50,q_90/file.jpg",
        },
      },
    },
  },
  {
    name: "Safety & Comfort",
    slug: "safety-comfort",
    media: {
      mainMedia: {
        thumbnail: {
          url: "https://static.wixstatic.com/media/f33a90_ac4c8290ade94d5d8c56ce514654ae2d~mv2.jpg/v1/fit/w_50,h_50,q_90/file.jpg",
        },
      },
    },
  },
  {
    name: "Toys Plush & Games",
    slug: "toys-games",
    media: {
      mainMedia: {
        thumbnail: {
          url: "https://static.wixstatic.com/media/11062b_568ec9bc56854149aa93379800659d18~mv2.jpeg/v1/fit/w_50,h_50,q_90/file.jpg",
        },
      },
    },
  },
];

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract query parameters from href
  const hrefQuery = href.split("?")[1];
  const hrefParams = new URLSearchParams(hrefQuery);

  // Check if the current link is for "All Products" or "Deals"
  const isAllProducts = href === "/list?cat=all-products";
  const isDeals = href === "/list?cat=all-products&filter=Sale";

  const isActive =
    pathname === href.split("?")[0] &&
    // For Deals page
    ((isDeals &&
      searchParams.get("cat") === "all-products" &&
      searchParams.get("filter") === "Sale") ||
      // For All Products page
      (isAllProducts &&
        searchParams.get("cat") === "all-products" &&
        !searchParams.get("filter")) ||
      // For other pages
      (!isAllProducts && !isDeals && href === pathname));

  return (
    <Link
      href={href}
      className={`
        relative py-2 px-1
        text-sm font-medium
        transition-colors duration-200
        hover:text-cyan-600
        group
        ${isActive ? "text-cyan-600" : "text-gray-700"}
      `}
    >
      {children}
      <span
        className={`
        absolute bottom-0 left-0
        h-0.5 bg-cyan-600
        transition-all duration-300 ease-out
        ${isActive ? "w-full" : "w-0"}
        group-hover:w-full
      `}
      />
    </Link>
  );
};

// Categories dropdown component
const CategoriesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("cat");
  const dropdownRef = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef && !dropdownRef[0]?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div
      className="relative"
      ref={dropdownRef[1]}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`
          flex items-center gap-1
          py-2 px-1
          text-sm font-medium
          transition-colors duration-200
          hover:text-cyan-600
          ${currentCategory ? "text-cyan-600" : "text-gray-700"}
        `}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Categories
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 gap-1 p-2 max-h-96 overflow-y-auto">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/list?cat=${category.slug}`}
                className="flex items-center p-2 rounded-md hover:bg-sky-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {category.media?.mainMedia?.thumbnail?.url && (
                  <div className="h-8 w-8 mr-3 relative overflow-hidden rounded-full bg-gray-100 flex-shrink-0">
                    <Image
                      src={category.media.mainMedia.thumbnail.url}
                      alt={category.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-sm">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-30 h-auto bg-white px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-32 
        transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "border-b border-gray-200"
        }`}
    >
      <div className="max-w-screen-2xl mx-auto">
        {/* Mobile and Tablet */}
        <div className="h-16 md:h-20 flex items-center justify-between lg:hidden">
          <div className="flex items-center">
            <Link href="/" className="flex items-center ml-2">
              <Image
                src="/mb-logo.png"
                alt="MishBaby Logo"
                width={45}
                height={45}
                className="hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <SearchBar />
            <NavIcons />
            <MobileMenu />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex items-center justify-between h-20">
          {/* Left side */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center group">
              <Image
                src="/mb-logo.png"
                alt="MishBaby Logo"
                width={60}
                height={60}
                className="hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <div className="flex gap-6">
              <Suspense
                fallback={<div className="h-8 w-8 bg-gray-200 rounded-full" />}
              >
                <CategoriesDropdown />
                <NavLink href="/list?cat=all-products&filter=Sale">
                  Deals
                </NavLink>
                <NavLink href="/order-tracking">Order Tracking</NavLink>
                <NavLink href="/customer-service">Contact</NavLink>
              </Suspense>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <SearchBar />
            <NavIcons />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
