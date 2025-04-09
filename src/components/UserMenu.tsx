"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { LogOut, User, ChevronDown, Package } from "lucide-react";
import Cookies from "js-cookie";

import { useWixClient } from "@/hooks/useWixClient";
import useLoginModal from "@/hooks/useLoginModal";
import MenuItem from "./MenuItem";
import Avatar from "./Avatar";

const UserMenu = () => {
  const router = useRouter();
  const wixClient = useWixClient();
  const loginModal = useLoginModal();
  const menuRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = wixClient.auth.loggedIn();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");

  // Fetch user information if logged in
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isLoggedIn) {
        try {
          const { member } = await wixClient.members.getCurrentMember();
          if (member?.profile?.nickname || member?.contact?.firstName) {
            setUserName(
              member?.profile?.nickname ?? member?.contact?.firstName ?? "User"
            );
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, [isLoggedIn, wixClient.members]);

  // Handle clicking outside of the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleLogout = async () => {
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    setIsOpen(false);

    toast.success("Logging out...");
    router.push(logoutUrl);
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/profile");
    setIsOpen(false);
  };

  const handleOrders = () => {
    router.push("/orders");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={isLoggedIn ? toggleOpen : loginModal.onOpen}
        className="flex items-center gap-1 rounded-full border border-gray-200 p-1 pr-2 shadow-sm hover:shadow-md transition cursor-pointer"
      >
        <Avatar src="/profile.png" />
        <div className="hidden md:block">
          <div className="text-sm font-semibold">
            {isLoggedIn ? userName : "Sign in"}
          </div>
        </div>
        <ChevronDown size={16} className="text-gray-600" />
      </div>

      {isOpen && (
        <div className="absolute rounded-xl overflow-hidden top-12 right-0 w-56 bg-white text-sm shadow-lg border border-gray-100 z-20">
          {isLoggedIn && (
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-medium truncate">{userName || "User"}</p>
            </div>
          )}
          <div className="py-2">
            <MenuItem
              label="Profile"
              icon={<User size={16} />}
              onClick={handleProfile}
            />
            <MenuItem
              label="My Orders"
              icon={<Package size={16} />}
              onClick={handleOrders}
            />
            <MenuItem
              label="Log out"
              icon={<LogOut size={16} />}
              onClick={handleLogout}
              className="text-red-500 hover:bg-red-50"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
