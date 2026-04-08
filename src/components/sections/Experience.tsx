"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { experiences } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { Briefcase, Calendar, MapPin, Wifi, Terminal, ChevronDown } from "lucide-react";

export default function Experience() {
  const [expanded, setExpanded] = useState<Set<number>>(                  // Start with all experiences expanded
    new Set(experiences.map((_, i) => i))
  );
  // const [expanded, setExpanded] = useState<Set<number>>(new Set([0])); // Start with only the most recent experience expanded
  // const [expanded, setExpanded] = useState<Set<number>>(new Set());    // Start with all experiences collapsed

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <section id="experience" className="py-24 px-4 bg-sky-100/60 dark:bg-zinc-900/30">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Work Experience"
          subtitle="Where I've worked and what I've built."
        />

        <div className="relative">

          {/* Backbone spine */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-violet-400 via-sky-500 to-violet-400 opacity-40" />

          {/* Top hub node */}
          <div className="relative flex items-center gap-3 mb-10 pl-0">
            <div className="relative z-10 w-12 h-12 rounded-full bg-violet-600/20 border border-violet-500/50 flex items-center justify-center">
              <Wifi size={16} className="text-violet-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-zinc-900 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-mono text-violet-400 tracking-widest uppercase">CAREER_NETWORK</p>
              <p className="text-xs font-mono text-zinc-500">node://experience • uptime: active</p>
            </div>
          </div>

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-16"
              >
                {/* Branch line from spine to node dot */}
                <div className="absolute left-[23px] top-6 w-7 h-px bg-gradient-to-r from-violet-500/60 to-sky-500/40" />

                {/* Node dot on spine */}
                <div className="absolute left-[18px] top-[18px] w-[17px] h-[17px] rounded-full bg-zinc-950 border-2 border-violet-500 z-10 flex items-center justify-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
                </div>

                {/* Device panel card */}
                <div className="rounded-xl overflow-hidden border border-violet-500/20 bg-white dark:bg-zinc-900/60 hover:border-violet-500/50 transition-colors">

                  {/* Card header bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700/50">
                    <div className="flex items-center gap-2">
                      <Terminal size={12} className="text-violet-400" />
                      <span className="text-xs font-mono text-violet-400 tracking-wider">
                        {`DEV_NODE_${String(i).padStart(2, "0")}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono ${i === 0 ? "text-emerald-400" : "text-zinc-500"}`}>
                        {i === 0 ? "● ACTIVE" : "○ CLOSED"}
                      </span>
                      <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                        {`PKT_${String((i + 1) * 137 % 900 + 100)}`}
                      </span>
                    </div>
                  </div>

                  {/* Card body — always visible */}
                  <div className="p-5">

                    {/* Role + company + date + location — always visible */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-sky-950 dark:text-zinc-100 font-semibold text-base flex items-center gap-2">
                          <Briefcase size={15} className="text-violet-400" />
                          {exp.role}
                        </h3>
                        {exp.link ? (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 font-mono text-sm mt-1 hover:underline hover:text-violet-300 transition"
                          >
                            {`⌁ ${exp.company}`}
                          </a>
                        ) : (
                          <p className="text-violet-400 font-mono text-sm mt-1">{`⌁ ${exp.company}`}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-zinc-800 text-sky-700 dark:text-zinc-400 text-xs font-mono">
                          <Calendar size={10} />
                          {exp.duration}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sky-500 dark:text-zinc-500 text-xs font-mono">
                          <MapPin size={10} />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Description — collapsible, toggled by button */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: expanded.has(i) ? "auto" : 0,
                        opacity: expanded.has(i) ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="mb-4 space-y-2">
                        {exp.description.map((point, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm text-sky-700 dark:text-zinc-400">
                            <span className="font-mono text-violet-500/70 text-xs mt-0.5 shrink-0">{`[${j + 1}]`}</span>
                            {point}
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Toggle button + tech tags — always visible */}
                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/60">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-mono text-zinc-400 tracking-wider">PROTOCOLS://</p>
                        <button
                          onClick={() => toggle(i)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border transition-all duration-200
                            ${expanded.has(i)
                              ? "bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500/20"
                              : "bg-violet-600 border-violet-500 text-white hover:bg-violet-500 shadow-sm shadow-violet-500/30"
                            }`}
                        >
                          {expanded.has(i) ? "collapse" : "expand details"}
                          <ChevronDown
                            size={12}
                            className={`transition-transform duration-300 ${expanded.has(i) ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-xs font-mono
                              bg-violet-500/10 text-violet-400
                              border border-violet-500/20
                              hover:bg-violet-500/20 transition-colors cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom termination node */}
          <div className="relative flex items-center gap-3 mt-10 pl-0">
            <div className="relative z-10 w-12 h-12 rounded-full bg-zinc-800/40 border border-zinc-600/40 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
            </div>
            <p className="text-xs font-mono text-zinc-500 tracking-widest">END_OF_CHAIN • null route</p>
          </div>

        </div>
      </div>
    </section>
  );
}