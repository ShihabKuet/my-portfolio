"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { projects } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import TechBadge from "@/components/ui/TechBadge";
import { cn } from "@/lib/utils";
import { FaGithub } from "react-icons/fa";
import {
  ExternalLink,
  Folder,
  Star,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";

const buildFilters = () => {
  const categories = projects.map((p) => p.category);
  const unique = Array.from(new Set(categories));
  return ["all", ...unique];
};

// ─── Featured Project Card ────────────────────────────────────────────────────
function FeaturedCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
      className="group relative grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden
        bg-white dark:bg-zinc-900/60
        border border-sky-200/80 dark:border-zinc-800/60
        hover:border-violet-500/40 dark:hover:border-violet-500/30
        transition-colors duration-300"
      style={{
        boxShadow:
          "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Hover glow */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none z-10"
        style={{
          boxShadow:
            "inset 0 0 0 1.5px rgba(139,92,246,0.3), 0 8px 40px rgba(139,92,246,0.08)",
        }}
      />

      {/* ── Image pane ── */}
      <div className="relative overflow-hidden bg-sky-50 dark:bg-zinc-800/60">
        <div className="relative w-full" style={{ paddingBottom: "62%" }}>
          {project.image ? (
            <>
              <img
                src={`/projects/${project.image}`}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover object-top
                  transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* Dark scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent
                opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Folder size={40} className="text-zinc-600" />
            </div>
          )}

          {/* Index number — top-left */}
          <div className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em]
            text-white/60 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded select-none">
            {String(index + 1).padStart(2, "0")} / FEATURED
          </div>
        </div>
      </div>

      {/* ── Content pane ── */}
      <div className="flex flex-col justify-between p-6 gap-5">
        <div>
          {/* Label row */}
          <div className="flex items-center gap-2 mb-4">
            <Star
              size={12}
              className="text-violet-400 fill-violet-400 shrink-0"
            />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-violet-400">
              Featured Project
            </span>
            <span className="ml-auto font-mono text-[10px] text-zinc-400 dark:text-zinc-600 capitalize">
              {project.category}
            </span>
          </div>

          <h3 className="text-sky-950 dark:text-zinc-100 font-bold text-xl leading-snug mb-3
            group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-200">
            {"slug" in project && project.slug ? (
              <Link href={`/projects/${project.slug}`} className="hover:underline underline-offset-4 decoration-violet-400/40">
                {project.title}
              </Link>
            ) : project.title}
          </h3>

          <p className="text-sky-700 dark:text-zinc-400 text-sm leading-relaxed">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.technologies.map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-sky-100 dark:bg-zinc-800 mb-4" />

          {/* Action row */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Case study CTA — only when slug exists */}
            {"slug" in project && project.slug ? (
              <Link
                href={`/projects/${project.slug}`}
                className="group/cta inline-flex items-center gap-1.5
                  text-xs font-mono font-semibold
                  text-white bg-violet-600 hover:bg-violet-500
                  px-3.5 py-1.5 rounded-lg
                  transition-colors duration-200
                  shadow-sm shadow-violet-500/20"
              >
                <BookOpen size={12} />
                Case Study
                <ArrowRight
                  size={10}
                  className="translate-x-0 group-hover/cta:translate-x-0.5 transition-transform duration-200"
                />
              </Link>
            ) : null}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono
                  text-sky-700 dark:text-zinc-400
                  hover:text-violet-500 dark:hover:text-violet-400
                  transition-colors duration-200"
              >
                <FaGithub size={14} />
                Source
              </a>
            )}

            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold
                  text-emerald-600 dark:text-emerald-400
                  border border-emerald-500/40 hover:border-emerald-400
                  bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20
                  px-3.5 py-1.5 rounded-lg transition-all duration-200"
              >
                <ExternalLink size={12} />
                Live Action
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Compact Project Card ─────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const hasSlug = "slug" in project && Boolean(project.slug);
  const slug = hasSlug ? (project as typeof project & { slug: string }).slug : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.28, delay: index * 0.05, ease: "easeOut" }}
      className="group relative flex flex-col justify-between p-5 rounded-xl
        bg-white dark:bg-zinc-900/50
        border border-sky-200/80 dark:border-zinc-800/50
        hover:border-violet-500/30
        transition-colors duration-300"
      style={{
        boxShadow: "0 1px 10px rgba(0,0,0,0.04)",
      }}
    >
      {/* Hover glow ring */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(139,92,246,0.25), 0 4px 20px rgba(139,92,246,0.07)",
        }}
      />

      <div>
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <Folder
            size={26}
            className="text-violet-400 dark:text-violet-500 group-hover:text-violet-400 transition-colors shrink-0"
          />
          <div className="flex items-center gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-sky-400 dark:text-zinc-500 hover:text-violet-400 transition-colors"
              >
                <FaGithub size={15} />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
                className="text-sky-400 dark:text-zinc-500 hover:text-violet-400 transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        <h3 className="text-sky-950 dark:text-zinc-100 font-semibold text-sm leading-snug mb-2
          group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-200">
          {slug ? (
            <Link href={`/projects/${slug}`} className="hover:underline underline-offset-4 decoration-violet-400/40">
              {project.title}
            </Link>
          ) : project.title}
        </h3>

        <p className="text-sky-700 dark:text-zinc-400 text-xs leading-relaxed line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Bottom */}
      <div className="mt-4 pt-4 border-t border-sky-100 dark:border-zinc-800/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {project.technologies.slice(0, 3).map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[10px] font-mono text-zinc-400 self-center">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* Bottom-right actions */}
          <div className="shrink-0 flex items-center gap-3">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold
                  text-emerald-600 dark:text-emerald-400
                  border border-emerald-500/40 hover:border-emerald-400
                  bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500/20
                  px-2 py-0.5 rounded-md transition-all duration-200 whitespace-nowrap"
              >
                <ExternalLink size={9} />
                Live Action
              </a>
            )}
            {slug ? (
              <Link
                href={`/projects/${slug}`}
                className="group/link inline-flex items-center gap-1
                  text-[10px] font-mono text-violet-400 hover:text-violet-300
                  transition-colors duration-200 whitespace-nowrap"
              >
                Details
                <ArrowRight
                  size={9}
                  className="translate-x-0 group-hover/link:translate-x-0.5 transition-transform duration-200"
                />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section footer CTA ───────────────────────────────────────────────────────
function ExploreAllCTA({ count }: { count: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6
        px-6 py-5 rounded-2xl
        bg-gradient-to-r from-violet-50 to-sky-50
        dark:from-violet-950/20 dark:to-zinc-900/60
        border border-violet-200/60 dark:border-violet-800/30"
    >
      {/* Left text */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Decorative terminal prompt */}
        <div className="shrink-0 flex items-center gap-1.5 font-mono text-xs
          text-violet-400 select-none">
          <span className="text-zinc-400 dark:text-zinc-600">~/</span>
          <span>projects</span>
          <span className="inline-block w-1.5 h-3.5 bg-violet-400 opacity-80 animate-pulse rounded-sm ml-0.5" />
        </div>
        <div className="h-8 w-px bg-violet-200 dark:bg-violet-800/40 shrink-0" />
        <p className="text-sm text-sky-800 dark:text-zinc-300 leading-snug">
          Every project has a full case study —&nbsp;
          <span className="font-semibold text-sky-950 dark:text-zinc-100">
            architecture, challenges, and decisions documented.
          </span>
        </p>
      </div>

      {/* CTA button */}
      <Link
        href="/projects"
        className="group/explore shrink-0 inline-flex items-center gap-2
          px-5 py-2.5 rounded-xl
          bg-violet-600 hover:bg-violet-500
          text-white text-sm font-mono font-semibold
          transition-colors duration-200
          shadow-sm shadow-violet-500/25
          whitespace-nowrap"
      >
        Explore all {count} projects
        <ArrowUpRight
          size={14}
          className="transition-transform duration-200 group-hover/explore:translate-x-0.5 group-hover/explore:-translate-y-0.5"
        />
      </Link>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filters = buildFilters();

  const featuredProjects = projects.filter((p) => p.featured);
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
          <div className="mb-16 space-y-5">
            {featuredProjects.map((project, i) => (
              <FeaturedCard key={project.title} project={project} index={i} />
            ))}
          </div>
        )}

        {/* ── Other Projects header + filters ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600">
              Other Projects
            </span>
            <div className="h-px w-12 bg-gradient-to-r from-zinc-300 dark:from-zinc-700 to-transparent" />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 capitalize",
                  activeFilter === f
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
                    : "bg-sky-100 dark:bg-zinc-800/60 text-sky-700 dark:text-zinc-400 border border-sky-200 dark:border-zinc-700/50 hover:border-violet-500/40 hover:text-violet-500 dark:hover:text-violet-400"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Cards grid ── */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {otherProjects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {otherProjects.length === 0 && (
          <p className="text-center text-sky-400 dark:text-zinc-600 py-12 font-mono text-sm">
            No projects in this category yet.
          </p>
        )}

        {/* ── Explore all CTA ── */}
        <ExploreAllCTA count={projects.length} />
      </div>
    </section>
  );
}