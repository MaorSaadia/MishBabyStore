"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

// import useFavorite from "@/app/hooks/useFavorite";

interface HeartButtonProps {
  listingId: any;
}

const HeartButton: React.FC<HeartButtonProps> = ({ listingId }) => {
  const hasFavorited = false;
  return (
    <div
      onClick={() => {
        console.log("|jh");
      }}
      className="
        relative
        hover:opacity-80
        transition
        cursor-pointer
      "
    >
      <AiOutlineHeart
        size={28}
        className="
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
        "
      />
      <AiFillHeart
        size={24}
        className={hasFavorited ? "fill-rose-500" : "fill-neutral-400/80"}
      />
    </div>
  );
};

export default HeartButton;
