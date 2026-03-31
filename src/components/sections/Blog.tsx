import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/mdx";
import SectionHeading from "@/components/ui/SectionHeading";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";

export default function Blog() {
  // Show only the 3 most recent posts
  const posts = getAllPosts().slice(0, 3);

  return (
    <section id="blog" className="py-24 px-4 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Blog"
          subtitle="Thoughts on engineering, systems, and tech."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="h-full flex flex-col p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 text-xs font-mono border border-violet-500/20">
                      <Tag size={9} />
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-zinc-100 font-semibold text-base leading-snug mb-2 group-hover:text-violet-300 transition-colors flex-grow">
                  {post.title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-3 text-zinc-500 text-xs font-mono mt-auto pt-3 border-t border-zinc-800/50">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {post.readTime}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-zinc-700 hover:border-violet-500/50 text-zinc-300 hover:text-violet-400 transition-all duration-200 text-sm font-medium">
            View All Posts
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}