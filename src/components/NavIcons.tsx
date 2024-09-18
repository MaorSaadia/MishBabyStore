"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import CartModal from "./CartModal";
import UserMenu from "./UserMenu";

const NavIcons = () => {
  const wixClient = useWixClient();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, counter, getCart } = useCartStore();

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <UserMenu />
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-cyan-600 rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>
      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </div>
  );
};

export default NavIcons;
