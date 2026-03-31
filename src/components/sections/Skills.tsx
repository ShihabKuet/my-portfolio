"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { Skill } from "@/types";

// Category filter tabs
const categories: { label: string; value: Skill["category"] | "all" }[] = [
  { label: "All",       value: "all"       },
  { label: "Languages", value: "languages" },
  { label: "Frontend",  value: "frontend"  },
  { label: "Backend",   value: "backend"   },
  { label: "Tools",     value: "tools"     },
];

export default function Skills() {
  const [active, setActive] = useState<Skill["category"] | "all">("all");

  // Filter skills based on active tab
  const filtered = active === "all"
    ? skills
    : skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="py-24 px-4 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I work with."
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActive(value)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-200",
                active === value
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-200 font-medium text-sm">{skill.name}</span>
                <span className="text-zinc-500 text-xs font-mono">{skill.level}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}