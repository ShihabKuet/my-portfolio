"use client";

import { useState, useEffect } from "react";
import { Menu, X, Code2 } from "lucide-react";
import { navItems, personalInfo } from "@/data";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => setIsMenuOpen(false);

  return (
    <header className={cn("fixed top-0 w-full z-50 transition-all duration-300", isScrolled ? "bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 py-3" : "bg-transparent py-5")}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        <a href="#hero" className="flex items-center gap-2 text-zinc-100 font-bold text-lg hover:text-violet-400 transition-colors">
          <Code2 size={20} className="text-violet-500" />
          <span className="font-mono">
            {personalInfo.name.split(" ")[0]}
            <span className="text-violet-500">.</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-md transition-all duration-200 font-mono">
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/cv.pdf" target="_blank" className="ml-2 px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-md transition-colors font-medium">
              Resume ↗
            </a>
          </li>
        </ul>

        <button className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
          <ul className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={handleNavClick} className="block px-3 py-2 text-zinc-300 hover:text-violet-400 hover:bg-zinc-800/50 rounded-md transition-all font-mono text-sm">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}