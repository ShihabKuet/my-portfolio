"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, personalInfo } from "@/data";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";
import {
  Code2, Menu, X, Network,
  User, Wrench, Briefcase, FolderOpen, FlaskConical,
  GraduationCap, Trophy, Terminal, PenLine, Mail,
  FileDown, LucideIcon,
} from "lucide-react";

// ── Icon map ─────────────────────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  User, Wrench, Briefcase, FolderOpen, FlaskConical,
  GraduationCap, Trophy, Terminal, PenLine, Mail, Network,
};

// ── Frame definitions ─────────────────────────────────────────────────────────
// type: 'svg'  → shows your SVG logo, holds 3 s
// type: 'text' → shows a phrase,    holds 1.9 s
// splitColor   → first word is violet, rest sky/zinc (used for your name)
type TextFrame = { type: "text"; text: string; splitColor?: boolean };
type SvgFrame  = { type: "svg" };
type Frame     = TextFrame | SvgFrame;

const FRAMES: Frame[] = [
  { type: "svg" },
  { type: "text", text: personalInfo.name, splitColor: true },
  { type: "text", text: "Software R&D Engineer" },
  { type: "text", text: "KUET Graduate '24" },
  { type: "text", text: "Network Protocol Dev" },
  { type: "text", text: "Learner & Researcher" },
];

// How long each frame is held (ms) before the exit animation begins
const HOLD_MS = { svg: 8900, text: 4900 } as const;

