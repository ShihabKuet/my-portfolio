import type { ComponentType } from "react";

// Post-specific component imports
import NicRoutingDemo from "@/content/blog/multi-nic-routing/NicRoutingDemo";
import {
  InteractiveEncoder,
  EncodingRulesCard,
  MemoryLayout,
  EncodingComparison,
  CommonPitfalls,
} from "@/content/blog/utf-8-encoding/Utf8deepdive";

// Map: post slug → components used in that post's MDX
const registry: Record<string, Record<string, ComponentType>> = {
  "multi-nic-routing": {
    NicRoutingDemo,
  },

  "utf-8-encoding": {  // ← must match your folder/slug exactly
    InteractiveEncoder,
    EncodingRulesCard,
    MemoryLayout,
    EncodingComparison,
    CommonPitfalls,
  },

  // ── Adding a new post with components? Just follow this pattern: ──
  // "your-new-post-slug": {
  //   YourComponent,
  // },
};

export function getComponentsForSlug(
  slug: string
): Record<string, ComponentType> {
  return registry[slug] ?? {}; // posts with no custom components get an empty object
}