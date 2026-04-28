import type { MDXComponents } from "mdx/types";

// Register project-specific MDX component sets here.
// Key = project slug, value = async loader for that project's MDX components.
//
// Example:
//   "booklit": () =>
//     import("@/content/projects/booklit/components").then((m) => m.default),
//
const registry: Record<string, () => Promise<MDXComponents>> = {};

export async function getComponentsForProjectSlug(
  slug: string
): Promise<MDXComponents> {
  const loader = registry[slug];
  if (!loader) return {};
  try {
    return await loader();
  } catch {
    return {};
  }
}