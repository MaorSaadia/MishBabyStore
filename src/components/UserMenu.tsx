"use client";

import { useCallback, useState } from "react";

import MenuItem from "./MenuItem";
import useLoginModal from "@/hooks/useLoginModal";
import Avatar from "./Avatar";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const loginModal = useLoginModal();

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-row items-center">
        <div
          onClick={loginModal.onOpen}
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
              <MenuItem label="Logout" onClick={() => {}} />
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
