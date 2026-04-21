<div align="center">

# ✦ shanjidarefin.vercel.app

**A dark-first, interaction-rich developer portfolio — built to feel alive.**

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat-square&logo=framer)](https://www.framer.com/motion)
[![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

[**→ Live Site**](https://shanjidarefin.vercel.app) · [**→ Blog**](https://shanjidarefin.vercel.app/blog) · [**→ Resume**](https://shanjidarefin.vercel.app/resume.pdf)

</div>

---

## Overview

This is the source code for my personal developer portfolio and technical blog. It's built with a focus on smooth micro-interactions, a consistent dark/light design system, and an MDX-powered blog that treats code examples as first-class content — with fully interactive embedded components.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React · React Icons |
| Blog | MDX via `next-mdx-remote/rsc` |
| Syntax Highlighting | `rehype-highlight` + highlight.js |
| Deployment | Vercel |

---

## Features

### Portfolio
- **Hero section** — character-scramble name decode, alternating slide-in headline, word-by-word blur reveal on bio
- **Skills section** — hexagonal badges with 3D glossy star ratings
- **Projects section** — clickable demo-link cards with live tech tags
- **Contact section** — animated SMTP data packet card with postbox SVG scene

### Blog (`/blog`)
- MDX articles with embedded interactive React components — demos live inside the post
- **Book-style card listing** — colored spines, cover image background with gradient mask, excerpt slide-up on hover/touch
- **Live search + tag filters** — `⌘K` activated, Framer Motion `AnimatePresence` card transitions
- **Terminal breadcrumb nav** — `❯ ~/portfolio/blog/post-slug` with violet glow on hover
- Syntax-highlighted code blocks, GFM tables, responsive prose

### Design System
- Dark/light mode throughout — no hardcoded color values, all via Tailwind semantic classes
- Consistent violet accent language across all interactive states
- Mobile touch parity — every hover effect has a `onTouchStart`/`onTouchEnd` equivalent

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                   # Portfolio home (server component)
│   └── blog/
│       ├── page.tsx               # Blog listing (server) + BlogSearch (client)
│       └── [slug]/
│           └── page.tsx           # MDX post renderer
│
├── components/
│   ├── layout/                    # Navbar, Footer
│   ├── sections/                  # Hero, Skills, Projects, Contact…
│   │   └── Hero/
│   │       └── LeftContent.tsx    # Scramble animation, resume download
│   ├── blog/
│   │   ├── BlogCard.tsx           # Book-style card (client, touch-aware)
│   │   ├── BlogSearch.tsx         # Search + tag filter (client, Framer Motion)
│   │   └── MDXContent.tsx         # MDX renderer with component injection
│   └── ui/                        # Small reusable elements
│
├── content/
│   └── blog/
│       └── [slug]/
│           ├── index.mdx          # Post content
│           └── *.tsx              # Post-specific interactive components
│
├── lib/
│   ├── mdx.ts                     # getAllPosts, getPostBySlug, formatDate
│   ├── blog-components.ts         # Per-slug component registry
│   └── config.ts                  # personalInfo, SOCIALS, THEMES
│
└── types/                         # Shared TypeScript interfaces
```

---

## Blog Architecture

Posts live in `src/content/blog/[slug]/`. Each post is an `index.mdx` file with optional co-located `.tsx` components for interactive demos.

Components are injected at render time via a registry — MDX files never `import` directly (not supported by `next-mdx-remote/rsc`). To add a new post with custom components:

```ts
// src/lib/blog-components.ts
import { MyComponent } from "@/content/blog/my-post/MyComponent";

const registry = {
  "my-post": { MyComponent },
};
```

Then use it in the MDX file:

```mdx
<MyComponent />
```

---

## Getting Started

```bash
# Clone
git clone https://github.com/ShihabKUET/my-portfolio.git
cd portfolio

# Install
npm install

# Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Resume

Place your resume at `public/cv.pdf`. The hero section links to it directly with a `download` attribute.

### Highlight.js Theme

Import a theme globally in `app/globals.css` or `app/layout.tsx`:

```css
@import 'highlight.js/styles/github-dark.css';
```

---

## Deployment

Deployed on Vercel with zero configuration. Push to `main` to deploy.

```bash
# Production build check
npm run build
```

---

## License

MIT — use freely, attribution appreciated.

---

<div align="center">
  <sub>Built by <a href="https://shanjidarefin.vercel.app">MD. Shanjid Arefin</a> · Software R&D Engineer · Dhaka, Bangladesh</sub>
</div>
