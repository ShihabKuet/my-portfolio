import Link from "next/link";
import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import ProjectSearch from "@/components/projects/ProjectSearch";

export const metadata: Metadata = {
  title: "Projects | MD SHANJID AREFIN",
  description:
    "Case studies on software projects — from embedded VxWorks systems to full-stack web applications.",
  alternates: { canonical: "https://shanjid.bd/projects" },
};

export default function ProjectsPage() {
  const projects      = getAllProjects();
  const allCategories = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Breadcrumb nav ── */}
        <div className="inline-flex mb-10 group/nav">
          <span
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs
              bg-zinc-50 dark:bg-zinc-900
              transition-all duration-300 ease-out
              group-hover/nav:-translate-y-0.5
              group-hover/nav:bg-white dark:group-hover/nav:bg-zinc-900/80"
            style={{ boxShadow: "0 0 0 1px rgba(139,92,246,0.18), 0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: "0 0 0 1.5px rgba(139,92,246,0.55), 0 4px 20px rgba(139,92,246,0.13)" }}
            />
            <span className="text-violet-400 dark:text-violet-500 select-none">❯</span>
            <span className="flex items-center gap-1">
              <span className="text-zinc-400 dark:text-zinc-600 select-none">~/</span>
              <Link
                href="/"
                className="text-sky-600 dark:text-sky-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-200"
              >
                portfolio
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">/</span>
              <span className="text-zinc-500 dark:text-zinc-400">projects</span>
            </span>
            <span className="text-violet-400 opacity-0 translate-x-1 group-hover/nav:opacity-60 group-hover/nav:translate-x-0 transition-all duration-300 select-none">
              ↵
            </span>
          </span>
        </div>

        {/* ── Header ── */}
        <div className="mb-16 relative">
          {/* Ghost background text */}
          <div
            aria-hidden
            className="absolute -top-6 -left-4 select-none pointer-events-none leading-none tracking-[-0.06em] font-black z-0"
            style={{
              fontSize: "clamp(80px, 18vw, 148px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(139,92,246,0.12)",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            WORK
          </div>

          <div className="relative z-10 pt-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-violet-400">
                ✦ PROJECTS
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
                {projects.length} project{projects.length !== 1 ? "s" : ""}
              </span>
            </div>

            <h1 className="mb-4 leading-[1.1]">
              <span
                className="block text-sky-950 dark:text-zinc-100 font-light tracking-[-0.02em]"
                style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
              >
                Things I&apos;ve built &amp;
              </span>
              <span
                className="block text-violet-500 dark:text-violet-400 font-extrabold tracking-[-0.04em]"
                style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
              >
                shipped to production.
              </span>
            </h1>

            <div className="flex items-start gap-4 mt-5">
              <div className="shrink-0 mt-1 w-[3px] h-9 rounded-sm bg-gradient-to-b from-violet-700 to-transparent" />
              <p className="text-sky-700 dark:text-zinc-400 text-sm leading-relaxed max-w-md">
                From embedded network stacks on VxWorks to full-stack web apps — each entry
                is a full case study covering design decisions, challenges, and architecture.
              </p>
            </div>
          </div>
        </div>

        {/* ── Listing ── */}
        <ProjectSearch projects={projects} allCategories={allCategories} />
      </div>
    </main>
  );
}