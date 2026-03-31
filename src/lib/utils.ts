import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn() = "class names" utility
// Usage: cn("px-4 py-2", isActive && "bg-blue-500")
// Without this, conflicting Tailwind classes cause bugs
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}