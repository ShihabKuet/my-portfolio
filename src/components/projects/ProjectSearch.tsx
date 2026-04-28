"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import type { ProjectMeta } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

interface Props {
  projects: ProjectMeta[];
  allCategories: string[];
}

export default function ProjectSearch({ projects, allCategories }: Props) {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return projects.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [projects, query, category]);

  const featured = filtered.filter((p) => p.featured);
  const rest      = filtered.filter((p) => !p.featured);
  const hasFilter = query || category;

  return (
    <div>
      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, tech, or keyword…"
          className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm font-mono
            bg-zinc-50 dark:bg-zinc-900
            border border-zinc-200/80 dark:border-zinc-800
            text-sky-950 dark:text-zinc-200
            placeholder:text-zinc-400
            focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50
            transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategory(null)}
          className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
            !category
              ? "bg-violet-500 text-white shadow-sm shadow-violet-500/30"
              : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-violet-500/40"
          }`}
        >
          All
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === category ? null : cat)}
            className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
              category === cat
                ? "bg-violet-500 text-white shadow-sm shadow-violet-500/30"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-violet-500/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter status */}
      {hasFilter && (
        <div className="flex items-center gap-3 mb-6 font-mono text-xs">
          <span className="text-zinc-500">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => { setQuery(""); setCategory(null); }}
            className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors"
          >
            <X size={10} /> clear
          </button>
        </div>
      )}

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-24 font-mono">
          <p className="text-4xl mb-3 select-none">∅</p>
          <p className="text-sm text-zinc-500">No projects match your filter.</p>
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-violet-400">
              ✦ Featured
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/40 to-transparent" />
          </div>
          <div className="flex flex-col gap-5">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} featured />
            ))}
          </div>
        </section>
      )}

      {/* Other */}
      {rest.length > 0 && (
        <section>
          {featured.length > 0 && (
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-zinc-500">
                Other Projects
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-zinc-600/30 to-transparent" />
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            {rest.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}