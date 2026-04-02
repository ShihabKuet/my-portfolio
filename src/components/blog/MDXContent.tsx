// No "use client" needed — this is now a Server Component
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

interface MDXContentProps {
  source: string; // raw MDX string — no more serialized object
}

export default function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-invert prose-zinc max-w-none
      prose-headings:text-sky-950 dark:text-zinc-100
      prose-headings:font-bold
      prose-p:text-sky-800 dark:text-zinc-300
      prose-p:leading-relaxed
      prose-a:text-violet-400
      prose-a:no-underline
      hover:prose-a:text-violet-300
      prose-strong:text-sky-950 dark:text-zinc-100
      prose-code:text-violet-300
      prose-code:bg-sky-100 dark:bg-zinc-800/50
      prose-code:px-1.5
      prose-code:py-0.5
      prose-code:rounded
      prose-code:text-sm
      prose-code:before:content-none
      prose-code:after:content-none
      prose-pre:bg-zinc-900
      prose-pre:border
      prose-pre:border-zinc-800
      prose-blockquote:border-violet-500
      prose-blockquote:text-sky-700 dark:text-zinc-400
      prose-th:text-sky-900 dark:text-zinc-200
      prose-td:text-sky-700 dark:text-zinc-400
      prose-li:text-sky-800 dark:text-zinc-300
      prose-hr:border-zinc-800">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeHighlight],
          },
        }}
      />
    </div>
  );
}