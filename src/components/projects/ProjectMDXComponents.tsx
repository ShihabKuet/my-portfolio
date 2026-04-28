import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { slugifyHeading } from "@/lib/utils";

/** Recursively extract plain text from React children */
function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node !== null && typeof node === "object" && "props" in node) {
    return getTextContent(
      (node as { props: { children: ReactNode } }).props.children
    );
  }
  return "";
}

/**
 * Heading components that inject an `id` derived from the heading text.
 * This makes anchor links (#section) and the TOC work correctly.
 */
export const projectHeadingComponents: Partial<MDXComponents> = {
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 id={slugifyHeading(getTextContent(children))} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 id={slugifyHeading(getTextContent(children))} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4 id={slugifyHeading(getTextContent(children))} {...props}>
      {children}
    </h4>
  ),
};