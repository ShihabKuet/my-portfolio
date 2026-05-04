import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts, formatDate } from "@/lib/mdx";
import { getComponentsForSlug } from "@/lib/blog-components";
import MDXContent from "@/components/blog/MDXContent";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://shanjid.bd/blog/${slug}` },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const components = getComponentsForSlug(slug); // ← only addition

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ── Back nav ── */}
        <div className="inline-flex mb-10 group/nav">
          <span
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs
              bg-zinc-50 dark:bg-zinc-900
              transition-all duration-300 ease-out
              group-hover/nav:-translate-y-0.5
              group-hover/nav:bg-white dark:group-hover/nav:bg-zinc-900/80"
            style={{
              boxShadow: "0 0 0 1px rgba(139,92,246,0.18), 0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {/* Violet glow ring on hover */}
            <span
              className="absolute inset-0 rounded-xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: "0 0 0 1.5px rgba(139,92,246,0.55), 0 4px 20px rgba(139,92,246,0.13)" }}
            />
 
            {/* Shell prompt */}
            <span className="text-violet-400 dark:text-violet-500 select-none">❯</span>
 
            {/* Path segments */}
            <span className="flex items-center gap-1">
              <span className="text-zinc-400 dark:text-zinc-600 select-none">~/</span>
              <Link
                href="/"
                className="text-sky-600 dark:text-sky-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-200"
              >
                portfolio
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">/</span>
              <Link
                href="/blog"
                className="text-sky-600 dark:text-sky-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-200"
              >
                blog
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">/</span>
              <span className="text-zinc-500 dark:text-zinc-400 max-w-[180px] sm:max-w-[280px] truncate">
                {post.slug}
              </span>
            </span>
 
            {/* Return symbol slides in on hover */}
            <span className="text-violet-400 opacity-0 translate-x-1 group-hover/nav:opacity-60 group-hover/nav:translate-x-0 transition-all duration-300 select-none">
              ↵
            </span>
          </span>
        </div>

        <header className="mb-12">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 text-xs font-mono border border-violet-500/20">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-sky-950 dark:text-zinc-100 leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-sky-700 dark:text-zinc-400 text-lg leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-5 text-sky-500 dark:text-zinc-500 text-sm font-mono pb-6 border-b border-zinc-800">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {post.readTime}
            </span>
          </div>
        </header>

        <MDXContent source={post.content} components={components} />

        <div className="mt-16 pt-8 border-t border-zinc-800">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sky-700 dark:text-zinc-400 hover:text-violet-400 transition-colors font-mono text-sm">
            <ArrowLeft size={14} />
            Back to all posts
          </Link>
        </div>
      </div>
    </main>
  );
}