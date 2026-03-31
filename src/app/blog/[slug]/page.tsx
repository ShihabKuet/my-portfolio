import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts, formatDate } from "@/lib/mdx";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import MDXContent from "@/components/blog/MDXContent";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// generateMetadata = dynamic SEO per post
// Google will see each post's own title and description
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

// generateStaticParams = tells Next.js which slugs exist at BUILD time
// This pre-renders every blog post as a static HTML file — ultra fast
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // If slug doesn't match any file, show 404 page
  if (!post) notFound();

  // serialize() converts raw MDX string → a format React can render
  // This runs on the SERVER — the heavy work happens before the browser gets anything
  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeHighlight],
    },
  });

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-violet-400 transition-colors text-sm mb-10 font-mono">
          <ArrowLeft size={15} />
          All Posts
        </Link>

        {/* Post header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 text-xs font-mono border border-violet-500/20">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-5 text-zinc-500 text-sm font-mono pb-6 border-b border-zinc-800">
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

        {/* The actual post content rendered from MDX */}
        <MDXContent source={mdxSource} />

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-violet-400 transition-colors font-mono text-sm">
            <ArrowLeft size={14} />
            Back to all posts
          </Link>
        </div>
      </div>
    </main>
  );
}