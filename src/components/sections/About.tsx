"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { MapPin, GraduationCap, Briefcase, Coffee } from "lucide-react";

import { Orbitron, DM_Mono } from "next/font/google";

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

const orbitron = Orbitron({
  subsets: ["latin"], // only "latin" is available for Orbitron
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
});

const stats = [
  {
    icon: <Briefcase size={16} />,
    label: "Current Role",
    value: "SWE",
    sub: "Research & Development",
    fill: 9,
  },
  {
    icon: <GraduationCap size={16} />,
    label: "Graduated",
    value: "2024",
    sub: "CSE, KUET",
    fill: 10,
  },
  {
    icon: <MapPin size={16} />,
    label: "Location",
    value: "Dhaka",
    sub: "Bangladesh",
    fill: 6,
  },
  {
    icon: <Coffee size={16} />,
    label: "Status",
    value: "Open",
    sub: "To Building Something Impactful",
    fill: 8,
  },
];

export default function About() {
  {/* Glitch effect refs and logic */ }
  const glitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runGlitch = () => {
      const el = glitchRef.current;
      if (el) {
        el.classList.add("is-glitching");
        setTimeout(() => el.classList.remove("is-glitching"), 350 + Math.random() * 300);
      }
      timeout = setTimeout(runGlitch, 5000 + Math.random() * 4000);
    };

    timeout = setTimeout(runGlitch, 2500 + Math.random() * 1500);
    return () => clearTimeout(timeout);
  }, []);

  {/* Main render */ }
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="ABOUTME.md"
          subtitle="A little background on who I am and what drives me."
        />

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className=" text-sky-800 dark:text-zinc-300 text-lg leading-relaxed mb-6 text-justify">
              {personalInfo.aboutBio}
            </p>

            {/* Quote box */}
            <div className="relative mb-8">

              <style>{`
                @keyframes spin-border {
                  from { transform: rotate(0deg); }
                  to   { transform: rotate(360deg); }
                }
                .quote-spin-glow {
                  position: absolute;
                  inset: -100%;
                  width: 300%;
                  height: 300%;
                  background: conic-gradient(
                    from 0deg,
                    transparent  0%,
                    #a78bfa      20%,
                    #38bdf8      40%,
                    transparent  55%,
                    transparent 100%
                  );
                  animation: spin-border 4s linear infinite;
                }
                .dark .quote-spin-glow {
                  background: conic-gradient(
                    from 0deg,
                    transparent  0%,
                    #7c3aed      20%,
                    #f59e0b      40%,
                    transparent  55%,
                    transparent 100%
                  );
                }
              `}</style>

              {/* Border-only glow wrapper: clips the spinner to a 1.5px strip */}
              <div className="relative p-[1.5px] rounded-2xl overflow-hidden">

                {/* Rotating conic gradient — visible only through the 1.5px gap */}
                <div className="quote-spin-glow" />

                {/* Inner card — solid base covers the spinning interior */}
                <div className="relative backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 rounded-[14px] px-10 py-8 overflow-hidden">

                  {/* Original gradient overlay on top of the solid base */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-sky-500/5 to-blue-500/10 dark:from-violet-900/30 dark:via-blue-900/20 dark:to-zinc-900/30 rounded-[14px] pointer-events-none" />

                  {/* Glow blob */}
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-violet-400/20 dark:bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sky-400/20 dark:bg-sky-600/20 rounded-full blur-2xl pointer-events-none" />

                  {/* Opening quote */}
                  <span className="absolute top-2 left-3 text-7xl leading-none text-violet-400/40 dark:text-amber-300/80 font-serif select-none">
                    "
                  </span>

                  <p
                    className="relative text-sky-800 dark:text-zinc-200 text-[1.05rem] leading-relaxed tracking-wide text-center mx-auto max-w-md"
                    style={{ fontFamily: "'Georgia', 'Cambria', serif", fontStyle: "italic" }}
                  >
                    {personalInfo.quote}
                  </p>

                  {/* Closing quote */}
                  <span className="absolute bottom-2 right-3 text-7xl leading-none text-violet-400/40 dark:text-amber-300/80 font-serif select-none">
                    "
                  </span>

                  {/* Bottom accent line */}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
                    <span className="text-xs font-mono text-violet-400/60 tracking-widest uppercase">personal note</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
                  </div>

                </div>
              </div>
            </div>

            {/* Quick stat pills */}
            <div
              className={`${dmMono.variable} ${orbitron.variable} grid grid-cols-2 gap-[10px]`}
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {stats.map(({ icon, label, value, sub, fill = 7 }, i) => {
                const accents = ["#7F77DD", "#1D9E75", "#EF9F27", "#D4537E"];
                const color = accents[i % accents.length];
                const offset = i % 2 === 1 ? "mt-[14px]" : ""; /* Right pills having different height than the left ones */

                return (
                  <div
                    key={label}
                    className={`group relative px-4 py-[14px] pl-5 rounded-[10px] overflow-hidden cursor-default
                      bg-zinc-100/80 dark:bg-zinc-900/60
                      border border-zinc-200/60 dark:border-zinc-700/40
                      hover:-translate-y-[3px] hover:scale-[1.015] hover:border-zinc-300 dark:hover:border-zinc-600
                      transition-all duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
                      ${offset}`}
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[10px]"
                      style={{ background: color }}
                    />

                    {/* Top row */}
                    <div className="flex items-center justify-between mb-[6px]">
                      <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
                        {label}
                      </span>
                      <div className="w-5 h-5 flex items-center justify-center rounded-[5px]
                        border border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-400">
                        {icon}
                      </div>
                    </div>

                    {/* Value */}
                    <div
                      className="font-black text-[20px] leading-none tracking-tight text-zinc-900 dark:text-zinc-50 mb-[3px]"
                      style={{ fontFamily: "var(--font-orbitron)", fontWeight: 800 }}
                    >
                      {value}
                    </div>

                    {/* Sub label */}
                    {sub && (
                      <div className="text-[10px] tracking-[0.05em] text-zinc-400 dark:text-zinc-500">
                        {sub}
                      </div>
                    )}

                    {/* Mini ticker bar */}
                    <div className="flex gap-[2px] mt-[10px]">
                      {Array.from({ length: 10 }).map((_, j) => (
                        <div
                          key={j}
                          className="h-[3px] flex-1 rounded-full transition-[transform,opacity] duration-200 group-hover:scale-y-[2]"
                          style={{
                            backgroundColor: j < fill ? color : "rgba(128,128,128,0.2)",
                            transitionDelay: `${j * 25}ms`,
                            transformOrigin: "bottom",
                          }}
                        />
                      ))}
                    </div>

                    {/* Corner index */}
                    <div
                      className="absolute bottom-2 right-[10px] text-[9px] tracking-[0.08em] text-zinc-300 dark:text-zinc-700"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                );
              })}
            </div>

          </motion.div>

          {/* Right — Photo placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <style>{`
              @keyframes glitch-base {
                0%   { transform: translate(0, 0);     filter: brightness(1); }
                25%  { transform: translate(-4px, 0);  filter: brightness(1.3) contrast(1.1); }
                50%  { transform: translate(4px, 0);   filter: brightness(0.8) contrast(1.05); }
                75%  { transform: translate(-2px, 1px);filter: brightness(1.1); }
                100% { transform: translate(0, 0);     filter: brightness(1); }
              }
              @keyframes glitch-red {
                0%   { clip-path: inset(7%  0 80% 0); transform: translate(-9px, 0); }
                20%  { clip-path: inset(45% 0 42% 0); transform: translate(9px, 0);  }
                40%  { clip-path: inset(68% 0 20% 0); transform: translate(-7px, 0); }
                60%  { clip-path: inset(22% 0 63% 0); transform: translate(8px, 0);  }
                80%  { clip-path: inset(53% 0 32% 0); transform: translate(-9px, 0); }
                100% { clip-path: inset(7%  0 80% 0); transform: translate(-9px, 0); }
              }
              @keyframes glitch-cyan {
                0%   { clip-path: inset(58% 0 28% 0); transform: translate(9px, 0);  }
                25%  { clip-path: inset(14% 0 70% 0); transform: translate(-9px, 0); }
                50%  { clip-path: inset(33% 0 52% 0); transform: translate(7px, 0);  }
                75%  { clip-path: inset(80% 0 6%  0); transform: translate(-7px, 0); }
                100% { clip-path: inset(58% 0 28% 0); transform: translate(9px, 0);  }
              }
              @keyframes glitch-scan {
                0%, 60%, 100% { opacity: 0; top: 30%; height: 2px; }
                20%            { opacity: 0.8; top: 30%; height: 2px; }
                40%            { opacity: 0.6; top: 62%; height: 3px; }
              }

              .glitch-base {
                animation: float 6s ease-in-out infinite;
              }
              .is-glitching .glitch-base {
                animation: glitch-base 0.09s steps(1) infinite;
              }
              .is-glitching .glitch-red {
                opacity: 1 !important;
                animation: glitch-red 0.1s steps(1) infinite;
              }
              .is-glitching .glitch-cyan {
                opacity: 1 !important;
                animation: glitch-cyan 0.1s steps(1) 0.045s infinite;
              }
              .is-glitching .glitch-scan {
                animation: glitch-scan 0.15s steps(1) infinite;
              }
            `}</style>

            <div className="relative w-72 h-72">
              {/* Decorative ring */}
              <div className="absolute inset-0" />
              <div className="absolute -inset-1 blur-xl" />

              <div ref={glitchRef} className="relative w-full h-full overflow-hidden">

                {/* Base image */}
                <img
                  src="/profile.png"
                  alt={personalInfo.name}
                  className="glitch-base w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = glitchRef.current?.querySelector(".glitch-fallback") as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />

                {/* Red channel — displaced strips, screen blended */}
                <img
                  src="/profile.png"
                  alt="" aria-hidden
                  className="glitch-red absolute inset-0 w-full h-full object-cover object-top opacity-0 pointer-events-none"
                  style={{
                    mixBlendMode: "screen",
                    filter: "sepia(1) saturate(6) hue-rotate(-30deg) brightness(1.1)",
                  }}
                />

                {/* Cyan channel — displaced strips opposite direction, screen blended */}
                <img
                  src="/profile.png"
                  alt="" aria-hidden
                  className="glitch-cyan absolute inset-0 w-full h-full object-cover object-top opacity-0 pointer-events-none"
                  style={{
                    mixBlendMode: "screen",
                    filter: "sepia(1) saturate(6) hue-rotate(150deg) brightness(1.1)",
                  }}
                />

                {/* Horizontal scanline flash */}
                <div
                  className="glitch-scan absolute left-0 right-0 bg-white/75 pointer-events-none opacity-0"
                  style={{ top: "30%", height: "2px" }}
                />

                {/* Fallback avatar */}
                <div
                  className="glitch-fallback absolute inset-0 flex-col items-center justify-center bg-gradient-to-br from-violet-900/60 to-sky-900/60 dark:from-amber-100/20 dark:to-amber-600 backdrop-blur-sm"
                  style={{ display: "none" }}
                >
                  <span className="text-9xl select-none">👤</span>
                  <p className="text-zinc-100 text-xs font-mono mt-2 tracking-widest">
                    {personalInfo.name ?? "Profile"}
                  </p>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}