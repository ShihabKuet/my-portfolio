import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/mdx";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

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
          {posts.map((post, idx) => {
            const t = THEMES[idx % THEMES.length];
            const hasCover = !!post.coverImage;

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <div
                  className={[
                    "relative flex rounded-xl overflow-hidden",
                    "bg-white dark:bg-[#0f172a]",
                    "shadow-sm",
                    "transition-all duration-300 ease-out",
                    "group-hover:-translate-y-1.5",
                    "group-hover:shadow-[0_20px_40px_-6px_rgba(0,0,0,0.14),0_6px_14px_-6px_rgba(0,0,0,0.07)]",
                    hasCover ? "min-h-[210px]" : "min-h-[164px]",
                  ].join(" ")}
                >
                  {/* ── Spine ── */}
                  <div
                    className="relative z-10 flex shrink-0 items-center justify-center"
                    style={{
                      width: 44,
                      background: t.spine,
                      boxShadow: "inset -4px 0 10px rgba(0,0,0,0.18)",
                    }}
                  >
                    <span
                      className="font-bold uppercase select-none"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        color: "rgba(255,255,255,0.82)",
                        fontSize: 10,
                        fontFamily: "monospace",
                        letterSpacing: "0.18em",
                      }}
                    >
                      {post.tags[0] ?? "post"}
                    </span>
                  </div>

                  {/* ── Cover image background ── */}
                  {hasCover && (
                    <div
                      className="absolute z-0 inset-0 left-[44px] right-[6px] bg-cover bg-right opacity-100 group-hover:opacity-15 transition-opacity duration-300"
                      style={{
                        backgroundImage: `url(${post.coverImage})`,
                        WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 25%, transparent 52%)",
                        maskImage: "linear-gradient(to left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 25%, transparent 52%)",
                      }}
                    />
                  )}

                  {/* ── Cover content ── */}
                  <div className="relative z-10 flex-1 overflow-hidden px-7 py-5 flex flex-col gap-3">

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px]"
                          style={{
                            background: `${t.spine}18`,
                            color: t.accent,
                            border: `1px solid ${t.spine}40`,
                          }}
                        >
                          <Tag size={9} />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title + sliding excerpt */}
                    <div>
                      <h2
                        className="text-xl font-bold leading-snug line-clamp-2 text-[#0f172a] dark:text-[#f1f5f9] transition-transform duration-300 group-hover:-translate-y-[3px]"
                      >
                        {post.title}
                      </h2>

                      {/* grid-template-rows trick for smooth height animation */}
                      <div
                        className="grid transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 [grid-template-rows:0fr] group-hover:[grid-template-rows:1fr]"
                      >
                        <div className="overflow-hidden">
                          <p className="pt-1.5 text-[0.82rem] leading-[1.75] line-clamp-2 text-[#475569] dark:text-[#94a3b8]">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Meta + CTA */}
                    <div className="flex items-center gap-4 font-mono text-[11px] text-[#94a3b8] transition-opacity duration-300 group-hover:opacity-65">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} />
                        {post.readTime}
                      </span>
                      <span
                        className="ml-auto font-bold tracking-wide text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75"
                        style={{ color: t.accent }}
                      >
                        Read →
                      </span>
                    </div>
                  </div>

                  {/* ── Page-edge stripe ── */}
                  <div
                    className="relative z-10 shrink-0 w-[6px]"
                    style={{
                      background: "repeating-linear-gradient(to bottom, #e2e8f0 0, #e2e8f0 2px, #f8fafc 2px, #f8fafc 4px)",
                    }}
                  />
                </div>
              </Link>
            );
          })}
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