// ─────────────────────────────────────────────────────────────────────────────
// GravityText — per-character "Column Cascade" animation
//
//  • Enter  (L→R): each char springs in from a random Y offset, blur dissolves
//  • Exit   (R→L): chars scatter away in reverse order, drifting + blurring out
//  • The two directions of the wave make it feel like a living scoreboard flip
// ─────────────────────────────────────────────────────────────────────────────
function GravityText({
  text,
  splitColor,
}: {
  text: string;
  splitColor?: boolean;
}) {
  // Stable random directions per unique text — only regenerates when text changes
  const cache = useRef<{ text: string; dirs: number[] }>({ text: "", dirs: [] });
  if (cache.current.text !== text) {
    cache.current = {
      text,
      dirs: Array.from({ length: text.length }, () =>
        Math.random() > 0.5 ? -1 : 1
      ),
    };
  }
  const { dirs } = cache.current;
  const spaceIdx = text.indexOf(" ");

  return (
    <>
      {text.split("").map((char, i) => {
        const dir     = dirs[i] ?? 1;
        const entryDelay = i * 0.032;                           // L→R cascade in
        const exitDelay  = (text.length - 1 - i) * 0.024;     // R→L cascade out

        const isFirstWord =
          splitColor && spaceIdx !== -1 ? i < spaceIdx : splitColor;

        return (
          <motion.span
            key={i}
            className={cn(
              "inline-block",
              isFirstWord
                ? "text-violet-500"
                : "text-sky-900 dark:text-zinc-100"
            )}
            // ── Appear: spring from random vertical offset, blur → sharp ──────
            initial={{
              y: dir * 20,
              opacity: 0,
              filter: "blur(7px)",
            }}
            animate={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                type: "spring",
                stiffness: 320,
                damping: 28,
                delay: entryDelay,
              },
            }}
            // ── Disappear: drift opposite direction, R→L sweep ──────────────
            exit={{
              y: dir * -15,
              opacity: 0,
              filter: "blur(5px)",
              transition: {
                duration: 0.28,
                delay: exitDelay,
                ease: [0.4, 0, 1, 1],
              },
            }}
          >
            {/* Non-breaking space preserves word gaps */}
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SvgLogoFrame — your SVG logo with a bloom entrance / shrink exit
//
// ⚠️  REPLACE the <svg>…</svg> block below with your actual SVG markup.
//     Keep the wrapping <motion.span> as-is — it handles the animation.
// ─────────────────────────────────────────────────────────────────────────────

const paths = [
  "M604.157 260.804C620.948 258.278 638.526 262.506 652.811 271.544C648.829 278.122 646.229 282.722 640.676 288.023C625.273 283.019 593.898 273.19 586.519 297.394C584.028 309.826 591.969 316.624 601.696 321.595C619.761 330.825 643.98 336.169 655.787 353.647C662.424 363.471 661.835 375.937 659.457 386.551C688.414 347.952 727.253 352.412 759.728 321.712C764.098 317.58 768.164 310.643 771.204 305.518C769.38 312.024 767.874 315.679 764.631 321.468C746.225 348.86 710.925 353.755 684.927 372.124C671.675 381.487 665.955 389.818 655.29 401.803C643.426 415.135 631.252 416.276 614.654 416.852C634.362 409.976 643.144 396.482 640.564 375.14C638.978 360.313 621.382 351.85 607.639 347.033C575.429 335.742 549.567 314.125 571.584 277.888C577.57 268.037 592.263 262.555 604.157 260.804Z",
  "M692.037 260.122C694.928 260.075 696.845 259.907 699.652 260.654C702.595 262.62 729.875 324.097 733.866 332.853C727.478 336.136 720.999 339.238 714.436 342.157C708.496 330.382 701.016 312.355 695.45 299.953L688.386 317.314L667.175 367.238C664.411 355.921 662.543 351.249 654.727 342.599C658.093 333.942 689.815 262.103 692.037 260.122Z",
  "M568.88 376.396C570.614 377.067 575.771 381.468 577.721 382.734C595.308 394.155 619.656 397.551 636.07 382.618C635.39 393.157 633.474 397.74 626.795 405.611C607.607 423.119 575.005 408.799 557.75 394.744C561.423 388.605 565.133 382.489 568.88 376.396Z",
  "M740.649 349.816C743.08 351.84 767.468 407.386 770.522 414.578C764.911 414.759 759.895 414.593 754.39 413.477C741.603 409.642 738.939 397.198 733.837 386.121C729.753 377.254 725.955 368.21 721.919 359.3C728.711 356.121 734.069 353.524 740.649 349.816Z"
];

const offsets = [
  { x: -2.4, y: -2.0 },
  { x: 0.3,  y: -1.7 },
  { x: -2.1, y: -2.6 },
  { x: -2.2, y: -0.8 },
];

function SvgLogoFrame() {
  return (
    <motion.span
      className="inline-flex items-center relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.6 }}
    >
      {/* ⚡ ENERGY GLOW LAYER */}
      <motion.div
        className="absolute inset-0 blur-xl rounded-full bg-violet-500/30"
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <motion.svg
        viewBox="550 240 250 200"
        className="h-6 w-auto text-violet-500 dark:text-white relative z-10"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="2">
          
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}

              /* Phase 1: glitch entry */
              initial={{
                pathLength: 0,
                opacity: 0,
                x: offsets[i % offsets.length].x,
                y: offsets[i % offsets.length].y,
              }}

              /* Phase 2 + 3: draw + stabilize */
              animate={{
                pathLength: 1,
                opacity: 1,
                x: 0,
                y: 0,
              }}

              transition={{
                duration: 1.2,
                delay: i * 0.25,
                ease: "easeInOut",
              }}

              /* transition out exit */
              exit={{
                pathLength: 0,
                opacity: 0,
                x: offsets[i % offsets.length].x,
                y: offsets[i % offsets.length].y,
                transition: {
                  duration: 1.2,
                  delay: (paths.length - i) * 0.25, // exact reverse stagger
                  ease: "easeInOut",
                },
              }}
            />
          ))}
        </g>

        {/* Phase 4: fill overlay */}
        <motion.g
          fill="currentColor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </motion.g>
      </motion.svg>
    </motion.span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LogoAnimator — cycles through FRAMES, renders the right sub-component,
// and drives the blinking cursor that trails the content
// ─────────────────────────────────────────────────────────────────────────────
function LogoAnimator() {
  const [idx, setIdx] = useState(0);

  // Advance to next frame after the hold duration expires
  useEffect(() => {
    const frame = FRAMES[idx];
    const hold  = HOLD_MS[frame.type];
    const t = setTimeout(() => setIdx((i) => (i + 1) % FRAMES.length), hold);
    return () => clearTimeout(t);
  }, [idx]);

  const frame = FRAMES[idx];

  return (
    <span className="inline-flex items-center font-mono text-sm font-bold">
      {/*
        AnimatePresence mode="wait" → exit plays fully before enter starts.
        This is critical so the R→L scatter finishes before new chars appear.
      */}
      <AnimatePresence mode="wait">
        {frame.type === "svg" ? (
          // key="svg" so React treats it as a single stable node across svg frames
          <motion.span key="svg-logo" className="inline-flex items-center">
            <SvgLogoFrame />
          </motion.span>
        ) : (
          // key=text ensures re-mount (and re-animation) for every new phrase
          <motion.span key={frame.text} className="inline-flex items-center">
            <GravityText text={frame.text} splitColor={frame.splitColor} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NavIconButton — desktop icon pill with tooltip
// ─────────────────────────────────────────────────────────────────────────────
function NavIconButton({
  href,
  label,
  iconName,
  active,
}: {
  href:     string;
  label:    string;
  iconName: string;
  active:   boolean;
}) {
  const Icon = iconMap[iconName] ?? Code2;

  return (
    <li className="relative group">
      <Link
        href={href}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
          active
            ? "text-violet-600 dark:text-violet-400 bg-violet-500/10"
            : "text-sky-600 dark:text-zinc-500 hover:text-sky-900 dark:hover:text-sky-950 dark:text-zinc-100 hover:bg-sky-100 dark:hover:bg-sky-100 dark:bg-zinc-800/60"
        )}
        aria-label={label}
      >
        <Icon size={17} />
      </Link>

      {/* Tooltip */}
      <div className={cn(
        "absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50",
        "pointer-events-none opacity-0 group-hover:opacity-100",
        "transition-all duration-200 translate-y-1 group-hover:translate-y-0",
      )}>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-sky-100 dark:bg-zinc-800 border-l border-t border-zinc-700/50 rotate-45" />
        <div className="relative px-2.5 py-1.5 rounded-lg bg-sky-100 dark:bg-zinc-800 border border-zinc-700/50 shadow-xl">
          <span className="text-sky-900 dark:text-zinc-200 text-xs font-mono whitespace-nowrap">
            {label}
          </span>
        </div>
      </div>
    </li>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [isScrolled, setIsScrolled]       = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const isHome   = pathname === "/";

  // Backdrop blur on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver — highlight active nav item
  useEffect(() => {
    if (!isHome) return;

    const sectionIds = navItems
      .map((item) => item.href.replace("/#", ""))
      .filter((id) => !id.startsWith("/"));

    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.2, rootMargin: "-80px 0px -20% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  const isActive = (href: string) => {
    if (href === "/blog") return pathname.startsWith("/blog");
    const id = href.replace("/#", "");
    return isHome && activeSection === id;
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled
        ? "bg-sky-50/90 dark:bg-zinc-950/80 backdrop-blur-md border-b border-sky-200 dark:border-zinc-800/50 py-3"
        : "bg-transparent py-4"
    )}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* ── Logo — Column Cascade Scatter cycling animation ── */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <Code2
            size={20}
            className="text-violet-500 group-hover:text-violet-400 transition-colors shrink-0"
          />
          <LogoAnimator />
        </Link>

        {/* ── Desktop icon nav ── */}
        <ul className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <NavIconButton
              key={item.href}
              href={item.href}
              label={item.label}
              iconName={item.icon ?? "Code2"}
              active={isActive(item.href)}
            />
          ))}
        </ul>

        {/* ── Right: theme toggle + resume button ── */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <a
            href="/cv.pdf"
            target="_blank"
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white overflow-hidden group/resume"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 transition-all duration-300 group-hover/resume:from-violet-500 group-hover/resume:via-purple-500 group-hover/resume:to-indigo-500" />
            <span className="absolute inset-0 translate-x-[-100%] group-hover/resume:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            <span className="absolute inset-0 rounded-lg opacity-0 group-hover/resume:opacity-100 transition-opacity duration-300 blur-md bg-violet-500/50 -z-10 scale-110" />
            <span className="relative flex items-center gap-1.5">
              <FileDown size={14} className="transition-transform duration-300 group-hover/resume:-translate-y-0.5 group-hover/resume:translate-x-0.5" />
              <span>Resume</span>
            </span>
          </a>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-2 text-sky-700 dark:text-zinc-400 hover:text-sky-950 dark:text-zinc-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      {isMenuOpen && (
        <div className="md:hidden bg-sky-50/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-sky-200 dark:border-zinc-800">
          <ul className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 gap-1">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon ?? "Code2"] ?? Code2;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all font-mono text-sm",
                      isActive(item.href)
                        ? "text-violet-400 bg-violet-500/10"
                        : "text-sky-600 text-sky-700 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-sky-100 dark:hover:bg-sky-100 bg-sky-100 dark:bg-zinc-800/50"
                    )}
                  >
                    <Icon size={15} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="px-4 pb-3 pt-1 border-t border-sky-200 dark:border-zinc-800/50 flex items-center justify-between">
            <ThemeToggle />
            <a
              href="/cv.pdf"
              target="_blank"
              className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white overflow-hidden group/resume"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
              <span className="absolute inset-0 translate-x-[-100%] group-hover/resume:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              <span className="relative flex items-center gap-1.5">
                <FileDown size={14} />
                Resume
              </span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}