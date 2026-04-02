"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // next-themes causes a hydration mismatch if we render theme-dependent
  // UI on the server. This pattern delays render until client is ready.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />; // placeholder to avoid layout shift

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
        "border border-zinc-700 hover:border-zinc-500",
        "bg-white dark:bg-zinc-900/50 hover:bg-sky-100 dark:bg-zinc-800",
        "bg-white dark:bg-zinc-900/50 dark:hover:bg-sky-100 dark:bg-zinc-800",
        "light:bg-zinc-100 light:hover:bg-zinc-200",
        "text-sky-700 dark:text-zinc-400 hover:text-sky-950 dark:text-zinc-100"
      )}
    >
      {/* Animate between Sun and Moon icons */}
      <span className={cn("absolute transition-all duration-300",
        isDark ? "opacity-100 rotate-0" : "opacity-0 rotate-90")}>
        <Moon size={16} />
      </span>
      <span className={cn("absolute transition-all duration-300",
        isDark ? "opacity-0 -rotate-90" : "opacity-100 rotate-0")}>
        <Sun size={16} />
      </span>
    </button>
  );
}