"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import TechBadge from "@/components/ui/TechBadge";
import { cn } from "@/lib/utils";
import { FaGithub } from "react-icons/fa";
import { ExternalLink, Folder, Star } from "lucide-react";

// Dynamically build filter list from actual project data
// "all" is always first, then unique categories from projects array
const buildFilters = () => {
  const categories = projects.map((p) => p.category);
  const unique = Array.from(new Set(categories));
  return ["all", ...unique];
};

// ─── Featured Project Card (large, 2-column layout) ─────────────────────────
function FeaturedCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative grid md:grid-cols-2 gap-6 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/0 to-indigo-600/0 group-hover:from-violet-600/5 group-hover:to-indigo-600/5 transition-all duration-500 pointer-events-none" />

      {/* Left — Image placeholder */}
      <div className="relative w-full rounded-xl overflow-hidden border border-zinc-700/30 bg-zinc-800/50">

        {/* This div creates the 16:9 box — padding-bottom: 56.25% = 9/16 */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {project.image ? (
            <>

{/* ----  className attributes described below for image  ----
    object-cover:   Fills the box, crops the overflow — good for portraits
    object-contain: Shrinks to fit entirely, no cropping — good for screenshots/GIFs
    object-fill:    Stretches to fill — distorts the image, avoid this */}

              <img
                src={`/projects/${project.image}`}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-zinc-950/20 group-hover/img:bg-zinc-950/0 transition-colors duration-300" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-center text-zinc-600">
              <div>
                <Folder size={40} className="mx-auto mb-2 text-zinc-700" />
                <p className="text-xs">Add screenshot to /public/projects/</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right — Info */}
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-violet-400 fill-violet-400" />
            <span className="text-violet-400 text-xs font-mono uppercase tracking-widest">
              Featured Project
            </span>
          </div>

          <h3 className="text-zinc-100 font-bold text-xl mb-3 group-hover:text-violet-300 transition-colors">
            {project.title}
          </h3>

          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>
        </div>

        {/* Action links */}
        <div className="flex items-center gap-4">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-violet-400 transition-colors text-sm font-medium">
              <FaGithub size={16} />
              Source Code
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-violet-400 transition-colors text-sm font-medium">
              <ExternalLink size={15} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Other Project Card (compact) ────────────────────────────────────────────
function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex flex-col justify-between p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
    >
      {/* Top row */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <Folder size={28} className="text-violet-500 group-hover:text-violet-400 transition-colors" />
          <div className="flex items-center gap-3">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-zinc-500 hover:text-zinc-200 transition-colors">
                <FaGithub size={17} />
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label="Live demo" className="text-zinc-500 hover:text-zinc-200 transition-colors">
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        <h3 className="text-zinc-100 font-semibold text-base mb-2 group-hover:text-violet-300 transition-colors">
          {project.title}
        </h3>

        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
          {project.description}
        </p>
      </div>

      {/* Tech tags at bottom */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-zinc-800/50">
        {project.technologies.map((tech) => (
          <TechBadge key={tech} name={tech} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filters = buildFilters();

  const featuredProjects = projects.filter((p) => p.featured);

  // Only "other" projects are filtered by category tab
  const otherProjects = projects.filter((p) => {
    if (p.featured) return false;
    if (activeFilter === "all") return true;
    return p.category === activeFilter;
  });

  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Projects"
          subtitle="Things I've built — from research tools to web applications."
        />

        {/* ── Featured Projects ── */}
        {featuredProjects.length > 0 && (
          <div className="mb-16 space-y-6">
            {featuredProjects.map((project, i) => (
              <FeaturedCard key={project.title} project={project} index={i} />
            ))}
          </div>
        )}

        {/* ── Other Projects heading + filter ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h3 className="text-zinc-300 font-semibold text-lg">Other Projects</h3>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 capitalize",
                  activeFilter === f
                    ? "bg-violet-600 text-white"
                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Project Cards Grid ── */}
        {/* AnimatePresence enables exit animations when cards are filtered out */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {otherProjects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {otherProjects.length === 0 && (
          <p className="text-center text-zinc-600 py-12 font-mono text-sm">
            No projects in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}