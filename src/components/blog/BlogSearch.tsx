"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BlogCard from "@/components/blog/BlogCard";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  readTime: string;
  coverImage?: string;
  theme: { spine: string; accent: string };
}

interface BlogSearchProps {
  posts: Post[];
  allTags: string[];
}

// ── Animation variants ─────────────────────────────────────────────────────
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      delay: i * 0.055,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.97,
    transition: {
      duration: 0.2,
      ease: [0.55, 0, 1, 0.45],
    },
  },
};

const emptyVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: 0.1 },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2 },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: { duration: 0.15 },
  },
};

// ──────────────────────────────────────────────────────────────────────────────

export default function BlogSearch({ posts, allTags }: BlogSearchProps) {
  const [query, setQuery]               = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [open, setOpen]                 = useState(false);
  const inputRef                        = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const clearAll = useCallback(() => {
    setQuery("");
    setSelectedTags([]);
    setOpen(false);
  }, []);

  const hasFilters = query.trim() !== "" || selectedTags.length > 0;

  const filtered = posts.filter((post) => {
    const q = query.trim().toLowerCase();
    const textMatch =
      q === "" ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));
    const tagMatch =
      selectedTags.length === 0 ||
      selectedTags.some((t) => post.tags.includes(t));
    return textMatch && tagMatch;
  });

  return (
    <div>
      {/* ── Search + tag row ── */}
      <div className="mb-8 flex flex-col gap-4">

        <div className="flex items-center gap-3">

          {/* Pill → input */}
          <div
            className={[
              "relative flex items-center font-mono text-xs rounded-xl",
              "bg-zinc-50 dark:bg-zinc-900",
              "transition-all duration-300 ease-out",
              open ? "flex-1" : "w-auto cursor-pointer group/search hover:-translate-y-0.5",
            ].join(" ")}
            style={{
              boxShadow: open
                ? "0 0 0 1.5px rgba(139,92,246,0.55), 0 4px 20px rgba(139,92,246,0.13)"
                : "0 0 0 1px rgba(139,92,246,0.18), 0 1px 4px rgba(0,0,0,0.06)",
            }}
            onClick={() => !open && setOpen(true)}
          >
            {!open && (
              <span
                className="absolute inset-0 rounded-xl opacity-0 group-hover/search:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: "0 0 0 1.5px rgba(139,92,246,0.55), 0 4px 20px rgba(139,92,246,0.13)" }}
              />
            )}

            <span className="flex items-center gap-2.5 px-4 py-2 w-full">
              <Search
                size={13}
                className={open ? "text-violet-400 shrink-0" : "text-zinc-400 dark:text-zinc-600 shrink-0"}
              />

              {!open && (
                <>
                  <span className="text-zinc-400 dark:text-zinc-600 whitespace-nowrap">
                    Search articles...
                  </span>
                  <span className="ml-3 flex items-center gap-0.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 text-[10px] font-sans">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 text-[10px] font-sans">K</kbd>
                  </span>
                </>
              )}

              {open && (
                <>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type to search..."
                    className="flex-1 bg-transparent outline-none text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs font-mono min-w-0"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); clearAll(); }}
                    className="shrink-0 p-0.5 rounded-md text-zinc-400 hover:text-violet-400 hover:bg-violet-500/10 transition-colors duration-200"
                  >
                    <X size={13} />
                  </button>
                </>
              )}
            </span>
          </div>

          {/* Animated result count badge */}
          <AnimatePresence mode="popLayout">
            {hasFilters && (
              <motion.span
                key="count"
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="shrink-0 font-mono text-[11px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1.5 rounded-xl whitespace-nowrap"
              >
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Filter icon pill */}
          {!open && !hasFilters && (
            <div
              className="relative shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs
                text-zinc-400 dark:text-zinc-600 cursor-pointer
                bg-zinc-50 dark:bg-zinc-900
                hover:-translate-y-0.5 transition-all duration-300 group/filter"
              style={{ boxShadow: "0 0 0 1px rgba(139,92,246,0.18), 0 1px 4px rgba(0,0,0,0.06)" }}
              onClick={() => setOpen(true)}
            >
              <span
                className="absolute inset-0 rounded-xl opacity-0 group-hover/filter:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: "0 0 0 1.5px rgba(139,92,246,0.55), 0 4px 20px rgba(139,92,246,0.13)" }}
              />
              <SlidersHorizontal size={12} />
              <span className="hidden sm:inline">Filter</span>
            </div>
          )}
        </div>

        {/* ── Tag filter chips ── */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <motion.button
                key={tag}
                onClick={() => toggleTag(tag)}
                whileTap={{ scale: 0.94 }}
                className={[
                  "font-mono text-xs px-3 py-1 rounded-full border transition-all duration-200",
                  active
                    ? "bg-violet-500/20 border-violet-500/60 text-violet-400 -translate-y-0.5"
                    : "bg-violet-500/5 border-violet-500/20 text-violet-400/60 hover:bg-violet-500/10 hover:border-violet-500/40 hover:text-violet-400",
                ].join(" ")}
                style={
                  active
                    ? { boxShadow: "0 0 0 1px rgba(139,92,246,0.3), 0 4px 12px rgba(139,92,246,0.1)" }
                    : {}
                }
              >
                {active ? "✦ " : ""}{tag}
              </motion.button>
            );
          })}

          <AnimatePresence>
            {hasFilters && (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.94 }}
                onClick={clearAll}
                className="font-mono text-xs px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-400 hover:text-rose-400 hover:border-rose-400/40 transition-colors duration-200"
              >
                × clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Animated card list ── */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          // Wrap the whole list so AnimatePresence can swap list ↔ empty state
          <motion.div
            key="results"
            className="space-y-5"
            // No animation on the wrapper itself — children handle it
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.slug}
                  layout
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  // layout animation for when cards reorder / siblings exit
                  layoutId={post.slug}
                  transition={{
                    layout: {
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  }}
                >
                  <BlogCard
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    tags={post.tags}
                    date={post.date}
                    readTime={post.readTime}
                    coverImage={post.coverImage}
                    theme={post.theme}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            variants={emptyVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="py-20 text-center"
          >
            {/* Animated empty-state icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl mb-4 select-none"
            >
              🔍
            </motion.div>
            <p className="font-mono text-sm text-zinc-400 dark:text-zinc-600 mb-2">
              No articles match{query ? ` "${query}"` : " the selected filters"}.
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={clearAll}
              className="font-mono text-xs text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-4"
            >
              Clear filters
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}