import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/mdx";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Portfolio",
  description: "Thoughts on software engineering, networking, and technology.",
};

export default function BlogPage() {
  // getAllPosts() runs on the SERVER — reads files from disk at build time
  const posts = getAllPosts();

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back to home */}
        <Link href="/#blog" className="inline-flex items-center gap-2 text-sky-500 dark:text-zinc-500 hover:text-violet-400 transition-colors text-sm mb-10 font-mono">
          <ArrowLeft size={15} />
          Back to Portfolio
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-violet-500" />
            <span className="text-violet-400 text-sm font-mono tracking-widest uppercase">
              Blog
            </span>
            <div className="h-px w-8 bg-violet-500" />
          </div>
          <h1 className="text-4xl font-bold text-sky-950 dark:text-zinc-100 mb-3">
            Writing & Thoughts
          </h1>
          <p className="text-sky-700 dark:text-zinc-400">
            Articles on software engineering, networking, and things I find interesting.
          </p>
        </div>

        {/* Post list */}
        <div className="space-y-5">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="p-6 rounded-xl bg-white dark:bg-zinc-900/50 border border-sky-200 dark:border-zinc-800/50 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">

                {/* Tags row */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 text-xs font-mono border border-violet-500/20">
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl font-semibold text-sky-950 dark:text-zinc-100 mb-2 group-hover:text-violet-300 transition-colors">
                  {post.title}
                </h2>

                <p className="text-sky-700 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-4 text-sky-500 dark:text-zinc-500 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-sky-400 dark:text-zinc-600 py-16 font-mono">
            No posts yet. Check back soon.
          </p>
        )}
      </div>
    </main>
  );
}