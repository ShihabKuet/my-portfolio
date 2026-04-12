"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { Skill } from "@/types";

// ── Category filters ──────────────────────────────────────────────────────────

const categories: { label: string; value: Skill["category"] | "all" }[] = [
  { label: "All",                  value: "all"       },
  { label: "Languages",            value: "languages" },
  { label: "Frontend",             value: "frontend"  },
  { label: "Backend",              value: "backend"   },
  { label: "Operating System",     value: "os"        },
  { label: "Tools",                value: "tools"     },
];

// ── Per-category color palettes ───────────────────────────────────────────────

interface Palette {
  fillDark:     string; fillLight:     string;
  glossDark:    string; glossLight:    string;
  borderDark:   string; borderLight:   string;
  starOnDark:   string; starOnLight:   string;
  starOffDark:  string; starOffLight:  string;
  textDark:     string; textLight:     string;
}

const PALETTES: Record<Skill["category"], Palette> = {
  languages: {
    fillDark:    "#b45309",  fillLight:    "#f59e0b",
    glossDark:   "#fcd34d",  glossLight:   "#fef9c3",
    borderDark:  "#78350f",  borderLight:  "#d97706",
    starOnDark:  "#fef08a",  starOnLight:  "#78350f",
    starOffDark: "#451a03",  starOffLight: "#fde68a",
    textDark:    "#fef3c7",  textLight:    "#451a03",
  },
  frontend: {
    fillDark:    "#5b21b6",  fillLight:    "#7c3aed",
    glossDark:   "#a78bfa",  glossLight:   "#ede9fe",
    borderDark:  "#3b0764",  borderLight:  "#5b21b6",
    starOnDark:  "#ede9fe",  starOnLight:  "#3b0764",
    starOffDark: "#2e1065",  starOffLight: "#ddd6fe",
    textDark:    "#ede9fe",  textLight:    "#2e1065",
  },
  backend: {
    fillDark:    "#065f46",  fillLight:    "#059669",
    glossDark:   "#34d399",  glossLight:   "#d1fae5",
    borderDark:  "#022c22",  borderLight:  "#047857",
    starOnDark:  "#d1fae5",  starOnLight:  "#022c22",
    starOffDark: "#021d18",  starOffLight: "#a7f3d0",
    textDark:    "#d1fae5",  textLight:    "#021d18",
  },
  os: {
    fillDark:    "#9ea100",  fillLight:    "#879fc0",
    glossDark:   "#873844",  glossLight:   "#b4f42b",
    borderDark:  "#4c0519",  borderLight:  "#be123c",
    starOnDark:  "#ffe4e6",  starOnLight:  "#4c0519",
    starOffDark: "#3f0011",  starOffLight: "#fecdd3",
    textDark:    "#ffe4e6",  textLight:    "#3f0011",
  },
  tools: {
    fillDark:    "#9f1239",  fillLight:    "#1d82e1",
    glossDark:   "#fb7185",  glossLight:   "#ffe4e6",
    borderDark:  "#4c0519",  borderLight:  "#be123c",
    starOnDark:  "#ffe4e6",  starOnLight:  "#4c0519",
    starOffDark: "#3f0011",  starOffLight: "#fecdd3",
    textDark:    "#ffe4e6",  textLight:    "#3f0011",
  },
};

// ── Hex Badge ─────────────────────────────────────────────────────────────────

