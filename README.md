<div align="center">

# www.shanjid.bd

**A dark-first, interaction-rich developer portfolio — built to feel alive.**

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat-square&logo=framer)](https://www.framer.com/motion)
[![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

[**→ Live Site**](https://www.shanjid.bd) · [**→ Blog**](https://www.shanjid.bd/blog) · [**→ Projects**](https://www.shanjid.bd/projects) · [**→ Resume**](https://www.shanjid.bd/CV_SHANJID.pdf)

</div>

---

## Overview

Personal developer portfolio and technical blog for MD. Shanjid Arefin — Software R&D Engineer, Dhaka, Bangladesh. Built with Next.js 16 App Router and React 19, it prioritises smooth micro-interactions, a strict dark/light design system, and an MDX content pipeline that treats code examples as first-class content with fully interactive embedded components.

---

## Architecture

### Rendering model

The project uses Next.js 16 App Router with React Server Components as the default. Pages are statically generated at build time; client interactivity is isolated to leaf components marked `"use client"`.

```
Request
  └── Server Component (page.tsx)        — reads filesystem, builds props
        ├── Static HTML shell            — zero JS, instant paint
        └── Client Component islands     — hydrated independently
              ├── BlogSearch             — live search + tag filter
              ├── TableOfContents        — scroll-tracked active section
              ├── TableOfContentsMobile  — floating capsule + bottom sheet
              ├── FloatingTerminal       — draggable, resizable overlay
              └── ThemeToggle            — dark/light switch
```

### Content pipeline

MDX files are read from disk at build time (no database). Content is never imported directly — per-slug component registries inject interactive React components into posts at render time, enabling fully isolated demo islands inside articles.

```
src/content/[type]/[slug]/
  ├── index.mdx          — frontmatter + markdown body
  └── ComponentName.tsx  — optional co-located interactive component
```

The registry pattern is required by `next-mdx-remote/rsc`, which does not support dynamic `import()` inside MDX:

```ts
// src/lib/blog-components.ts
import { MyDemo } from "@/content/blog/my-post/MyDemo";

const registry: Record<string, Record<string, ComponentType>> = {
  "my-post": { MyDemo },
};
```

### Table of Contents

Headings are extracted from raw MDX at build time with `extractTOC()` (regex over `##`/`###`). IDs are injected via two mechanisms:

- **Projects** — custom `projectHeadingComponents` passed as MDX components inject `id` from `slugifyHeading()`
- **Blog** — `rehype-slug` plugin runs on the rendered HTML and produces matching IDs

A scroll listener (passive, `OFFSET = 140px`) tracks the active heading client-side and drives the active state in both the desktop sidebar and the mobile bottom sheet.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, RSC, SSG) | 16.2.1 |
| Language | TypeScript | ^5 |
| UI library | React | 19.2.4 |
| Styling | Tailwind CSS v4 + PostCSS | ^4 |
| Typography | @tailwindcss/typography (prose) | ^0.5 |
| Animations | Framer Motion | ^12 |
| Icons | Lucide React · React Icons | latest |
| MDX runtime | next-mdx-remote/rsc | ^6 |
| Markdown plugins | remark-gfm · rehype-slug · rehype-highlight | latest |
| Forms | React Hook Form + Zod | ^7 / ^4 |
| Email | Resend | ^6 |
| Theming | next-themes | ^0.4 |
| Utilities | clsx · tailwind-merge · reading-time | latest |
| Deployment | Vercel | — |

---

## Features

### Home page (`/`)

| Section | Highlights |
|---|---|
| **Hero** | Character-scramble name decode on load · alternating slide-in sub-headlines · word-by-word blur-reveal bio · social icon links · resume download button |
| **About** | Animated quote box · glitch-effect profile photo · stat counters |
| **Skills** | Hexagonal badge grid with 3D glossy star ratings |
| **Tech Expertise** | Category-filtered animated SVG icon grid |
| **Experience** | Network-topology timeline with achievements and metrics |
| **Education** | Endian-style animated timeline |
| **Projects** | Featured project cards with live demo links and tech tags |
| **Publications** | Academic paper cards with show/hide abstract toggle |
| **Achievements** | Certifications and award cards |
| **Coding Stats** | Live LeetCode API data with animated count-up |
| **Blog preview** | Latest post teasers linking to `/blog` |
| **Contact** | Animated SMTP data-packet postbox scene + form wired to Resend |

**Global UI**
- Floating interactive terminal (draggable, maximize/minimize) with a full command set (`neofetch`, `help`, `history`, `open`, etc.)
- Scroll progress bar
- Back-to-top button
- Active section highlight in navbar
- Dark / light mode toggle (zinc-950 dark · sky-50 light)

### Blog (`/blog`)

- Book-style card listing — coloured spines, cover image with gradient mask, excerpt slide-up on hover / touch
- Live search + tag filter — `⌘K` activated, `AnimatePresence` card transitions
- Shell-prompt breadcrumb nav with violet glow on hover
- Per-post interactive React components co-located with the MDX file
- **Desktop Table of Contents** — sticky sidebar with scroll-tracked active section (lg+)
- **Mobile Table of Contents** — fixed floating capsule at the bottom showing the active heading; tapping opens a slide-up bottom sheet with the full list
- Random fun-fact banner on the listing page
- Syntax-highlighted code blocks (highlight.js), GFM tables, responsive prose

### Projects (`/projects`)

- Project listing with search, category filter, and featured highlight
- Full MDX case-study pages (`/projects/[slug]`)
  - Hero image, status badge, tag chips, tech stack pills, GitHub / Live / Marketplace CTAs
  - **Desktop Table of Contents** — sticky sidebar with scroll-tracked active section (lg+)
  - **Mobile Table of Contents** — floating capsule + bottom sheet (same component as blog)
  - Rich MDX body with syntax highlighting and co-located custom components

### OSI / TCP-IP page (`/osi`)

- Scroll-driven encapsulation animation illustrating each layer of the network stack

### Custom 404

- Segfault animation with a mock kernel panic message and recovery terminal prompt

### SEO & meta

- `sitemap.ts` and `robots.ts` generated by Next.js
- Per-page `<Metadata>` with canonical URLs and OG tags
- Google Search Console and Bing webmaster verification

---

## Project Structure

```
portfolio/
├── public/                          # Static assets (resume, OG images, icons)
│
└── src/
    ├── app/                         # Next.js App Router
    │   ├── layout.tsx               # Root layout — font setup, ThemeProvider
    │   ├── page.tsx                 # Home page (server component)
    │   ├── not-found.tsx            # Custom 404 — segfault animation
    │   ├── globals.css              # Tailwind v4 @theme tokens, base styles
    │   ├── robots.ts                # Auto-generated robots.txt
    │   ├── sitemap.ts               # Auto-generated sitemap.xml
    │   │
    │   ├── api/
    │   │   ├── contact/route.ts     # POST — Resend email API
    │   │   └── leetcode/route.ts    # GET — LeetCode stats proxy
    │   │
    │   ├── blog/
    │   │   ├── page.tsx             # Blog listing (server) + BlogSearch (client)
    │   │   └── [slug]/page.tsx      # MDX post renderer with TOC
    │   │
    │   ├── projects/
    │   │   ├── page.tsx             # Project listing (server) + ProjectSearch (client)
    │   │   └── [slug]/page.tsx      # MDX case-study renderer with TOC
    │   │
    │   └── osi/page.tsx             # OSI/TCP-IP interactive page
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx           # Icon nav, tooltip labels, active section highlight
    │   │   └── Footer.tsx
    │   │
    │   ├── sections/                # One component per home-page section
    │   │   ├── Hero.tsx
    │   │   ├── About.tsx
    │   │   ├── Skills.tsx
    │   │   ├── TechExpertise.tsx
    │   │   ├── Experience.tsx
    │   │   ├── Education.tsx
    │   │   ├── Projects.tsx
    │   │   ├── Publications.tsx
    │   │   ├── Achievements.tsx
    │   │   ├── CodingStats.tsx
    │   │   ├── Blog.tsx
    │   │   └── Contact.tsx
    │   │
    │   ├── blog/
    │   │   ├── MDXContent.tsx       # MDX renderer (rehype-slug, rehype-highlight)
    │   │   ├── BlogCard.tsx         # Book-style card, touch-aware hover
    │   │   ├── BlogSearch.tsx       # Search + tag filter, Framer Motion transitions
    │   │   ├── FunFactBanner.tsx    # Random fun-fact display
    │   │   └── FunFactController.tsx
    │   │
    │   ├── projects/
    │   │   ├── ProjectCard.tsx
    │   │   ├── ProjectSearch.tsx
    │   │   ├── ProjectMDXComponents.tsx  # Heading components that inject id attrs
    │   │   ├── TableOfContents.tsx       # Desktop sticky sidebar TOC
    │   │   └── TableOfContentsMobile.tsx # Mobile floating capsule + bottom sheet TOC
    │   │
    │   ├── ui/
    │   │   ├── FloatingTerminal.tsx # Draggable terminal overlay
    │   │   ├── ScrollProgress.tsx
    │   │   ├── BackToTop.tsx
    │   │   ├── SectionHeading.tsx
    │   │   ├── TechBadge.tsx
    │   │   └── ThemeToggle.tsx
    │   │
    │   ├── icons/                   # Custom animated SVG icon components
    │   │   └── *.tsx
    │   │
    │   └── providers/
    │       └── ThemeProvider.tsx    # next-themes wrapper
    │
    ├── content/
    │   ├── blog/
    │   │   └── [slug]/
    │   │       ├── index.mdx        # Frontmatter + markdown body
    │   │       └── *.tsx            # Co-located interactive components (optional)
    │   │
    │   └── projects/
    │       └── [slug]/
    │           ├── index.mdx        # Frontmatter + markdown body
    │           └── components.tsx   # Co-located custom components (optional)
    │
    ├── data/
    │   ├── index.ts                 # personalInfo, navItems, social links
    │   └── funFacts.ts
    │
    ├── lib/
    │   ├── mdx.ts                   # getAllPosts, getPostBySlug, formatDate
    │   ├── projects.ts              # getAllProjects, getProjectBySlug, extractTOC, TOCEntry
    │   ├── blog-components.ts       # Per-slug component registry for blog
    │   ├── project-components.ts    # Per-slug component registry for projects
    │   ├── useCountUp.ts            # Animated counter hook
    │   └── utils.ts                 # cn(), slugifyHeading()
    │
    └── types/
        ├── index.ts                 # Shared interfaces (Project, Post, etc.)
        └── funFact.ts
```

---

## Content System

### Adding a blog post

1. Create `src/content/blog/my-post/index.mdx` with frontmatter:

```yaml
---
title: "Post Title"
excerpt: "One-line description shown on the listing card."
date: "2026-06-18"
tags: ["tag-one", "tag-two"]
coverImage: "/blog/my-post/cover.jpg"   # optional
---
```

2. Write the body in Markdown/MDX. Headings `##` and `###` are automatically linked and picked up by the Table of Contents.

3. To embed an interactive component, co-locate it:

```tsx
// src/content/blog/my-post/MyDemo.tsx
export function MyDemo() { ... }
```

Then register it:

```ts
// src/lib/blog-components.ts
import { MyDemo } from "@/content/blog/my-post/MyDemo";

const registry = {
  "my-post": { MyDemo },
};
```

Use it in the MDX file with `<MyDemo />`.

### Adding a project case study

1. Create `src/content/projects/my-project/index.mdx`:

```yaml
---
title: "Project Name"
description: "Short description."
date: "2026-06-18"
status: "completed"          # completed | in-progress | archived
tags: ["Next.js", "TypeScript"]
technologies: ["Next.js", "TypeScript", "Tailwind CSS"]
github: "https://github.com/..."
live: "https://..."
coverImage: "/projects/my-project/cover.jpg"
featureImage: "/projects/my-project/hero.gif"
category: "web"
featured: true
---
```

2. Write the case study in the MDX body. `##` and `###` headings appear in the Table of Contents automatically.

---

## Getting Started

```bash
# Clone
git clone https://github.com/ShihabKuet/my-portfolio.git
cd portfolio

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `.env.local` for the contact form and any private keys:

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### Resume

Place the PDF at `public/CV_SHANJID.pdf`. The hero section links to it with a `download` attribute.

### Syntax highlighting theme

The `rehype-highlight` plugin uses the theme imported in `src/app/globals.css`:

```css
@import 'highlight.js/styles/github-dark.css';
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Production build (runs `next build`) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment

Deployed on Vercel with zero configuration. Every push to `main` triggers a new production deployment.

```bash
# Verify the build locally before pushing
npm run build
```

Set `RESEND_API_KEY` in the Vercel project's environment variables for the contact form to work in production.

---

## License & Usage

The source code is open source under the [MIT License](./LICENSE) — use it as a reference or starting point for your own portfolio.

**Please do not copy the content directly.** The bio, project write-ups, blog posts, and case studies are original personal work. Use the structure, not the words.

---

<div align="center">
  <sub>Built by <a href="https://www.shanjid.bd">MD. Shanjid Arefin</a> · Software Engineer · Dhaka, Bangladesh</sub>
</div>
