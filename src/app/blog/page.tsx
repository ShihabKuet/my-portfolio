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

  return (
    <main className="min-h-screen py-24 px-4">
      <style>{`
        /* ── Book card ──────────────────────────────────── */

        .bk { display: block; }

        .bk-body {
          position: relative;
          display: flex;
          border-radius: 12px;
          overflow: hidden;
          min-height: 164px;
          transition: transform 0.32s ease, box-shadow 0.32s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.07);
          /* Card background lives here so the image can sit on top of it */
          background: #ffffff;
        }
        .dark .bk-body { background: #0f172a; }

        .bk-body.has-cover { min-height: 210px; }

        .bk:hover .bk-body {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -6px rgba(0,0,0,0.14), 0 6px 14px -6px rgba(0,0,0,0.07);
        }

        /* ── Cover image background ── */
        /*
          Sits between the spine and page-edge, behind the content.
          Gradient mask: fully visible (65%) on the right, fading to
          invisible at ~52% from the right — so the left reading area
          stays clean against the card background.
        */
        .bk-bg {
          position: absolute;
          inset: 0;
          left: 44px;  /* clear the spine */
          right: 6px;  /* clear the page-edge stripe */
          background-size: cover;
          background-position: right center;
          -webkit-mask-image: linear-gradient(
            to left,
            rgba(0, 0, 0, 0.65) 0%,
            rgba(0, 0, 0, 0.35) 25%,
            transparent 52%
          );
          mask-image: linear-gradient(
            to left,
            rgba(0, 0, 0, 0.65) 0%,
            rgba(0, 0, 0, 0.35) 25%,
            transparent 52%
          );
          opacity: 1;
          transition: opacity 0.32s ease;
          z-index: 0;
        }
        .bk:hover .bk-bg { opacity: 0.15; }

        /* ── Cover panel (content sits above the image) ── */
        .bk-cover {
          flex: 1;
          overflow: hidden;
          padding: 20px 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: transparent; /* let bk-body bg + image show through */
          position: relative;
          z-index: 1;
        }

        /* Title nudges up on hover */
        .bk-title {
          font-size: 1.2rem;
          font-weight: 700;
          line-height: 1.35;
          transition: transform 0.32s ease;
        }
        .bk:hover .bk-title { transform: translateY(-3px); }

        /* Excerpt slides up into view */
        .bk-excerpt-wrap {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition: grid-template-rows 0.36s ease, opacity 0.28s ease;
        }
        .bk:hover .bk-excerpt-wrap {
          grid-template-rows: 1fr;
          opacity: 1;
        }
        .bk-excerpt-inner { overflow: hidden; }
        .bk-excerpt {
          padding-top: 6px;
          font-size: 0.82rem;
          line-height: 1.75;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Meta row */
        .bk-meta {
          font-family: monospace;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: opacity 0.28s ease;
        }
        .bk:hover .bk-meta { opacity: 0.65; }

        /* "Read →" CTA fades in */
        .bk-cta {
          margin-left: auto;
          font-weight: 700;
          letter-spacing: 0.08em;
          font-size: 11px;
          opacity: 0;
          transition: opacity 0.28s ease 0.08s;
        }
        .bk:hover .bk-cta { opacity: 1; }

        /* ── Page-edge stripe ── */
        .bk-edge {
          flex-shrink: 0;
          width: 6px;
          position: relative;
          z-index: 1;
          background: repeating-linear-gradient(
            to bottom,
            #e2e8f0 0, #e2e8f0 2px,
            #f8fafc 2px, #f8fafc 4px
          );
        }
        .dark .bk-edge {
          background: repeating-linear-gradient(
            to bottom,
            #334155 0, #334155 2px,
            #1e293b 2px, #1e293b 4px
          );
        }

        /* ── Light / dark text ── */
        .bk-title         { color: #0f172a; }
        .dark .bk-title   { color: #f1f5f9; }

        .bk-meta          { color: #94a3b8; }

        .bk-excerpt       { color: #475569; }
        .dark .bk-excerpt { color: #94a3b8; }
      `}</style>

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
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-violet-500" />
            <span className="text-violet-400 text-sm font-mono tracking-widest uppercase">Blog</span>
            <div className="h-px w-8 bg-violet-500" />
          </div>
          <h1 className="text-4xl font-bold text-sky-950 dark:text-zinc-100 mb-3">
            Writing & Thoughts
          </h1>
          <p className="text-sky-700 dark:text-zinc-400">
            Articles on software engineering, networking, and things I find interesting.
          </p>
        </div>

        {/* ── Book shelf ── */}
        <div className="space-y-5">
          {posts.map((post, idx) => {
            const t = THEMES[idx % THEMES.length];
            const hasCover = !!post.coverImage;

            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="bk">
                <div className={`bk-body ${hasCover ? "has-cover" : ""}`}>

                  {/* ── Spine ── */}
                  <div
                    style={{
                      width: 44,
                      flexShrink: 0,
                      background: t.spine,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "inset -4px 0 10px rgba(0,0,0,0.18)",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <span
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        color: "rgba(255,255,255,0.82)",
                        fontSize: 10,
                        fontFamily: "monospace",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        userSelect: "none",
                      }}
                    >
                      {post.tags[0] ?? "post"}
                    </span>
                  </div>

                  {/* ── Cover image background (only when present) ── */}
                  {hasCover && (
                    <div
                      className="bk-bg"
                      style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                  )}

                  {/* ── Cover content ── */}
                  <div className="bk-cover">

                    {/* Tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "2px 8px",
                            borderRadius: 4,
                            background: `${t.spine}18`,
                            color: t.accent,
                            border: `1px solid ${t.spine}40`,
                            fontFamily: "monospace",
                            fontSize: 11,
                          }}
                        >
                          <Tag size={9} />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title + sliding excerpt */}
                    <div>
                      <h2 className="bk-title line-clamp-2">{post.title}</h2>
                      <div className="bk-excerpt-wrap">
                        <div className="bk-excerpt-inner">
                          <p className="bk-excerpt">{post.excerpt}</p>
                        </div>
                      </div>
                    </div>

                    {/* Meta + CTA */}
                    <div className="bk-meta">
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Calendar size={11} />
                        {formatDate(post.date)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock size={11} />
                        {post.readTime}
                      </span>
                      <span className="bk-cta" style={{ color: t.accent }}>
                        Read →
                      </span>
                    </div>
                  </div>

                  {/* ── Page edge ── */}
                  <div className="bk-edge" />
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