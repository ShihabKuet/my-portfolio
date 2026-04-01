"use client";

import { useState, useEffect } from "react";
import { Menu, X, Code2 } from "lucide-react";
import { navItems, personalInfo } from "@/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [isScrolled, setIsScrolled]   = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Scroll detection — adds backdrop blur when scrolled
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver — watches which section is in view
  // and updates the active nav link accordingly
  useEffect(() => {
    if (!isHome) return; // Only track sections on the homepage

    const sectionIds = navItems
      .map((item) => item.href.replace("/#", ""))
      .filter((id) => !id.startsWith("/"));

    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        {
          // Fire when section is 40% visible
          threshold: 0.4,
          rootMargin: "-80px 0px -20% 0px",
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    // Cleanup all observers when component unmounts
    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  const handleNavClick = () => setIsMenuOpen(false);

  const isActive = (href: string) => {
    if (href === "/blog") return pathname.startsWith("/blog");
    const id = href.replace("/#", "");
    return isHome && activeSection === id;
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
        ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 py-3"
        : "bg-transparent py-5"
    )}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-zinc-100 font-bold text-lg hover:text-violet-400 transition-colors">
          <Code2 size={20} className="text-violet-500" />
          <span className="font-mono">
            {personalInfo.name.split(" ")[0]}
            <span className="text-violet-500">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm rounded-md transition-all duration-200 font-mono",
                  isActive(item.href)
                    ? "text-violet-400 bg-violet-500/10"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <a
              href="/cv.pdf"
              target="_blank"
              className="ml-2 px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-md transition-colors font-medium"
            >
              Resume ↗
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
          <ul className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "block px-3 py-2 rounded-md transition-all font-mono text-sm",
                    isActive(item.href)
                      ? "text-violet-400 bg-violet-500/10"
                      : "text-zinc-300 hover:text-violet-400 hover:bg-zinc-800/50"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li className="pt-2 border-t border-zinc-800 mt-1">
                <div className="flex items-center justify-between px-3 py-2">
                <span className="text-zinc-500 text-sm font-mono">Theme</span>
                <ThemeToggle />
                </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}