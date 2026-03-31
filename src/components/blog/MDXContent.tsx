"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

export default function MDXContent({ source }: MDXContentProps) {
  return (
    // The "prose" class from @tailwindcss/typography automatically styles
    // all headings, paragraphs, code blocks, tables, lists etc.
    // "prose-invert" switches it to dark mode
    <div className="prose prose-invert prose-zinc max-w-none
      prose-headings:text-zinc-100
      prose-headings:font-bold
      prose-p:text-zinc-300
      prose-p:leading-relaxed
      prose-a:text-violet-400
      prose-a:no-underline
      hover:prose-a:text-violet-300
      prose-strong:text-zinc-100
      prose-code:text-violet-300
      prose-code:bg-zinc-800/50
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
      prose-blockquote:text-zinc-400
      prose-th:text-zinc-200
      prose-td:text-zinc-400
      prose-li:text-zinc-300
      prose-hr:border-zinc-800">
      <MDXRemote {...source} />
    </div>
  );
}