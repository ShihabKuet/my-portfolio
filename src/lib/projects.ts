import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { slugifyHeading } from "./utils";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

export type ProjectStatus = "completed" | "in-progress" | "archived";

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  status: ProjectStatus;
  tags: string[];
  technologies: string[];
  github?: string;
  live?: string;
  coverImage?: string;   // thumbnail on listing page
  featureImage?: string; // hero image/gif on detail page
  demoVideo?: string;    // YouTube embed or local video
  category: string;
  featured: boolean;
  readTime: string;
}

export interface ProjectPost extends ProjectMeta {
  content: string;
}

export interface TOCEntry {
  id: string;
  text: string;
  level: number; // 2 = h2, 3 = h3
}

export function extractTOC(content: string): TOCEntry[] {
  const regex = /^(#{2,3})\s+(.+)$/gm;
  const entries: TOCEntry[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const raw   = match[2].trim();
    // Strip inline code and bold for display text
    const text  = raw
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*?([^*]+)\*\*?/g, "$1");
    entries.push({ id: slugifyHeading(raw), text, level });
  }

  return entries;
}

function parseProject(slug: string, fileContent: string): ProjectMeta {
  const { data, content } = matter(fileContent);
  return {
    slug,
    title:        data.title,
    description:  data.description,
    date:         data.date,
    status:       (data.status ?? "completed") as ProjectStatus,
    tags:         data.tags         ?? [],
    technologies: data.technologies ?? [],
    github:       data.github       ?? undefined,
    live:         data.live         ?? undefined,
    coverImage:   data.coverImage   ?? undefined,
    featureImage: data.featureImage ?? undefined,
    demoVideo:    data.demoVideo    ?? undefined,
    category:     data.category     ?? "other",
    featured:     data.featured     ?? false,
    readTime:     readingTime(content).text,
  };
}

export function getAllProjects(): ProjectMeta[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  return fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((dir) => {
      const slug = dir.name;
      const fp   = path.join(PROJECTS_DIR, slug, "index.mdx");
      if (!fs.existsSync(fp)) return null;
      return parseProject(slug, fs.readFileSync(fp, "utf-8"));
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Featured first, then newest first
      if (a!.featured && !b!.featured) return -1;
      if (!a!.featured && b!.featured) return 1;
      return new Date(b!.date).getTime() - new Date(a!.date).getTime();
    }) as ProjectMeta[];
}

export function getProjectBySlug(slug: string): ProjectPost | null {
  try {
    const fp            = path.join(PROJECTS_DIR, slug, "index.mdx");
    const fileContent   = fs.readFileSync(fp, "utf-8");
    const { content }   = matter(fileContent);
    const meta          = parseProject(slug, fileContent);
    return { ...meta, content };
  } catch {
    return null;
  }
}