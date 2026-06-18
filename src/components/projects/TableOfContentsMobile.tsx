"use client";

import { useEffect, useRef, useState } from "react";
import { AlignLeft, X } from "lucide-react";
import type { TOCEntry } from "@/lib/projects";

interface Props {
  entries: TOCEntry[];
}

export default function TableOfContentsMobile({ entries }: Props) {
  const [activeId, setActiveId] = useState<string>(entries[0]?.id ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Mirror desktop scroll-tracking logic (same OFFSET)
  useEffect(() => {
    if (entries.length === 0) return;

    const onScroll = () => {
      const OFFSET = 140;
      const headings = entries
        .map(({ id }) => ({ id, el: document.getElementById(id) }))
        .filter((x): x is { id: string; el: HTMLElement } => x.el !== null);

      for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].el.getBoundingClientRect().top <= OFFSET) {
          setActiveId(headings[i].id);
          return;
        }
      }
      if (headings.length > 0) setActiveId(headings[0].id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [entries]);

  // Lock body scroll while sheet is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (entries.length === 0) return null;

  const activeEntry = entries.find((e) => e.id === activeId);

  return (
    // Only visible below lg breakpoint
    <div className="lg:hidden">
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        className={[
          "fixed bottom-0 left-0 right-0 z-50",
          "rounded-t-2xl",
          "bg-white dark:bg-zinc-950",
          "border-t border-zinc-200 dark:border-zinc-800",
          "max-h-[70vh] flex flex-col",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        {/* Sheet header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-400 dark:text-zinc-600">
            On this page
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close table of contents"
          >
            <X size={15} />
          </button>
        </div>

        {/* TOC list */}
        <nav
          aria-label="Table of contents"
          className="overflow-y-auto px-5 py-3 pb-safe"
        >
          <ul className="space-y-0.5 pb-4">
            {entries.map((entry) => {
              const isActive = activeId === entry.id;
              const isH3 = entry.level === 3;
              return (
                <li key={entry.id} style={{ paddingLeft: isH3 ? "10px" : "0" }}>
                  <a
                    href={`#${entry.id}`}
                    onClick={() => setIsOpen(false)}
                    className={[
                      "block text-xs font-mono py-1.5 pl-2.5 border-l-2 leading-snug transition-all duration-150",
                      isActive
                        ? "text-violet-400 border-violet-500"
                        : "text-zinc-500 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500",
                    ].join(" ")}
                  >
                    {entry.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Floating capsule button */}
      <button
        onClick={() => setIsOpen(true)}
        className={[
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
          "flex items-center gap-2 px-4 py-2.5 rounded-full",
          "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md",
          "border border-violet-500/25 dark:border-violet-500/20",
          "shadow-lg shadow-black/10 dark:shadow-black/40",
          "text-xs font-mono text-violet-400",
          "transition-all duration-200",
          "hover:border-violet-500/50 hover:shadow-violet-500/15",
          "active:scale-95",
          isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100",
        ].join(" ")}
        aria-label="Open table of contents"
        aria-expanded={isOpen}
        aria-controls="mobile-toc-sheet"
      >
        <AlignLeft size={13} className="shrink-0" />
        <span className="max-w-[200px] truncate">
          {activeEntry?.text ?? "On this page"}
        </span>
        <span className="text-zinc-400 dark:text-zinc-600 text-[10px] shrink-0">▲</span>
      </button>
    </div>
  );
}
