import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to format date as DD/MM/YYYY
export const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to format Names
export const anonymizeName = (fullName: string) => {
  // Handle empty strings
  if (!fullName || fullName.trim() === "") {
    return "";
  }

  if (fullName === "Anonymous") return fullName;

  // Trim and split the name by spaces
  const nameParts = fullName.trim().split(" ");

  // Get first letter of the first name
  const firstLetter = nameParts[0].charAt(0);

  // Get first letter of the last name
  const lastName = nameParts[nameParts.length - 1];
  const lastNameFirstLetter = lastName.charAt(0);

  // Create the masked format: first letter + asterisks + first letter of last name
  return `${firstLetter}***${lastNameFirstLetter}`;
};

export const convertWixImageToUrl = (wixImage: string) => {
  if (!wixImage.startsWith("wix:image://v1/")) return null;

  const path = wixImage.split("wix:image://v1/")[1].split("#")[0];
  return `https://static.wixstatic.com/media/${path}`;
};
