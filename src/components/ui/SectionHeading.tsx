// Props = the inputs a component accepts (like function arguments)
// By typing them with TypeScript, you get autocomplete & safety
interface SectionHeadingProps {
  title: string;
  subtitle?: string; // "?" means optional
  align?: "left" | "center";
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}>
      {/* The colored dot + line decoration before the title */}
      <div className={`flex items-center gap-3 mb-3 ${align === "center" ? "justify-center" : ""}`}>
        <div className="h-px w-8 bg-violet-500" />
        <span className="text-violet-600 dark:text-violet-400 text-sm font-mono tracking-widest uppercase">
          {title}
        </span>
        <div className="h-px w-8 bg-violet-500" />
      </div>

      {subtitle && (
        <p className="text-sky-600 text-sky-700 dark:text-zinc-400 text-base max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}