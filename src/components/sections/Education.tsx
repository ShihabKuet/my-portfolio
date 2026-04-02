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
          title="Education (Endian View)"
          subtitle="Same data, different ordering — just like Little vs Big Endian."
        />

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setMode("little")}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition ${
                mode === "little"
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Little Endian
            </button>
            <button
              onClick={() => setMode("big")}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition ${
                mode === "big"
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Big Endian
            </button>
          </div>
        </div>

        {/* Timeline */}
        <motion.div layout className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800" />

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
                    {/* Dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-6 w-5 h-5 rounded-full bg-violet-600 border-4 border-zinc-950 z-10" />

                    {/* Card */}
                    <motion.div
                      layout
                      className="w-[45%] p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-zinc-100 font-semibold text-lg flex items-center gap-2">
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
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-mono">
                            <Calendar size={11} />
                            {edu.duration}
                          </span>
                          <p className="text-emerald-400 text-sm font-mono mt-2">
                            {edu.result}
                          </p>
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          {edu.description}
                        </p>
                      )}

                      {/* Memory + Stack Direction */}
                      <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                        <div className="px-2 py-1 rounded bg-zinc-800 text-violet-400">
                          {`ADDR: 0x${(0x3e8 + i * 0x10).toString(16).toUpperCase()}`}
                        </div>

                        <div className="flex items-center gap-2 text-zinc-500">
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
        <div className="mt-16 text-center text-sm text-zinc-500 font-mono">
          {mode === "little"
            ? "Little Endian → Earliest → Latest (like LSB first in memory)"
            : "Big Endian → Latest → Earliest (like MSB first in memory)"}
        </div>
      </div>
    </section>
  );
}
