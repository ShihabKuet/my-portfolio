import type { ComponentType, SVGProps } from "react";

export type SkillIcon = ComponentType<{ size?: number; className?: string } & SVGProps<SVGSVGElement>>;

// These interfaces describe what your data looks like.
// Think of them as contracts: "a Project MUST have these fields."

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface Skill {
  name:     string;
  stars:    1 | 2 | 3 | 4 | 5;   // 1–5 star rating
  category: "frontend" | "backend" | "tools" | "languages" | "os";
  icon?:    SkillIcon;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string[];
  technologies: string[];
  link?: string;
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  result: string;
  description?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  live?: string;
  image?: string;
  featured: boolean;
  category: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface Publication {
  title: string;
  authors: string[];
  journal: string;
  year: string;
  doi?: string;
  link?: string;
  abstract?: string;
  tags: string[];
}

export interface Achievement {
  title: string;
  issuer: string;
  date: string;
  description: string;
  credentialUrl?: string;
  image?: string;
  category: "certification" | "award" | "competition";
  highlight: boolean;
}

export type { FunFact } from "./funFact";