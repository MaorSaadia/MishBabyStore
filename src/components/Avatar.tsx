"use client";

import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <Image
      className="rounded-full"
      width={22}
      height={22}
      alt="Avatar"
      src={src || "/profile.png"}
    />
  );
};

export default Avatar;
