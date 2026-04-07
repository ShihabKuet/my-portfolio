"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { education } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { GraduationCap, Calendar } from "lucide-react";

export default function EducationEndian() {
  const [mode, setMode] = useState<"little" | "big">("little");

  const orderedEducation =
    mode === "little" ? [...education] : [...education].reverse();

  return (
    <section id="education" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="ACADEMIC QUALIFICATIONS"
          subtitle="My educational background and achievements"
        />

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setMode("little")}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition ${
                mode === "little"
                  ? "bg-violet-600 text-white"
                  : "text-sky-700 dark:text-zinc-400 hover:text-white"
              }`}
            >
              Little Endian View
            </button>
            <button
              onClick={() => setMode("big")}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition ${
                mode === "big"
                  ? "bg-violet-600 text-white"
                  : "text-sky-700 dark:text-zinc-400 hover:text-white"
              }`}
            >
              Big Endian View
            </button>
          </div>
        </div>

        {/* Timeline */}
        <motion.div layout className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-sky-100 dark:bg-zinc-800" />

          <motion.div layout className="space-y-12">
            <AnimatePresence>
              {orderedEducation.map((edu, i) => {
                const isLeft = i % 2 === 0;

                return (
                  <motion.div
                    key={edu.institution + mode + i}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{
                      layout: { duration: 0.6, type: "spring" },
                      opacity: { duration: 0.3 },
                    }}
                    className={`relative flex ${
                      isLeft ? "justify-start" : "justify-end"
                    }`}
                  >

                    {/* Arrow */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-4 z-10">
                      <svg
                        width="36"
                        height="28"
                        viewBox="0 0 36 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transform: isLeft ? "scaleX(-1)" : "scaleX(1)",
                          filter: "drop-shadow(0 0 6px rgba(139,92,246,0.7))",
                        }}
                      >
                        {/* Tail line */}
                        <line x1="2" y1="14" x2="24" y2="14" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
                        {/* Arrowhead — filled chevron */}
                        <path d="M18 5 L34 14 L18 23 L22 14 Z" fill="#7c3aed" />
                        {/* Inner highlight on arrowhead */}
                        <path d="M22 9 L30 14 L22 19 L24.5 14 Z" fill="#a78bfa" opacity="0.5" />
                        {/* Tail accent dots */}
                        <circle cx="8"  cy="14" r="1.5" fill="#a78bfa" opacity="0.6" />
                        <circle cx="14" cy="14" r="1.5" fill="#a78bfa" opacity="0.4" />
                      </svg>
                    </div>

                    {/* Card */}
                    <motion.div
                      layout
                      className="w-[45%] p-6 rounded-xl bg-white dark:bg-zinc-500/30 border border-sky-200 dark:border-zinc-800/50 hover:border-blue-700/50 hover:bg-amber-100/90 dark:hover:bg-blue-900/50 transition"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-sky-950 dark:text-zinc-100 font-semibold text-lg flex items-center gap-2">
                            <GraduationCap
                              size={18}
                              className="text-violet-400"
                            />
                            {edu.institution}
                          </h3>
                          <p className="text-violet-400 font-medium mt-1">
                            {edu.degree}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-zinc-800 text-sky-700 dark:text-zinc-400 text-xs font-mono">
                            <Calendar size={11} />
                            {edu.duration}
                          </span>
                          <p className="text-emerald-400 text-sm font-mono mt-2">
                            {edu.result}
                          </p>
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-sky-700 dark:text-zinc-400 text-sm leading-relaxed">
                          {edu.description}
                        </p>
                      )}

                      {/* Memory + Stack Direction */}
                      <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                        <div className="px-2 py-1 rounded bg-sky-100 dark:bg-zinc-800 text-violet-400">
                          {`ADDR: 0x${(0x3e8 + i * 0x10).toString(16).toUpperCase()}`}
                        </div>

                        <div className="flex items-center gap-2 text-sky-500 dark:text-zinc-500">
                          {mode === "little" ? (
                            <>
                              <span>STACK ↓</span>
                              <div className="w-3 h-3 border-b-2 border-r-2 border-zinc-500 rotate-45" />
                            </>
                          ) : (
                            <>
                              <span>STACK ↑</span>
                              <div className="w-3 h-3 border-t-2 border-l-2 border-zinc-500 rotate-45" />
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Explanation */}
        <div className="mt-16 text-center text-sm text-sky-500 dark:text-zinc-500 font-mono">
          {mode === "little"
            ? "Little Endian → Earliest → Latest (like LSB first in memory)"
            : "Big Endian → Latest → Earliest (like MSB first in memory)"}
        </div>
      </div>
    </section>
  );
}
