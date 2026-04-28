import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { FaGithub } from "react-icons/fa";
import { ExternalLink, Calendar, Clock, Tag, ArrowLeft } from "lucide-react";

import { getProjectBySlug, getAllProjects, extractTOC } from "@/lib/projects";
import { getComponentsForProjectSlug } from "@/lib/project-components";
import { projectHeadingComponents } from "@/components/projects/ProjectMDXComponents";
import MDXContent from "@/components/blog/MDXContent";
import TableOfContents from "@/components/projects/TableOfContents";
import type { ProjectStatus } from "@/lib/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

const STATUS_MAP: Record<ProjectStatus, { label: string; cls: string; dot: string }> = {
  completed:    { label: "Completed",   cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  "in-progress":{ label: "In Progress", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",       dot: "bg-amber-400 animate-pulse" },
  archived:     { label: "Archived",    cls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",           dot: "bg-zinc-400" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project  = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title:       `${project.title} | Projects`,
    description: project.description,
  };
}

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug }   = await params;
  const project    = getProjectBySlug(slug);
  if (!project) notFound();

  const toc              = extractTOC(project.content);
  const slugComponents   = await getComponentsForProjectSlug(slug);
  const components       = { ...projectHeadingComponents, ...slugComponents };
  const status           = STATUS_MAP[project.status] ?? STATUS_MAP.completed;
  const heroImage        = project.featureImage ?? project.coverImage;

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">

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
              <Link href="/" className="text-sky-600 dark:text-sky-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-200">
                portfolio
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">/</span>
              <Link href="/projects" className="text-sky-600 dark:text-sky-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-200">
                projects
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">/</span>
              <span className="text-zinc-500 dark:text-zinc-400 max-w-[180px] sm:max-w-[300px] truncate">
                {slug}
              </span>
            </span>
            <span className="text-violet-400 opacity-0 translate-x-1 group-hover/nav:opacity-60 group-hover/nav:translate-x-0 transition-all duration-300 select-none">
              ↵
            </span>
          </span>
        </div>

        {/* ── Hero header ── */}
        <header className="mb-12">
          {/* Feature image */}
          {heroImage && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60">
              <Image
                src={heroImage}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          )}

          {/* Status + tags */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono ${status.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            {project.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 text-xs font-mono border border-violet-500/20">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-sky-950 dark:text-zinc-100 leading-tight mb-4">
            {project.title}
          </h1>

          <p className="text-sky-700 dark:text-zinc-400 text-lg leading-relaxed mb-6 max-w-3xl">
            {project.description}
          </p>

          {/* Meta row */}
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-3 pb-6
              border-b border-zinc-200 dark:border-zinc-800"
          >
            <span className="flex items-center gap-1.5 font-mono text-sm text-sky-500 dark:text-zinc-500">
              <Calendar size={13} />
              {new Date(project.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-sm text-sky-500 dark:text-zinc-500">
              <Clock size={13} />
              {project.readTime}
            </span>

            {/* CTA buttons */}
            <div className="flex items-center gap-3 ml-auto">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm font-mono text-sky-950 dark:text-zinc-200 hover:border-violet-500/50 hover:text-violet-400 transition-all"
                >
                  <FaGithub size={14} />
                  GitHub
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-violet-500 text-white text-sm font-mono hover:bg-violet-400 transition-colors shadow-sm shadow-violet-500/30"
                >
                  <ExternalLink size={14} />
                  Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mt-5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* ── Content + TOC layout ── */}
        <div className="flex gap-14 items-start">
          {/* Main MDX content */}
          <article className="flex-1 min-w-0">
            <MDXContent source={project.content} components={components} />
          </article>

          {/* Sticky TOC — visible on lg+ */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-52 shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <TableOfContents entries={toc} />
            </aside>
          )}
        </div>

        {/* ── Footer nav ── */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-mono text-sky-700 dark:text-zinc-400 hover:text-violet-400 transition-colors"
          >
            <ArrowLeft size={14} />
            All Projects
          </Link>

          <div className="flex items-center gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-violet-400 transition-colors"
              >
                <FaGithub size={14} /> Source Code
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-violet-400 transition-colors"
              >
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}