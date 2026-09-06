import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeImageUrl(url: any): string {
  if (!url) return "";
  if (typeof url !== "string") {
    if (url.url && typeof url.url === "string") {
      return normalizeImageUrl(url.url);
    }
    return "";
  }
  // Fix double slash issues, especially from playfood CDN
  if (url.includes("https://static.playfood.com/")) {
    return url.replace(/\.com\/\//g, ".com/");
  }
  // Generic double slash in path (after protocol)
  return url.replace(/([^:]\/)\/+/g, "$1");
}
