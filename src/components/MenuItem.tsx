"use client";

import React from "react";

interface MenuItemProps {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  onClick,
  label,
  icon,
  className = "",
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        px-4 
        py-3 
        flex 
        items-center 
        gap-3 
        hover:bg-gray-50 
        transition 
        font-medium
        cursor-pointer
        ${className}
      `}
    >
      {icon}
      {label}
    </div>
  );
};

export default MenuItem;
