"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { useWixClient } from "@/hooks/useWixClient";
import useLoginModal from "@/hooks/useLoginModal";
import MenuItem from "./MenuItem";
import Avatar from "./Avatar";

const UserMenu = () => {
  const router = useRouter();
  const wixClient = useWixClient();
  const loginModal = useLoginModal();

  const isLoggedIn = wixClient.auth.loggedIn();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleLogout = async () => {
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    router.push(logoutUrl);
  };

  return (
    <div className="relative">
      <div className="flex flex-row items-center">
        <div
          onClick={isLoggedIn ? toggleOpen : loginModal.onOpen}
          className="rounded-full hover:opacity-70 transition cursor-pointer"
        >
          <Avatar src="/profile.png" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-auto min-w-[100px] max-w-[100px] bg-white overflow-hidden right-0 top-12 text-sm z-50">
          <div className="flex flex-col cursor-pointer w-full">
            <>
              <MenuItem label="Favorites" onClick={() => {}} />
              <MenuItem label="Logout" onClick={handleLogout} />
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
