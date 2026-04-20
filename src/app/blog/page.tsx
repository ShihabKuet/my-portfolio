import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/mdx";
import type { Metadata } from "next";
import BlogSearch from "@/components/blog/BlogSearch";

export const metadata: Metadata = {
  title: "Blog | MD SHANJID AREFIN",
  description: "Thoughts on software engineering, networking, and technology.",
};

const THEMES = [
  { spine: "#7c3aed", accent: "#a78bfa" },
  { spine: "#0369a1", accent: "#38bdf8" },
  { spine: "#065f46", accent: "#34d399" },
  { spine: "#9f1239", accent: "#f87171" },
  { spine: "#92400e", accent: "#fbbf24" },
  { spine: "#1e3a5f", accent: "#60a5fa" },
];

export default function BlogPage() {
  const raw     = getAllPosts();
  const allTags = Array.from(new Set(raw.flatMap((p) => p.tags))).slice(0, 6);

  // Assign stable themes by original index before any filtering happens
  const posts = raw.map((post, idx) => ({
    ...post,
    date:  formatDate(post.date),
    theme: THEMES[idx % THEMES.length],
  }));

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Back nav ── */}
        <div className="inline-flex mb-10 group/nav">
          <span
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs
              bg-zinc-50 dark:bg-zinc-900
              transition-all duration-300 ease-out
              group-hover/nav:-translate-y-0.5
              group-hover/nav:bg-white dark:group-hover/nav:bg-zinc-900/80"
            style={{
              boxShadow: "0 0 0 1px rgba(139,92,246,0.18), 0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <span
              className="absolute inset-0 rounded-xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: "0 0 0 1.5px rgba(139,92,246,0.55), 0 4px 20px rgba(139,92,246,0.13)" }}
            />
            <span className="text-violet-400 dark:text-violet-500 select-none">❯</span>
            <span className="flex items-center gap-1">
              <span className="text-zinc-400 dark:text-zinc-600 select-none">~/</span>
              <Link
                href="/"
                className="text-sky-600 dark:text-sky-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-200"
              >
                portfolio
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">/</span>
              <span className="text-zinc-500 dark:text-zinc-400">blog</span>
            </span>
            <span className="text-violet-400 opacity-0 translate-x-1 group-hover/nav:opacity-60 group-hover/nav:translate-x-0 transition-all duration-300 select-none">
              ↵
            </span>
          </span>
        </div>

        {/* ── Header ── */}
        <div className="mb-16 relative">
          <div
            aria-hidden
            className="absolute -top-6 -left-4 select-none pointer-events-none leading-none tracking-[-0.06em] font-black z-0"
            style={{
              fontSize: "clamp(80px, 18vw, 148px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(139,92,246,0.12)",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            BLOG
          </div>

          <div className="relative z-10 pt-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-violet-400">
                ✦ ARTICLES
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
                {posts.length} article{posts.length !== 1 ? "s" : ""}
              </span>
            </div>

            <h1 className="mb-4 leading-[1.1]">
              <span
                className="block text-sky-950 dark:text-zinc-100 font-light tracking-[-0.02em]"
                style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
              >
                Thoughts, Ideas I
              </span>
              <span
                className="block text-violet-500 dark:text-violet-400 font-extrabold tracking-[-0.04em]"
                style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
              >
                examine &amp; push further.
              </span>
            </h1>

            <div className="flex items-start gap-4 mt-5">
              <div className="shrink-0 mt-1 w-[3px] h-9 rounded-sm bg-gradient-to-b from-violet-700 to-transparent" />
              <p className="text-sky-700 dark:text-zinc-400 text-sm leading-relaxed max-w-md">
                Software engineering, networking internals, and the occasional deep-dive
                into things that quietly hold the internet together.
              </p>
            </div>
          </div>
        </div>

        {/* ── Search + tag filters + cards (client) ── */}
        <BlogSearch posts={posts} allTags={allTags} />

      </div>
    </main>
  );
}