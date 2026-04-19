import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/mdx";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import BlogCard from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "Blog | Portfolio",
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
  const posts = getAllPosts();
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 6);

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Back link ── */}
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 text-sky-500 dark:text-zinc-500 hover:text-violet-400 transition-colors text-sm mb-10 font-mono"
        >
          <ArrowLeft size={15} />
          Back to Portfolio
        </Link>

        {/* ── Header ── */}
        <div className="mb-16 relative">

          {/* Ghost watermark */}
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

            {/* Top label row */}
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-violet-400">
                ✦ Writing
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
                {posts.length} article{posts.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Split-weight title */}
            <h1 className="mb-4 leading-[1.1]">
              <span
                className="block text-sky-950 dark:text-zinc-100 font-light tracking-[-0.02em]"
                style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
              >
                Things I write
              </span>
              <span
                className="block text-violet-500 dark:text-violet-400 font-extrabold tracking-[-0.04em]"
                style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
              >
                about &amp; explore.
              </span>
            </h1>

            {/* Tapered divider + subtitle */}
            <div className="flex items-start gap-4 mt-5">
              <div className="shrink-0 mt-1 w-[3px] h-9 rounded-sm bg-gradient-to-b from-violet-700 to-transparent" />
              <p className="text-sky-700 dark:text-zinc-400 text-sm leading-relaxed max-w-md">
                Software engineering, networking internals, and the occasional deep-dive
                into things that quietly hold the internet together.
              </p>
            </div>

            {/* Topic chips */}
            <div className="flex flex-wrap gap-2 mt-6">
              {allTags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs px-3 py-1 rounded-full border border-violet-500/20 text-violet-400 bg-violet-500/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Book shelf ── */}
        <div className="space-y-5">
          {posts.map((post, idx) => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              tags={post.tags}
              date={formatDate(post.date)}
              readTime={post.readTime}
              coverImage={post.coverImage}
              theme={THEMES[idx % THEMES.length]}
            />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-sky-400 dark:text-zinc-600 py-16 font-mono">
            No posts yet. Check back soon.
          </p>
        )}
      </div>
    </main>
  );
}