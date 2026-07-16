"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import useScreenSize from "@/hooks/useScreenSize";
import CartModal from "./modals/CartModal";
import UserMenu from "./UserMenu";

const NavIcons = () => {
  const wixClient = useWixClient();
  const isLargeScreen = useScreenSize();
  const router = useRouter();
  const { counter, getCart } = useCartStore();

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Wix reports "cart not found" until a visitor adds their first item.
    // Keep the temporary ecommerce control available without an unhandled promise.
    void getCart(wixClient).catch(() => undefined);
  }, [wixClient, getCart]);

  const handleCartClick = () => {
    if (isLargeScreen) {
      setIsCartOpen((prev) => !prev);
    } else {
      router.push("/cart");
    }
  };

  return (
    <div className="relative flex items-center gap-1 sm:gap-2">
      <UserMenu />
      <button
        type="button"
        className="relative flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary transition hover:bg-brand-soft hover:text-brand-hover"
        onClick={handleCartClick}
        aria-label={`Open cart with ${counter} ${counter === 1 ? "item" : "items"}`}
      >
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        <span className="absolute right-0.5 top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand-hover px-1 text-[10px] font-bold text-white">
          {counter}
        </span>
      </button>
      {isLargeScreen && isCartOpen && (
        <CartModal onClose={() => setIsCartOpen(false)} />
      )}
    </div>
  );
};

export default NavIcons;
