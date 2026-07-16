"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import Container from "./ui/Container";
import { categories } from "@/lib/getCatgeories";
import { cn } from "@/lib/utils";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const navigation = [
  { label: "Shop", href: "/list?cat=all-products" },
  { label: "Shop by Need", href: "/#shop-by-need" },
  { label: "Buying Guides", href: "/blog" },
  { label: "About", href: "/about-us" },
];

function DesktopLink({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href === "/blog" && pathname.startsWith("/blog"));

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-ink-secondary transition hover:bg-brand-soft hover:text-brand-hover",
        active && "text-brand-hover",
      )}
    >
      {label}
    </Link>
  );
}

function CategoriesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event instanceof MouseEvent && !ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-semibold text-ink-secondary transition hover:bg-brand-soft hover:text-brand-hover"
        aria-expanded={open}
        aria-controls="desktop-category-menu"
        onClick={() => setOpen((value) => !value)}
      >
        Categories
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <div id="desktop-category-menu" className="absolute left-0 top-full z-50 mt-2 w-72 rounded-card border border-line bg-white p-2 shadow-elevated">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/list?cat=${category.slug}`}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-ink-secondary transition hover:bg-brand-soft hover:text-brand-hover"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn("sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-sm transition-shadow", scrolled && "shadow-card")}>
      <Container>
        <nav className="flex h-[4.5rem] items-center justify-between gap-2 lg:h-20" aria-label="Primary navigation">
          <Link href="/" className="flex min-h-11 items-center rounded-md" aria-label="MishBaby home">
            <Image src="/mb-logo.png" alt="" width={48} height={50} className="h-12 w-auto sm:h-[3.25rem]" priority />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <DesktopLink {...navigation[0]} />
            <CategoriesDropdown />
            {navigation.slice(1).map((item) => <DesktopLink key={item.href} {...item} />)}
          </div>

          <div className="flex min-w-0 items-center gap-0 sm:gap-2">
            <SearchBar />
            <NavIcons />
            <div className="lg:hidden">
              <MobileMenu />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
