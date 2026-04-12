import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readTime: string;
  coverImage?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  const entries = fs.readdirSync(BLOG_DIR, { withFileTypes: true });

  const posts = entries
    .filter((entry) => entry.isDirectory())
    .map((dir) => {
      const slug = dir.name;
      const filePath = path.join(BLOG_DIR, slug, "index.mdx");

      if (!fs.existsSync(filePath)) return null; // skip folders without index.mdx

      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        tags: data.tags ?? [],
        readTime: readingTime(content).text,
        coverImage: data.coverImage ?? null,
      };
    })
    .filter(Boolean) as PostMeta[];

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const filePath = path.join(BLOG_DIR, slug, "index.mdx");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      tags: data.tags ?? [],
      readTime: readingTime(content).text,
      coverImage: data.coverImage ?? null,
      content,
    };
  } catch {
    return null;
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}