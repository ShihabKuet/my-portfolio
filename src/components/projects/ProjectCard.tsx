import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { ProjectMeta, ProjectStatus } from "@/lib/projects";

const STATUS_MAP: Record<
  ProjectStatus,
  { label: string; cls: string; dot: string }
> = {
  completed:    { label: "Completed",   cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  "in-progress":{ label: "In Progress", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",       dot: "bg-amber-400 animate-pulse" },
  archived:     { label: "Archived",    cls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",           dot: "bg-zinc-400" },
};

const CATEGORY_COLORS: Record<string, string> = {
  fullstack:          "text-violet-400",
  backend:            "text-sky-400",
  frontend:           "text-pink-400",
  embedded:           "text-orange-400",
  tools:              "text-teal-400",
  thesis:             "text-indigo-400",
  "computer-graphics":"text-rose-400",
  other:              "text-zinc-400",
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.completed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function TechChips({ techs, max }: { techs: string[]; max: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {techs.slice(0, max).map((t) => (
        <span key={t} className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50">
          {t}
        </span>
      ))}
      {techs.length > max && (
        <span className="px-2 py-0.5 text-[10px] font-mono text-zinc-400">
          +{techs.length - max}
        </span>
      )}
    </div>
  );
}

interface Props {
  project: ProjectMeta;
  featured?: boolean;
}

export default function ProjectCard({ project, featured = false }: Props) {
  const catColor = CATEGORY_COLORS[project.category] ?? "text-zinc-400";
  const href     = `/projects/${project.slug}`;

  /* ── FEATURED card (image + content, side-by-side on md+) ── */
  if (featured) {
    return (
      <article
        className="group relative rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
      >
        {/* Violet glow on hover */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "0 0 0 1.5px rgba(139,92,246,0.45), 0 8px 40px rgba(139,92,246,0.1)" }}
        />

        <div className="grid md:grid-cols-2">
          {/* Image pane */}
          <div className="relative aspect-video md:aspect-auto md:min-h-[260px] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-6xl font-black text-zinc-200 dark:text-zinc-700 select-none">
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
            {/* Category pill */}
            <div className="absolute top-3 left-3">
              <span className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded bg-black/50 backdrop-blur-sm ${catColor}`}>
                {project.category}
              </span>
            </div>
          </div>

          {/* Content pane */}
          <div className="p-6 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <StatusBadge status={project.status} />
                <span className="px-2 py-0.5 rounded border border-violet-500/30 bg-violet-500/10 text-violet-400 text-[10px] font-mono">
                  ✦ Featured
                </span>
              </div>

              <h3 className="text-lg font-bold text-sky-950 dark:text-zinc-100 leading-snug mb-2 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                {project.title}
              </h3>

              <p className="text-sm text-sky-700 dark:text-zinc-400 leading-relaxed line-clamp-3">
                {project.description}
              </p>
            </div>

            <div className="space-y-4">
              <TechChips techs={project.technologies} max={5} />

              <div className="flex items-center gap-4">
                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-violet-500 hover:text-violet-400 transition-colors group/cta"
                >
                  Case Study
                  <ArrowRight size={12} className="group-hover/cta:translate-x-0.5 transition-transform" />
                </Link>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                    <FaGithub size={14} />
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* ── COMPACT card ── */
  return (
    <article
      className="group relative rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-5 transition-all duration-300 hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 10px rgba(0,0,0,0.04)" }}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: "0 0 0 1.5px rgba(139,92,246,0.35), 0 4px 20px rgba(139,92,246,0.08)" }}
      />

      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-mono text-[10px] tracking-widest uppercase ${catColor}`}>
            {project.category}
          </span>
          <StatusBadge status={project.status} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-violet-400 transition-colors">
              <FaGithub size={13} />
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-violet-400 transition-colors">
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      <h3 className="text-sm font-bold text-sky-950 dark:text-zinc-100 leading-snug mb-1.5 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
        {project.title}
      </h3>

      <p className="text-xs text-sky-700 dark:text-zinc-500 leading-relaxed mb-3 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center justify-between gap-2">
        <TechChips techs={project.technologies} max={3} />
        <Link
          href={href}
          className="shrink-0 inline-flex items-center gap-1 text-[10px] font-mono text-violet-400 hover:text-violet-300 transition-colors"
        >
          Details <ArrowRight size={10} />
        </Link>
      </div>
    </article>
  );
}