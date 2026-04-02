"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { publications } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { ExternalLink, ChevronDown, ChevronUp, BookOpen, Users, Calendar, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

function PublicationCard({ pub, index }: { pub: (typeof publications)[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-sky-200 dark:border-zinc-800/50 hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5"
    >
      {/* IEEE Badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 shrink-0">
          <BookOpen size={12} className="text-blue-400" />
          <span className="text-blue-400 text-xs font-mono font-medium">
            IEEE Publication
          </span>
        </div>

        {/* Year badge */}
        <span className="flex items-center gap-1.5 text-sky-500 dark:text-zinc-500 text-xs font-mono shrink-0">
          <Calendar size={11} />
          {pub.year}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sky-950 dark:text-zinc-100 font-semibold text-lg leading-snug mb-3 hover:text-violet-300 transition-colors">
        {pub.title}
      </h3>

      {/* Authors */}
      <div className="flex items-start gap-2 mb-3">
        <Users size={14} className="text-violet-400 shrink-0 mt-0.5" />
        <p className="text-sky-700 dark:text-zinc-400 text-sm">
          {pub.authors.map((author, i) => (
            <span key={author}>
              {/* Highlight your name (first author) */}
              <span className={cn(i === 0 && "text-violet-300 font-medium")}>
                {author}
              </span>
              {i < pub.authors.length - 1 && ", "}
            </span>
          ))}
        </p>
      </div>

      {/* Journal/Conference */}
      <div className="flex items-start gap-2 mb-4">
        <Quote size={14} className="text-sky-500 dark:text-zinc-500 shrink-0 mt-0.5" />
        <p className="text-sky-700 dark:text-zinc-400 text-sm italic">{pub.journal}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {pub.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-md bg-sky-100 dark:bg-zinc-800/80 text-sky-700 dark:text-zinc-400 text-xs font-mono border border-zinc-700/50 hover:border-violet-500/40 hover:text-violet-300 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Abstract toggle */}
      {pub.abstract && (
        <div className="mb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sky-500 dark:text-zinc-500 hover:text-violet-400 text-xs font-mono transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Hide Abstract" : "Show Abstract"}
          </button>

          {/* Animated abstract reveal */}
          <motion.div
            initial={false}
            animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-sky-700 dark:text-zinc-400 text-sm leading-relaxed p-4 rounded-lg bg-sky-100 dark:bg-zinc-800/40 border border-zinc-700/30">
              {pub.abstract}
            </p>
          </motion.div>
        </div>
      )}

      {/* Footer — DOI + links */}
      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-sky-200 dark:border-zinc-800/50">
        {pub.doi && (
          <span className="text-sky-400 dark:text-zinc-600 text-xs font-mono">
            DOI: <span className="text-sky-500 dark:text-zinc-500">{pub.doi}</span>
          </span>
        )}

        {pub.link && (
          <a
            href={pub.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 hover:text-blue-300 text-sm font-medium transition-all duration-200"
          >
            <ExternalLink size={14} />
            View on IEEE Xplore
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Publications() {
  return (
    <section id="publications" className="py-24 px-4 bg-sky-100/60 dark:bg-zinc-900/30">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Research"
          subtitle="Peer-reviewed publications and academic contributions."
        />

        <div className="space-y-6">
          {publications.map((pub, i) => (
            <PublicationCard key={pub.title} pub={pub} index={i} />
          ))}
        </div>

        {/* Research metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 grid grid-cols-3 gap-4"
        >
          {[
            { value: `${publications.length}`,  label: "Publication" + (publications.length > 1 ? "s" : "") },
            { value: "IEEE",                     label: "Publisher"   },
            { value: publications[0]?.year ?? "2024", label: "Latest" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-sky-200 dark:border-zinc-800/50">
              <p className="text-2xl font-bold text-violet-400 font-mono mb-1">{value}</p>
              <p className="text-sky-500 dark:text-zinc-500 text-xs">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}