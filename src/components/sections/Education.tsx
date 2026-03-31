"use client";

import { motion } from "framer-motion";
import { education } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { GraduationCap, Calendar } from "lucide-react";

export default function Education() {
  return (
    <section id="education" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Education"
          subtitle="My academic background and qualifications."
        />

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-800" />

          <div className="space-y-8">
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-3.5 top-5 w-5 h-5 rounded-full bg-violet-600 border-4 border-zinc-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-zinc-100 font-semibold text-lg flex items-center gap-2">
                        <GraduationCap size={18} className="text-violet-400" />
                        {edu.institution}
                      </h3>
                      <p className="text-violet-400 font-medium mt-1">{edu.degree}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-mono">
                        <Calendar size={11} />
                        {edu.duration}
                      </span>
                      <p className="text-emerald-400 text-sm font-mono mt-2">{edu.result}</p>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-zinc-400 text-sm leading-relaxed">{edu.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}