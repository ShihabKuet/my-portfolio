"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import FunFactBanner from "./FunFactBanner";

// ─── Controller — owns enabled state, renders toggle + banner ─────────────────

export default function FunFactController() {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  // ── Hydrate from localStorage after mount to avoid SSR mismatch ──
  useEffect(() => {
    const stored = localStorage.getItem("funfact-enabled");
    if (stored !== null) setEnabled(stored === "true");
    setMounted(true);
  }, []);

  const toggle = () => {
    setEnabled(prev => {
      const next = !prev;
      localStorage.setItem("funfact-enabled", String(next));
      return next;
    });
  };

  return (
    <>
      {/* ── Toggle button ── */}
      <button
        onClick={toggle}
        aria-label={`${enabled ? "Disable" : "Enable"} fun facts`}
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs",
          "border transition-all duration-300",
          // Suppress flash before hydration
          !mounted && "opacity-0",
          enabled
            ? "bg-violet-50 border-violet-200 text-violet-600 hover:bg-violet-100 dark:bg-violet-950/40 dark:border-violet-800/60 dark:text-violet-400 dark:hover:bg-violet-900/40"
            : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-600 dark:hover:bg-zinc-800/60"
        )}
        style={{ boxShadow: enabled ? "0 0 0 1px rgba(139,92,246,0.15), 0 2px 8px rgba(139,92,246,0.08)" : undefined }}
      >
        <Sparkles size={11} className={enabled ? "text-violet-500" : "text-zinc-400"} />
        Fun Facts
        {/* ON / OFF pill */}
        <span
          className={cn(
            "text-[0.6rem] font-bold tracking-widest px-1.5 py-0.5 rounded-md transition-all duration-200",
            enabled
              ? "bg-violet-500/15 text-violet-500 dark:bg-violet-400/20 dark:text-violet-400"
              : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
          )}
        >
          {enabled ? "ON" : "OFF"}
        </span>
      </button>

      {/* ── Banner — rendered at root level so it's fixed to viewport ── */}
      <FunFactBanner enabled={enabled} />
    </>
  );
}