import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/mdx";
import SectionHeading from "@/components/ui/SectionHeading";
import { Calendar, Clock, Tag, Layers, ArrowUpRight } from "lucide-react";

export default function Blog() {
  const allPosts = getAllPosts();

  /* ── Layout split: 1 hero + 2 supporting cards ── */
  const [hero, ...rest] = allPosts;
  const supporting = rest.slice(0, 2);

  /* ── Ghost "teaser" titles – purely decorative, hint at depth ── */
  const teaserTitles = allPosts.slice(3, 9).map((p) => p.title);

  return (
    <section id="blog" className="py-24 px-4 bg-sky-100/60 dark:bg-zinc-900/30 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Blog"
          subtitle="Thoughts on engineering, systems, and tech."
        />

        {/* ── Main grid: hero left, two cards stacked right ── */}
        <div className="grid lg:grid-cols-[1.55fr_1fr] gap-5 mb-5">

          {/* Hero post – large editorial card */}
          {hero && (
            <Link href={`/blog/${hero.slug}`} className="group block">
              <article className="relative h-full flex flex-col p-7 rounded-2xl bg-white dark:bg-zinc-900/60 border border-sky-200 dark:border-zinc-800/50 hover:border-violet-400/40 dark:hover:border-violet-500/30 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-500 overflow-hidden">

                {/* Decorative corner glow – fires on group-hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-16 w-52 h-52 rounded-full bg-violet-400/0 group-hover:bg-violet-400/10 blur-2xl transition-all duration-700"
                />

                {/* "FEATURED" eyebrow label */}
                <span className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-[11px] font-mono tracking-widest uppercase w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  Featured
                </span>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {hero.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-400 text-xs font-mono border border-sky-500/20"
                    >
                      <Tag size={9} />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title – large */}
                <h3 className="text-sky-950 dark:text-zinc-100 font-bold text-xl leading-snug mb-3 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors duration-300">
                  {hero.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sky-700 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {hero.excerpt}
                </p>

                {/* Meta row */}
                <div className="flex items-center justify-between text-xs font-mono mt-auto pt-4 border-t border-sky-200 dark:border-zinc-800/50">
                  <div className="flex items-center gap-3 text-sky-500 dark:text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(hero.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {hero.readTime}
                    </span>
                  </div>

                  {/* Inline CTA arrow – animated on hover */}
                  <span className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300 text-xs">
                    Read article
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </article>
            </Link>
          )}

          {/* Supporting posts – stacked */}
          <div className="flex flex-col gap-5">
            {supporting.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block flex-1">
                <article className="relative h-full flex flex-col p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-sky-200 dark:border-zinc-800/50 hover:border-violet-400/40 dark:hover:border-violet-500/30 shadow-sm hover:shadow-lg hover:shadow-violet-500/8 transition-all duration-400 overflow-hidden">

                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-violet-400/0 group-hover:bg-violet-400/10 blur-xl transition-all duration-600"
                  />

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-mono border border-violet-500/20"
                      >
                        <Tag size={9} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-sky-950 dark:text-zinc-100 font-semibold text-base leading-snug mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors duration-300 flex-grow">
                    {post.title}
                  </h3>

                  <p className="text-sky-700 dark:text-zinc-400 text-sm leading-relaxed mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-3 text-sky-500 dark:text-zinc-500 text-xs font-mono mt-auto pt-3 border-t border-sky-200 dark:border-zinc-800/50">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readTime}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────
            ARCHIVE GATEWAY – the real CTA.
            Looks like a "door" to the blog: shows ghost titles scrolling
            behind frosted glass, with a strong invitation to enter.
        ──────────────────────────────────────────────────────────────── */}
        <Link href="/blog" className="group block">
          <div className="relative rounded-2xl border border-sky-200 dark:border-zinc-800/50 hover:border-violet-500/50 transition-all duration-500 overflow-hidden bg-white dark:bg-zinc-900/60 shadow-sm hover:shadow-xl hover:shadow-violet-500/10">

            {/* Ghost titles – scrolling ticker (CSS animation, no JS) */}
            <div
              aria-hidden
              className="absolute inset-0 flex flex-col gap-3 p-5 opacity-[0.06] dark:opacity-[0.08] select-none pointer-events-none overflow-hidden"
              style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)" }}
            >
              {/* Render teaser titles twice so the scroll loops seamlessly */}
              {[...teaserTitles, ...teaserTitles].map((title, i) => (
                <p
                  key={i}
                  className="text-sky-950 dark:text-zinc-100 font-semibold text-sm leading-snug whitespace-nowrap"
                  style={{
                    animation: "blogScroll 18s linear infinite",
                    animationDelay: `${i * -2.2}s`,
                    transform: "translateY(0)",
                  }}
                >
                  {title}
                </p>
              ))}
            </div>

            {/* ── Light mode background: animated aurora mesh ── */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-violet-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900" />

            {/* Animated blob 1 — violet, top-left */}
            <div className="absolute -top-10 -left-10 w-52 h-52 rounded-full
              bg-violet-300/40 dark:bg-violet-600/15
              blur-2xl animate-[archiveBlob1_7s_ease-in-out_infinite_alternate]
              pointer-events-none" />

            {/* Animated blob 2 — cyan, bottom-right */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full
              bg-cyan-300/40 dark:bg-cyan-700/15
              blur-2xl animate-[archiveBlob2_9s_ease-in-out_infinite_alternate]
              pointer-events-none" />

            {/* Animated blob 3 — sky, center — only visible on hover */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-32 rounded-full
              bg-sky-200/0 group-hover:bg-sky-200/50 dark:bg-sky-500/0 dark:group-hover:bg-sky-500/10
              blur-3xl transition-all duration-700
              pointer-events-none" />

            {/* Diagonal shimmer sweep on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full
              transition-transform duration-1000
              bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent
              skew-x-12 pointer-events-none" />

            {/* Grid dot texture — adds premium depth */}
            <div
              className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />

            {/* Top edge accent line — violet gradient */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 dark:via-violet-500/40 to-transparent" />

            {/* Foreground content */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-7">
              {/* Left: icon + copy */}
              <div className="flex items-center gap-5">
                {/* Archive icon pill */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/20 group-hover:border-violet-500/40 transition-all duration-300">
                  <Layers size={26} className="text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300" />
                </div>

                <div>
                  {/* Article count badge */}
                  <span className="inline-flex items-center gap-1.5 mb-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-[11px] font-mono tracking-wider">
                    {allPosts.length}+ articles &amp; counting
                  </span>

                  <p className="text-sky-950 dark:text-zinc-100 font-bold text-lg leading-tight">
                    There&apos;s a whole archive waiting for you.
                  </p>
                  <p className="text-sky-600 dark:text-zinc-400 text-sm mt-1">
                    Deep dives, quick takes, and everything in between — all in one place.
                  </p>
                </div>
              </div>

              {/* Right: CTA pill */}
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-violet-600 group-hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 group-hover:scale-105">
                  Enter the ARTICLE Archive
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>
            </div>

            {/* Subtle violet shimmer sweep on hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-violet-400/8 to-transparent skew-x-12"
            />
          </div>
        </Link>

        {/* Keyframe for ghost title scroll – injected as a global style tag */}
        {/* eslint-disable-next-line react/no-unknown-property */}
        <style>{`
          @keyframes archiveBlob1 {
            0%   { transform: translate(0px, 0px)   scale(1);    }
            100% { transform: translate(30px, 20px) scale(1.2);  }
          }
          @keyframes archiveBlob2 {
            0%   { transform: translate(0px,   0px)   scale(1.1); }
            100% { transform: translate(-25px, -20px) scale(0.9); }
          }
        `}</style>
      </div>
    </section>
  );
}