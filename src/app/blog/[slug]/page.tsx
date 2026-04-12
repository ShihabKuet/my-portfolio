import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts, formatDate } from "@/lib/mdx";
import { getComponentsForSlug } from "@/lib/blog-components";
import MDXContent from "@/components/blog/MDXContent";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

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

        <Link href="/blog" className="inline-flex items-center gap-2 text-sky-500 dark:text-zinc-500 hover:text-violet-400 transition-colors text-sm mb-10 font-mono">
          <ArrowLeft size={15} />
          All Posts
        </Link>

        <header className="mb-12">
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