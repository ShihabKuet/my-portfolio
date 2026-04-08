// Props = the inputs a component accepts (like function arguments)
// By typing them with TypeScript, you get autocomplete & safety
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Section counter — auto-increments across the page
// Keeps the 0x01, 0x02... address accurate without manual tracking
let _sectionCounter = 0;

interface SectionHeadingProps {
  title:     string;
  subtitle?: string;
  align?:    "left" | "center";
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-60px" });

  // Stable per-instance address — increments on first render only
  const addrRef = useRef<string | null>(null);
  if (!addrRef.current) {
    _sectionCounter++;
    addrRef.current = `0x${_sectionCounter.toString(16).padStart(2, "0").toUpperCase()}`;
  }
  const addr = addrRef.current;

  const isCentered = align === "center";

  return (
    <div
      ref={ref}
      className={`mb-14 ${isCentered ? "text-center" : "text-left"}`}
    >
      {/* ── Top meta row ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className={`flex items-center gap-3 mb-2.5 ${isCentered ? "justify-center" : "justify-start"}`}
      >
        {/* Left fade line — centered only */}
        {isCentered && (
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-violet-500 dark:to-amber-50" />
        )}

        {/* Memory address */}
        <span className="font-mono text-[10px] tracking-widest text-violet-500/40 dark:text-violet-100/40">
          {addr}
        </span>

        {/* Function signature tag */}
        <span className="font-mono text-[11px] text-violet-500 dark:text-violet-300 tracking-wide">
          fn section() {"{"}
        </span>

        {/* Right fade line — always */}
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-violet-500 dark:to-amber-50" />
      </motion.div>

      {/* ── Title row ── */}
      <div
        className={`flex items-baseline gap-3 ${
          isCentered ? "justify-center" : "justify-start"
        }`}
      >
        {/* Opening bracket */}
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-mono text-3xl font-bold text-violet-600/25 dark:text-violet-400/20 leading-none select-none"
        >
          [
        </motion.span>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="text-[1.85rem] sm:text-4xl font-black tracking-tight text-violet-500 dark:text-amber-300 leading-none"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {title}
        </motion.h2>

        {/* Blinking cursor */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55 }}
          className="self-center"
        >
          <motion.span
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
            className="inline-block w-[2px] h-6 bg-violet-500 dark:bg-violet-400 align-middle"
          />
        </motion.span>

        {/* Closing bracket */}
        <motion.span
          initial={{ opacity: 0, x: 8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-mono text-3xl font-bold text-violet-600/25 dark:text-violet-400/20 leading-none select-none"
        >
          ]
        </motion.span>
      </div>

      {/* ── Subtitle ── */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.3 }}
          className={`mt-2.5 font-mono text-[12px] text-sky-600/70 dark:text-zinc-500 tracking-wide ${
            isCentered ? "text-center" : "text-left"
          }`}
        >
          <span className="text-violet-500/50 dark:text-violet-400/40 mr-1">{"{"}</span>
          {subtitle}
          <span className="text-violet-500/50 dark:text-violet-400/40 mr-1">{" }"}</span>
        </motion.p>
      )}

      {/* ── Closing rule ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        style={{ originX: isCentered ? 0.5 : 0 }}
        className={`flex items-center gap-2 mt-4 ${
          isCentered ? "justify-center" : "justify-start"
        }`}
      >
        {isCentered && (
          <div className="h-px flex-1 bg-sky-200/60 dark:bg-zinc-700" />
        )}
        <div className="w-1.5 h-1.5 rounded-full bg-violet-500/30 dark:bg-violet-400/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-violet-500/30 dark:bg-violet-400/20" />
        <div className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-500" />
        <div className="h-px flex-1 bg-sky-200/60 dark:bg-zinc-700" />
      </motion.div>
    </div>
  );
}