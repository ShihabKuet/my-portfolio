import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn() = "class names" utility
// Usage: cn("px-4 py-2", isActive && "bg-blue-500")
// Without this, conflicting Tailwind classes cause bugs
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Converts heading text → URL-safe id. e.g. "Why Next.js?" → "why-nextjs" */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/`([^`]+)`/g, "$1")   // strip backticks, keep inner text
    .replace(/[^a-z0-9\s-]/g, "")  // remove special chars
    .trim()
    .replace(/\s+/g, "-");
}