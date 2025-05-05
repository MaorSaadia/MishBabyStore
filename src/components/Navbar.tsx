"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import Menu from "./MobileMenu";
import SearchBar from "./SearchBar";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

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

const Navbar = () => {
  return (
    <nav className="h-20 px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-32 relative border-b">
      {/* Mobile and Tablet */}
      <div className="h-full flex items-center justify-between lg:hidden">
        <Link href="/" className="flex items-center">
          <Image
            src="/mb-logo.png"
            alt="MishBaby Logo"
            width={50}
            height={50}
            className="hover:scale-105 transition-transform duration-200"
          />
        </Link>
        <div className="flex items-center gap-4">
          <SearchBar />
          <NavIcons />
          <Menu />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex items-center justify-between h-full">
        {/* Left side */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center group">
            <Image
              src="/mb-logo.png"
              alt="MishBaby Logo"
              width={60}
              height={60}
              className="hover:scale-105 transition-transform duration-200"
            />
          </Link>
          <div className="hidden xl:flex gap-8">
            <Suspense
              fallback={<div className="h-8 w-8 bg-gray-200 rounded-full" />}
            >
              <NavLink href="/list?cat=all-products">All Products</NavLink>
              <NavLink href="/list?cat=all-products&filter=Sale">Deals</NavLink>
              <NavLink href="/order-tracking">Order Tracking</NavLink>
              <NavLink href="/affiliate-program">Become an Affiliate</NavLink>
              <NavLink href="/customer-service">Contact</NavLink>
            </Suspense>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-8">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
