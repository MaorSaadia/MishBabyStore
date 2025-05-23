/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Phone,
  Users,
  Search,
  Home,
  Tag,
  Package,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

import { categories } from "@/lib/getCatgeories";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<"categories" | null>(
    null
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
      setExpandedCategory(null); // Reset category expansion on close
    }, 300); // Match the duration of the Tailwind transition (300ms)
  };

  // Social media icons for footer
  const socialIcons = [
    {
      name: "Instagram",
      icon: <FaInstagram size={18} />,
      url: "https://www.instagram.com/mishbabystore",
    },
    {
      name: "Facebook",
      icon: <FaFacebook size={18} />,
      url: "https://www.facebook.com/profile.php?id=61567086625746",
    },
    {
      name: "TikTok",
      icon: <FaTiktok size={18} />,
      url: "https://www.tiktok.com/@mishbaby_shop",
    },
    {
      name: "YouTube",
      icon: <FaYoutube size={18} />,
      url: "https://www.youtube.com/@MishBabyShop",
    },
  ];

  // Filter for only visible categories
  const mainMenuItems = [
    { href: "/", label: "Home", icon: <Home size={20} /> },
    {
      href: "/list?cat=all-products",
      label: "Shop All",
      icon: <ShoppingBag size={20} />,
    },
    {
      href: "/bundle-deals",
      label: "Bundle Deals",
      icon: <Package size={20} />,
    },
    {
      href: "/list?cat=all-products",
      label: "Shop Deals",
      icon: <Tag size={20} />,
    },
    {
      href: "/order-tracking",
      label: "Order Tracking",
      icon: <Search size={20} />,
    },
    {
      href: "/affiliate-program",
      label: "Become an Affiliate",
      icon: <Users size={20} />,
    },
    { href: "/customer-service", label: "Contact", icon: <Phone size={20} /> },
  ];

  return (
    <div className="relative z-40">
      <button
        onClick={() => (open ? handleClose() : setOpen(true))}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-200"
        aria-label="Menu"
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {open && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
        >
          <div
            className={`absolute right-0 top-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
              isClosing ? "translate-x-full" : "translate-x-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-grow">
                <div className="px-4 py-2 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Main Navigation
                  </h3>
                </div>
                <ul className="space-y-1 p-2">
                  {mainMenuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center py-2 px-4 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition duration-150 ease-in-out"
                        onClick={handleClose}
                      >
                        <span className="mr-3 text-gray-500">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="px-4 py-2 bg-gray-50 mt-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Shop by Category
                  </h3>
                </div>

                <div className="mt-1">
                  <button
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === "categories" ? null : "categories"
                      )
                    }
                    className="w-full flex items-center justify-between py-2 px-4 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 focus:outline-none focus:bg-cyan-50 focus:text-cyan-600"
                  >
                    <span className="font-medium">Categories</span>
                    {expandedCategory === "categories" ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>

                  {expandedCategory === "categories" && (
                    <div className="bg-gray-50 py-1 px-2 mx-2 rounded-lg">
                      <ul className="space-y-1">
                        {categories.map((category) => (
                          <li key={category.slug}>
                            <Link
                              href={`/list?cat=${category.slug}`}
                              className="flex items-center py-2 px-3 text-gray-700 hover:bg-white hover:text-cyan-600 rounded-md transition duration-150 ease-in-out"
                              onClick={handleClose}
                            >
                              {category.media?.mainMedia?.thumbnail?.url && (
                                <div className="h-6 w-6 mr-3 relative overflow-hidden rounded-full bg-gray-100 flex-shrink-0">
                                  <img
                                    src={category.media.mainMedia.thumbnail.url}
                                    alt={category.name}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-sm">{category.name}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </nav>

              {/* Mobile Footer */}
              <div className="mt-auto border-t border-gray-300">
                {/* Footer Content */}
                <div className="bg-gray-100 p-4">
                  {/* Social Icons */}
                  <div className="mb-4">
                    <p className="text-xs text-cyan-600 font-medium mb-2 text-center">
                      Follow Us
                    </p>
                    <div className="flex space-x-3 items-center justify-center mb-3">
                      {socialIcons.map((social) => (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                          aria-label={social.name}
                        >
                          <span className="text-gray-600 hover:text-cyan-600">
                            {social.icon}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Payment Icons */}
                  <div className="flex justify-center space-x-2 mb-3">
                    {["paypal", "mastercard", "visa", "american-express"].map(
                      (payment) => (
                        <Image
                          key={payment}
                          src={`/${payment}.png`}
                          alt={payment}
                          width={24}
                          height={24}
                          className="h-6 w-auto"
                        />
                      )
                    )}
                  </div>

                  {/* Copyright */}
                  <p className="text-xs text-center text-gray-500 mt-2">
                    © 2025 MishBaby. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
