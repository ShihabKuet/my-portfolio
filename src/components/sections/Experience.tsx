"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { Briefcase, Calendar, MapPin } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-4 bg-sky-100/60 dark:bg-zinc-900/30">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Work Experience"
          subtitle="Where I've worked and what I've built."
        />

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-sky-100 dark:bg-zinc-800" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-3.5 top-5 w-5 h-5 rounded-full bg-violet-600 border-4 border-zinc-950" />

                <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/50 border border-sky-200 dark:border-zinc-800/50 hover:border-zinc-700/50 transition-colors">

                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-sky-950 dark:text-zinc-100 font-semibold text-lg flex items-center gap-2">
                        <Briefcase size={18} className="text-violet-400" />
                        {exp.role}
                      </h3>
                      <p className="text-violet-400 font-medium mt-1">{exp.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-zinc-800 text-sky-700 dark:text-zinc-400 text-xs font-mono">
                        <Calendar size={11} />
                        {exp.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sky-500 dark:text-zinc-500 text-xs">
                        <MapPin size={11} />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-2 mb-4">
                    {exp.description.map((point, j) => (
                      <li key={j} className="flex items-start gap-2 text-sky-700 dark:text-zinc-400 text-sm">
                        <span className="text-violet-500 mt-1.5 text-xs">▹</span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-md bg-sky-100 dark:bg-zinc-800/80 text-sky-700 dark:text-zinc-400 text-xs font-mono border border-zinc-700/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}