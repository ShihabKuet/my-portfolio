"use client";

import { useEffect, useState } from "react";
import type { TOCEntry } from "@/lib/projects";

interface Props {
  entries: TOCEntry[];
}

export default function TableOfContents({ entries }: Props) {
  const [activeId, setActiveId] = useState<string>(entries[0]?.id ?? "");

  useEffect(() => {
    if (entries.length === 0) return;

    const onScroll = () => {
      const OFFSET = 140; // px from top to consider "active"

      const headings = entries
        .map(({ id }) => ({ id, el: document.getElementById(id) }))
        .filter((x): x is { id: string; el: HTMLElement } => x.el !== null);

      // Walk backward — first heading whose top is above OFFSET wins
      for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].el.getBoundingClientRect().top <= OFFSET) {
          setActiveId(headings[i].id);
          return;
        }
      }
      // If scrolled above all headings, highlight the first
      if (headings.length > 0) setActiveId(headings[0].id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-400 dark:text-zinc-600 mb-4">
        On this page
      </p>

      <ul className="space-y-0.5">
        {entries.map((entry) => {
          const isActive = activeId === entry.id;
          const isH3 = entry.level === 3;

          return (
            <li key={entry.id} style={{ paddingLeft: isH3 ? "10px" : "0" }}>
              <a
                href={`#${entry.id}`}
                className={[
                  "block text-xs font-mono py-1 pl-2.5 border-l-2 leading-snug transition-all duration-150",
                  isActive
                    ? "text-violet-400 border-violet-500"
                    : "text-zinc-500 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800 hover:text-zinc-300 hover:border-zinc-500",
                ].join(" ")}
              >
                {entry.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}