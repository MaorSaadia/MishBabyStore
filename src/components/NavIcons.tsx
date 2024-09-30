"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import useScreenSize from "@/hooks/useScreenSize";
import CartModal from "./CartModal";
import UserMenu from "./UserMenu";

const NavIcons = () => {
  const wixClient = useWixClient();
  const isLargeScreen = useScreenSize();
  const router = useRouter();
  const { counter, getCart } = useCartStore();

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  const handleCartClick = () => {
    if (isLargeScreen) {
      setIsCartOpen((prev) => !prev);
    } else {
      router.push("/cart");
    }
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <UserMenu />
      <div className="relative cursor-pointer" onClick={handleCartClick}>
        <Image src="/cart.png" alt="" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-cyan-600 rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>
      {isLargeScreen && isCartOpen && (
        <CartModal onClose={() => setIsCartOpen(false)} />
      )}
    </div>
  );
};

export default NavIcons;
