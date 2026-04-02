import { cn } from "@/lib/utils";

interface TechBadgeProps {
  name: string;
  size?: "sm" | "md";
}

export default function TechBadge({ name, size = "sm" }: TechBadgeProps) {
  return (
    <span className={cn(
      "rounded-md bg-sky-100 dark:bg-zinc-800/80 text-sky-700 dark:text-zinc-400 font-mono border border-zinc-700/50 transition-colors hover:border-violet-500/40 hover:text-violet-300",
      size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
    )}>
      {name}
    </span>
  );
}