import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseFileName(fileName: string): { name: string; ext: string } {
  const name = fileName.replace(/\.[^/.]+$/, "");
  const ext = fileName.split(".").pop() || "";

  return { name, ext };
}
