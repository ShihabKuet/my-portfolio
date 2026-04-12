import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import type { ComponentType } from "react";

interface MDXContentProps {
  source: string;
  components?: Record<string, ComponentType>; // injected per-post from the registry
}

export default function MDXContent({
  source,
  components = {},
}: MDXContentProps) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert
      prose-headings:text-sky-950 dark:prose-headings:text-zinc-100
      prose-headings:font-bold
      prose-p:text-sky-800 dark:prose-p:text-zinc-300
      prose-p:leading-relaxed
      prose-a:text-violet-700 dark:prose-a:text-violet-400
      prose-a:no-underline
      hover:prose-a:text-violet-900 dark:hover:prose-a:text-violet-300
      prose-strong:text-sky-950 dark:prose-strong:text-zinc-100
      prose-code:text-violet-700 dark:prose-code:text-violet-300
      prose-code:bg-sky-100 dark:prose-code:bg-zinc-800/50
      prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700
      prose-blockquote:border-violet-500
      prose-blockquote:text-sky-700 dark:prose-blockquote:text-zinc-400
      prose-th:text-sky-900 dark:prose-th:text-zinc-200
      prose-td:text-sky-700 dark:prose-td:text-zinc-400
      prose-li:text-sky-800 dark:prose-li:text-zinc-300
      prose-hr:border-zinc-200 dark:prose-hr:border-zinc-700">
      <MDXRemote
        source={source}
        components={components}
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