function HexBadge({ skill, index, isDark }: {
  skill:  Skill;
  index:  number;
  isDark: boolean;
}) {
  const p = PALETTES[skill.category];

  const fill   = isDark ? p.fillDark   : p.fillLight;
  const gloss  = isDark ? p.glossDark  : p.glossLight;
  const border = isDark ? p.borderDark : p.borderLight;
  const starOn = isDark ? p.starOnDark : p.starOnLight;
  const starOff= isDark ? p.starOffDark: p.starOffLight;
  const text   = isDark ? p.textDark   : p.textLight;

  // Flat-top hexagon in a 100×115 viewBox
  const hex     = "50,5 95,28 95,86 50,110 5,86 5,28";
  // Top face — top third only, gives 3D raised illusion
  const topFace = "50,5 95,28 95,54 50,42 5,54 5,28";

  const uid = `hex-${index}-${skill.name.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.82 }}
      whileInView={{ opacity: 1, y: 0,  scale: 1   }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.055, ease: "easeOut" }}
      whileHover={{ y: -7, scale: 1.07, transition: { duration: 0.18 } }}
      className="flex flex-col items-center gap-2 cursor-default select-none"
    >
      {/* ── SVG Hexagon ── */}
      <svg
        viewBox="0 0 100 115"
        width="104"
        height="120"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: isDark
            ? "drop-shadow(0 5px 14px rgba(0,0,0,0.75)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
            : "drop-shadow(0 4px 10px rgba(0,0,0,0.20)) drop-shadow(0 1px 3px rgba(0,0,0,0.12))",
        }}
      >
        <defs>
          {/* Main fill: linear gradient top→bottom for 3D depth */}
          <linearGradient id={`${uid}-fill`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor={gloss} stopOpacity="0.9" />
            <stop offset="40%"  stopColor={fill}  stopOpacity="1"   />
            <stop offset="100%" stopColor={fill}  stopOpacity="0.75"/>
          </linearGradient>

          {/* Specular gloss: radial highlight top-left */}
          <radialGradient id={`${uid}-spec`} cx="35%" cy="25%" r="50%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"   />
          </radialGradient>

          {/* Clip to hex shape */}
          <clipPath id={`${uid}-clip`}>
            <polygon points={hex} />
          </clipPath>
        </defs>

        {/* 1. Base hex — gradient fill */}
        <polygon
          points={hex}
          fill={`url(#${uid}-fill)`}
          stroke={border}
          strokeWidth="2"
        />

        {/* 2. Top-face bevel — lighter slice at top for 3D lift */}
        <polygon
          points={topFace}
          fill={gloss}
          opacity="0.28"
          clipPath={`url(#${uid}-clip)`}
        />

        {/* 3. Specular gloss spot */}
        <polygon
          points={hex}
          fill={`url(#${uid}-spec)`}
          clipPath={`url(#${uid}-clip)`}
        />

        {/* 4. Inner stroke for depth */}
        <polygon
          points={hex}
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.12"
          clipPath={`url(#${uid}-clip)`}
        />

        {/* 5. Icon  */}
        {skill.icon && (() => {
          const Icon = skill.icon;
          return (
            <foreignObject x="25" y="36" width="50" height="42">
              <div
                style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon size={36} style={{ color: text, display: "block" }} />
              </div>
            </foreignObject>
          );
        })()}
      </svg>

      {/* Skill name */}
      <span className="text-xs font-semibold text-sky-800 dark:text-zinc-200 text-center leading-tight max-w-[96px]">
        {skill.name}
      </span>

      {/* Star rating */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="none">
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill={i < skill.stars ? starOn : starOff}
              stroke={i < skill.stars ? starOn : starOff}
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function Skills() {
  const [active, setActive] = useState<Skill["category"] | "all">("all");
  const [isDark,  setIsDark] = useState(true);

  // Sync isDark with the html.dark class (set by next-themes)
  // MutationObserver watches for class changes when user toggles theme
  useEffect(() => {
    const sync = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    sync(); // read immediately on mount

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const filtered = active === "all"
    ? skills
    : skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="py-24 px-4 bg-sky-100/60 dark:bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I work with."
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {categories.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActive(value)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-200 border",
                active === value
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white dark:bg-zinc-800/50 text-sky-600 dark:text-zinc-400 border-sky-200 dark:border-zinc-700 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Badge grid — key on active forces re-entrance animation on filter */}
        <div
          key={active}
          className="flex flex-wrap justify-center gap-x-5 gap-y-8"
        >
          {filtered.map((skill, i) => (
            <HexBadge
              key={skill.name}
              skill={skill}
              index={i}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-14 pt-8 border-t border-sky-200 dark:border-zinc-800/50">
          {(Object.keys(PALETTES) as Skill["category"][]).map((cat) => {
            const p = PALETTES[cat];
            return (
              <div key={cat} className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-sm"
                  style={{ background: isDark ? p.fillDark : p.fillLight }}
                />
                <span className="text-xs font-mono text-sky-600 dark:text-zinc-500 capitalize">
                  {cat}
                </span>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5 ml-4">
            {[1,2,3,4,5].map(n => (
              <svg key={n} width="11" height="11" viewBox="0 0 24 24">
                <polygon
                  points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                  fill={n <= 3 ? (isDark ? "#fef08a" : "#b45309") : (isDark ? "#451a03" : "#fde68a")}
                  strokeWidth="0"
                />
              </svg>
            ))}
            <span className="text-xs font-mono text-sky-600 dark:text-zinc-500 ml-1">= proficiency</span>
          </div>
        </div>
      </div>
    </section>
  );
}