"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, personalInfo } from "@/data";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Code2, Menu, X, Network,
  User, Wrench, Briefcase, FolderOpen, FlaskConical,
  GraduationCap, Trophy, Terminal, PenLine, Mail,
  FileDown, LucideIcon,
} from "lucide-react";

// ── Icon map — string name → Lucide component ────────────────────────────────
// This is the standard pattern for dynamic icon rendering in TypeScript
const iconMap: Record<string, LucideIcon> = {
  User, Wrench, Briefcase, FolderOpen, FlaskConical,
  GraduationCap, Trophy, Terminal, PenLine, Mail, Network,
};

// ── Tooltip Icon Button ───────────────────────────────────────────────────────
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
    // "group" enables group-hover on children — the tooltip appears on hover
    <li className="relative group">
      <Link
        href={href}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
          active
            ? "text-violet-400 bg-violet-500/10"
            : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/60"
        )}
        aria-label={label}
      >
        <Icon size={17} />
      </Link>

      {/* Tooltip — hidden by default, visible on group-hover */}
      <div className={cn(
        "absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50",
        "pointer-events-none opacity-0 group-hover:opacity-100",
        "transition-all duration-200 translate-y-1 group-hover:translate-y-0",
      )}>
        {/* Tooltip arrow */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 border-l border-t border-zinc-700/50 rotate-45" />

        {/* Tooltip box */}
        <div className="relative px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700/50 shadow-xl">
          <span className="text-zinc-200 text-xs font-mono whitespace-nowrap">
            {label}
          </span>
        </div>
      </div>
    </li>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
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

  // IntersectionObserver — highlight active section
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
        { threshold: 0.4, rootMargin: "-80px 0px -20% 0px" }
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
        ? "bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 py-2"
        : "bg-transparent py-4"
    )}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 text-zinc-100 font-bold text-lg hover:text-violet-400 transition-colors shrink-0">
          <Code2 size={20} className="text-violet-500" />
          <span className="font-mono">
            {personalInfo.name.split(" ")[0]}
            <span className="text-violet-500">.</span>
          </span>
        </Link>

        {/* ── Desktop — Icon nav ── */}
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

        {/* ── Right side — Theme toggle + Resume ── */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <a
            href="/cv.pdf"
            target="_blank"
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white overflow-hidden group/resume"
          >
            {/* Animated gradient background */}
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 transition-all duration-300 group-hover/resume:from-violet-500 group-hover/resume:via-purple-500 group-hover/resume:to-indigo-500" />

            {/* Shimmer sweep on hover */}
            <span className="absolute inset-0 translate-x-[-100%] group-hover/resume:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

            {/* Glow underneath */}
            <span className="absolute inset-0 rounded-lg opacity-0 group-hover/resume:opacity-100 transition-opacity duration-300 blur-md bg-violet-500/50 -z-10 scale-110" />

            {/* Content */}
            <span className="relative flex items-center gap-1.5">
                <FileDown size={14} className="transition-transform duration-300 group-hover/resume:-translate-y-0.5 group-hover/resume:translate-x-0.5" />
                <span>Resume</span>
            </span>
          </a>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ── Mobile Menu — shows icon + label side by side ── */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
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
                        : "text-zinc-400 hover:text-violet-400 hover:bg-zinc-800/50"
                    )}
                  >
                    <Icon size={15} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile bottom row */}
          <div className="px-4 pb-3 pt-1 border-t border-zinc-800/50 flex items-center justify-between">
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