"use client";

import { useState, useEffect } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";

const Menu = () => {
  const [open, setOpen] = useState(false);

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

  const menuItems = [
    { href: "/", label: "Shop" },
    { href: "/list?cat=all-products", label: "All Products" },
    { href: "/list?cat=all-products&filter=Sale", label: "Deals" },
    // {
    //   href: "/list?cat=all-products&filter=New Arrival",
    //   label: "New Arrival",
    // },
    { href: "/order-tracking", label: "Order Tracking" },
    { href: "/affiliate-program", label: "Become an Affiliate" },
    { href: "/customer-service", label: "Contact" },
  ];

  return (
    <div className="relative z-40">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {open ? <X size={28} /> : <MenuIcon size={28} />}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-grow">
                <ul className="space-y-4 p-4">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block py-2 px-4 text-lg text-gray-700 hover:bg-gray-100 rounded transition duration-150 ease-in-out"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
