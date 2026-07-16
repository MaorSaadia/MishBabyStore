"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { categories } from "@/lib/getCatgeories";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/list?cat=all-products" },
  { label: "Shop by Need", href: "/#shop-by-need" },
  { label: "Buying Guides", href: "/blog" },
  { label: "About MishBaby", href: "/about-us" },
  { label: "Contact", href: "/customer-service" },
  { label: "Order Tracking", href: "/order-tracking" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setOpen(false);
    setCategoriesOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary transition hover:bg-brand-soft hover:text-brand-hover"
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink/50" onMouseDown={(event) => event.target === event.currentTarget && closeMenu()}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="ml-auto flex h-full w-[min(88vw,24rem)] flex-col overflow-y-auto bg-white shadow-elevated"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4">
              <p className="text-lg font-bold text-ink">Explore MishBaby</p>
              <button ref={closeRef} type="button" onClick={closeMenu} className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary hover:bg-brand-soft hover:text-brand-hover" aria-label="Close navigation menu">
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <nav className="p-4" aria-label="Mobile navigation links">
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={closeMenu} className="flex min-h-12 items-center rounded-lg px-4 text-base font-semibold text-ink-secondary hover:bg-brand-soft hover:text-brand-hover">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-3 border-t border-line pt-3">
                <button type="button" onClick={() => setCategoriesOpen((value) => !value)} className="flex min-h-12 w-full items-center justify-between rounded-lg px-4 text-left font-semibold text-ink-secondary hover:bg-brand-soft hover:text-brand-hover" aria-expanded={categoriesOpen} aria-controls="mobile-category-list">
                  Categories
                  <ChevronDown className={`h-5 w-5 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {categoriesOpen && (
                  <ul id="mobile-category-list" className="mt-1 rounded-lg bg-page p-2">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <Link href={`/list?cat=${category.slug}`} onClick={closeMenu} className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-ink-secondary hover:bg-white hover:text-brand-hover">
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </nav>

            <div className="mt-auto border-t border-line bg-brand-soft p-5">
              <p className="text-sm font-bold text-ink">A calmer way to discover baby products.</p>
              <p className="mt-2 text-sm leading-6 text-ink-secondary">Shopping and fulfillment remain with the selected retailer.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
