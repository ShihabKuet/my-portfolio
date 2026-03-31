import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

// Where all blog posts live
const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

// TypeScript type for a post's metadata
export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readTime: string;
}

// Full post = metadata + the actual MDX content string
export interface Post extends PostMeta {
  content: string;
}

// ── Get metadata for ALL posts (used on the /blog listing page) ──────────────
export function getAllPosts(): PostMeta[] {
  // Read every .mdx file in the blog directory
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(".mdx", ""); // "my-post.mdx" → "my-post"
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // gray-matter splits the file into { data: frontmatter, content: body }
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      tags: data.tags ?? [],
      readTime: readingTime(content).text, // e.g. "4 min read"
    };
  });

  // Sort by date — newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// ── Get a SINGLE post by slug (used on the /blog/[slug] page) ────────────────
export function getPostBySlug(slug: string): Post | null {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      tags: data.tags ?? [],
      readTime: readingTime(content).text,
      content, // The raw MDX string — rendered by next-mdx-remote
    };
  } catch {
    return null; // Returns null if post doesn't exist → triggers 404
  }
}

// ── Format a date string nicely ───────────────────────────────────────────────
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}