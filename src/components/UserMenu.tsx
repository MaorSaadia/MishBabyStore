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

  // console.log(wixClient.auth);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleLogout = async () => {
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    setIsOpen(false);
    router.push(logoutUrl);
  };

  const handleProfile = () => {
    router.push("/profile");
    setIsOpen(false);
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
        <div className="absolute p-3 rounded-md top-12 -left-8 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          <div className="flex flex-col cursor-pointer w-full">
            <>
              <MenuItem label="Profile" onClick={handleProfile} />
              <MenuItem label="Logout" onClick={handleLogout} />
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
