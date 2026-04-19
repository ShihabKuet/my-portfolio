"use client";

import Link from "next/link";
import { Calendar, Clock, Tag } from "lucide-react";
import { useState, useCallback } from "react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  readTime: string;
  coverImage?: string;
  theme: { spine: string; accent: string };
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  tags,
  date,
  readTime,
  coverImage,
  theme: t,
}: BlogCardProps) {
  const [active, setActive] = useState(false);
  const hasCover = !!coverImage;

  const activate   = useCallback(() => setActive(true), []);
  const deactivate = useCallback(() => setActive(false), []);

  // On touch: activate on touchstart, deactivate after a short delay
  // so the animation is visible before navigation fires.
  const handleTouchStart = useCallback(() => setActive(true), []);
  const handleTouchEnd   = useCallback(() => {
    setTimeout(() => setActive(false), 400);
  }, []);

  const on = active; // shorthand

  return (
    <Link
      href={`/blog/${slug}`}
      className="block"
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={[
          "relative flex rounded-xl overflow-hidden",
          "bg-white dark:bg-[#0f172a]",
          "transition-all duration-300 ease-out",
          hasCover ? "min-h-[210px]" : "min-h-[164px]",
          on
            ? "-translate-y-1.5 shadow-[0_20px_40px_-6px_rgba(0,0,0,0.14),0_6px_14px_-6px_rgba(0,0,0,0.07)]"
            : "translate-y-0 shadow-sm",
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
            {tags[0] ?? "post"}
          </span>
        </div>

        {/* ── Cover image background ── */}
        {hasCover && (
          <div
            className={[
              "absolute z-0 inset-0 left-[44px] right-[6px] bg-cover bg-right",
              "transition-opacity duration-300",
              on ? "opacity-35" : "opacity-100",
            ].join(" ")}
            style={{
              backgroundImage: `url(${coverImage})`,
              WebkitMaskImage:
                "linear-gradient(to left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 25%, transparent 52%)",
              maskImage:
                "linear-gradient(to left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 25%, transparent 52%)",
            }}
          />
        )}

        {/* ── Cover content ── */}
        <div className="relative z-10 flex-1 overflow-hidden px-7 py-5 flex flex-col gap-3">

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
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
              className={[
                "text-xl font-bold leading-snug line-clamp-2",
                "text-[#0f172a] dark:text-[#f1f5f9]",
                "transition-transform duration-300",
                on ? "-translate-y-[3px]" : "translate-y-0",
              ].join(" ")}
            >
              {title}
            </h2>

            {/* grid-template-rows height reveal */}
            <div
              className={[
                "grid transition-all duration-300 ease-out",
                on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <p className="pt-1.5 text-[0.82rem] leading-[1.75] line-clamp-2 text-[#475569] dark:text-[#94a3b8]">
                  {excerpt}
                </p>
              </div>
            </div>
          </div>

          {/* Meta + CTA */}
          <div
            className={[
              "flex items-center gap-4 font-mono text-[11px] text-[#94a3b8]",
              "transition-opacity duration-300",
              on ? "opacity-65" : "opacity-100",
            ].join(" ")}
          >
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              {readTime}
            </span>
            <span
              className={[
                "ml-auto font-bold tracking-wide text-[11px]",
                "transition-opacity duration-300 delay-75",
                on ? "opacity-100" : "opacity-0",
              ].join(" ")}
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
            background:
              "repeating-linear-gradient(to bottom, #e2e8f0 0, #e2e8f0 2px, #f8fafc 2px, #f8fafc 4px)",
          }}
        />
      </div>
    </Link>
  );
}