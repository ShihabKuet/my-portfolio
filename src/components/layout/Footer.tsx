"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { personalInfo, navItems } from "@/data";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, FileDown, BookOpen, Globe, PenTool } from "lucide-react";
import { PenToolIcon, ScanTextIcon } from "@/components/icons";
import { PenToolIconHandle, ScanTextIconHandle } from "@/components/icons";


export default function Footer() {
  const year = new Date().getFullYear();

  // For the icon animation effect
  const blogIconRef        = useRef<ScanTextIconHandle>(null);
  const amateurdrawIconRef = useRef<PenToolIconHandle>(null);

  /* ── Blinking cursor for the copyright bar ── */
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setCursor((v) => !v), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-white/20 dark:border-white/5">

      {/* ══════════════════════════════════════════════════════════
          ANIMATED OCEAN BACKGROUND
          Four slow-drifting radial blobs create an organic, watery
          depth. Each blob moves on its own path and timeline.
          Light mode: cyan/sky/violet palette
          Dark mode:  deep teal/indigo/navy palette
      ══════════════════════════════════════════════════════════ */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10
          bg-gradient-to-br from-sky-100 via-cyan-50 to-violet-100
          dark:from-[#040d1a] dark:via-[#061220] dark:to-[#080f1e]"
      />

      {/* Blob 1 — large, top-left, slow drift */}
      <div
        aria-hidden
        className="absolute -z-10 rounded-full blur-[90px] opacity-50 dark:opacity-30
          w-[480px] h-[480px] -top-24 -left-24
          bg-cyan-300 dark:bg-cyan-900
          animate-[footerBlob1_14s_ease-in-out_infinite_alternate]"
      />
      {/* Blob 2 — mid, violet, drifts right */}
      <div
        aria-hidden
        className="absolute -z-10 rounded-full blur-[110px] opacity-40 dark:opacity-25
          w-[420px] h-[420px] top-0 right-1/4
          bg-violet-300 dark:bg-indigo-900
          animate-[footerBlob2_18s_ease-in-out_infinite_alternate]"
      />
      {/* Blob 3 — bottom-right, teal */}
      <div
        aria-hidden
        className="absolute -z-10 rounded-full blur-[100px] opacity-45 dark:opacity-30
          w-[380px] h-[380px] bottom-0 right-0
          bg-teal-300 dark:bg-teal-950
          animate-[footerBlob3_16s_ease-in-out_infinite_alternate]"
      />
      {/* Blob 4 — bottom-left, sky accent */}
      <div
        aria-hidden
        className="absolute -z-10 rounded-full blur-[80px] opacity-35 dark:opacity-20
          w-[300px] h-[300px] bottom-0 left-1/3
          bg-sky-300 dark:bg-sky-950
          animate-[footerBlob4_20s_ease-in-out_infinite_alternate]"
      />

      {/* Frosted glass overlay — unifies the blobs into one surface */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10
          bg-white/30 dark:bg-blue-900/10
          backdrop-blur-[2px]"
      />

      {/* SVG wave at the very top — reinforces the water metaphor */}
      <div aria-hidden className="absolute top-0 inset-x-0 overflow-hidden leading-[0] opacity-20 dark:opacity-40">
        <svg
          viewBox="0 0 1440 40"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-10"
        >
          <path
            d="M0,20 C240,40 480,0 720,20 C960,40 1200,0 1440,20 L1440,0 L0,0 Z"
            className="fill-sky-400 dark:fill-cyan-500"
          />
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* ── COL 1: Brand · Bio · Social icons ── */}
          <div className="flex flex-col gap-4">
            {/* Avatar + Wordmark — side by side */}
            <div className="flex items-center gap-3">

              {/* Floating avatar with glowing ring */}
              <div className="relative flex-shrink-0 animate-[footerFloat_4s_ease-in-out_infinite]">
                {/* Outer glow ring — pulses subtly */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 dark:from-violet-600 dark:to-cyan-600 opacity-40 blur-[6px] scale-110" />
                {/* Coloured border ring */}
                <div className="relative w-14 h-14 rounded-full p-[2.5px] bg-gradient-to-br from-violet-400 via-sky-400 to-cyan-400 dark:from-violet-500 dark:via-sky-500 dark:to-cyan-500 shadow-lg shadow-violet-300/40 dark:shadow-violet-900/50">
                  <div className="w-full h-full rounded-full overflow-hidden bg-sky-100 dark:bg-zinc-800">
                    <img
                      src="avatar_1.png"
                      alt={personalInfo.name}
                      className="w-full h-full object-cover object-center"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>

              {/* Wordmark stacked beside avatar */}
              <a
                href="/"
                className="group inline-flex flex-col leading-tight w-fit"
              >
                <span className="font-mono font-black text-xl tracking-tight text-sky-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors duration-300">
                  shanjid
                  <span className="text-violet-500 dark:text-violet-400">.bd</span>
                </span>
                <span className="text-[11px] font-mono text-sky-500 dark:text-slate-500 tracking-wide">
                  {personalInfo.role ?? "Software Engineer"}
                </span>
              </a>
            </div>

            {/* Short bio */}
            <p className="text-sm leading-relaxed text-sky-700 dark:text-slate-400 max-w-[220px]">
              {personalInfo.shortBio}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-1">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group/icon p-2 rounded-lg bg-white/50 dark:bg-white/5 border border-sky-200/70 dark:border-white/10 hover:border-violet-400/60 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all duration-200"
              >
                <FaGithub size={16} className="text-sky-700 dark:text-slate-400 group-hover/icon:text-violet-600 dark:group-hover/icon:text-violet-400 transition-colors" />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group/icon p-2 rounded-lg bg-white/50 dark:bg-white/5 border border-sky-200/70 dark:border-white/10 hover:border-violet-400/60 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all duration-200"
              >
                <FaLinkedin size={16} className="text-sky-700 dark:text-slate-400 group-hover/icon:text-violet-600 dark:group-hover/icon:text-violet-400 transition-colors" />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                aria-label="Email"
                className="group/icon p-2 rounded-lg bg-white/50 dark:bg-white/5 border border-sky-200/70 dark:border-white/10 hover:border-violet-400/60 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all duration-200"
              >
                <Mail size={16} className="text-sky-700 dark:text-slate-400 group-hover/icon:text-violet-600 dark:group-hover/icon:text-violet-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* ── COL 2: Site Navigation ── */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-sky-500 dark:text-slate-500 mb-4">
              Navigation
            </p>
            <ul className="flex flex-col gap-2.5">
              {navItems.slice(0, 6).map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group/link flex items-center gap-2 text-sm text-sky-800 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 transition-colors duration-200"
                  >
                    {/* Animated leading dash */}
                    <span className="block h-px bg-violet-400 transition-all duration-300 w-3 group-hover/link:w-5 opacity-0 group-hover/link:opacity-100" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 3: Important Links ── */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-sky-500 dark:text-slate-500 mb-4">
              Quick Access
            </p>
            <ul className="flex flex-col gap-3">

              {/* Blog */}
              <li>
                <Link
                  href="/blog"
                  onMouseEnter={() => blogIconRef.current?.startAnimation()}
                  onMouseLeave={() => blogIconRef.current?.stopAnimation()}
                  className="group/ql flex items-center gap-3 p-2.5 rounded-lg bg-white/40 dark:bg-white/[0.04] border border-sky-200/60 dark:border-white/[0.07] hover:border-violet-400/50 dark:hover:border-violet-500/40 hover:bg-white/70 dark:hover:bg-violet-500/10 transition-all duration-200"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-md bg-violet-100 dark:bg-violet-500/15 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center group-hover/ql:bg-violet-200 dark:group-hover/ql:bg-violet-500/25 transition-colors">
                    <ScanTextIcon ref={blogIconRef} size={13} className="text-violet-600 dark:text-violet-400" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-sky-900 dark:text-slate-200 group-hover/ql:text-violet-600 dark:group-hover/ql:text-violet-300 transition-colors leading-tight">
                      Blog
                    </p>
                    <p className="text-[11px] text-sky-500 dark:text-slate-500 font-mono">
                      Articles &amp; deep dives
                    </p>
                  </div>
                </Link>
              </li>

              {/* Resume Download */}
              <li>
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/ql flex items-center gap-3 p-2.5 rounded-lg bg-white/40 dark:bg-white/[0.04] border border-sky-200/60 dark:border-white/[0.07] hover:border-violet-400/50 dark:hover:border-violet-500/40 hover:bg-white/70 dark:hover:bg-violet-500/10 transition-all duration-200"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-md bg-sky-100 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-500/20 flex items-center justify-center group-hover/ql:bg-sky-200 dark:group-hover/ql:bg-sky-500/25 transition-colors">
                    <FileDown size={13} className="text-sky-600 dark:text-sky-400" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-sky-900 dark:text-slate-200 group-hover/ql:text-violet-600 dark:group-hover/ql:text-violet-300 transition-colors leading-tight">
                      Resume
                    </p>
                    <p className="text-[11px] text-sky-500 dark:text-slate-500 font-mono">
                      Download PDF
                    </p>
                  </div>
                </a>
              </li>

              {/* Portfolio / Website */}
              <li>
                <a
                  href="https://draw.shanjid.bd"
                  onMouseEnter={() => amateurdrawIconRef.current?.startAnimation()}
                  onMouseLeave={() => amateurdrawIconRef.current?.stopAnimation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/ql flex items-center gap-3 p-2.5 rounded-lg bg-white/40 dark:bg-white/[0.04] border border-sky-200/60 dark:border-white/[0.07] hover:border-violet-400/50 dark:hover:border-violet-500/40 hover:bg-white/70 dark:hover:bg-violet-500/10 transition-all duration-200"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-md bg-teal-100 dark:bg-teal-500/15 border border-teal-200 dark:border-teal-500/20 flex items-center justify-center group-hover/ql:bg-teal-200 dark:group-hover/ql:bg-teal-500/25 transition-colors">
                    <PenToolIcon ref={amateurdrawIconRef} size={13} className="text-teal-600 dark:text-teal-400" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-sky-900 dark:text-slate-200 group-hover/ql:text-violet-600 dark:group-hover/ql:text-violet-300 transition-colors leading-tight">
                      Amateur Draw
                    </p>
                    <p className="text-[11px] text-sky-500 dark:text-slate-500 font-mono">
                      draw.shanjid.bd
                    </p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="relative border-t border-sky-200/60 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[11px] text-sky-500 dark:text-slate-600">
            © {year} MD. SHANJID AREFIN. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-sky-400 dark:text-slate-700 flex items-center gap-1.5">
            <span className="text-violet-400 dark:text-violet-600">▸</span>
            <a
              href="https://www.shanjid.bd"
              className="hover:text-violet-500 dark:hover:text-violet-500 transition-colors"
            >
              www.shanjid.bd
            </a>
            <span className="opacity-40">·</span>
            <span>Crafted with intent &amp; caffeine</span>
            <span
              className="text-violet-400 dark:text-violet-600"
              style={{ opacity: cursor ? 1 : 0, transition: "opacity 0.1s" }}
            >_</span>
          </p>
        </div>
      </div>

      {/* ── Keyframes injected as a style tag ── */}
      <style>{`
        @keyframes footerFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes footerBlob1 {
          0%   { transform: translate(0px,   0px)   scale(1); }
          100% { transform: translate(60px,  40px)  scale(1.15); }
        }
        @keyframes footerBlob2 {
          0%   { transform: translate(0px,   0px)   scale(1.1); }
          100% { transform: translate(-50px, 30px)  scale(0.95); }
        }
        @keyframes footerBlob3 {
          0%   { transform: translate(0px,   0px)   scale(1); }
          100% { transform: translate(-40px, -50px) scale(1.2); }
        }
        @keyframes footerBlob4 {
          0%   { transform: translate(0px,   0px)   scale(0.95); }
          100% { transform: translate(50px,  -30px) scale(1.1); }
        }
      `}</style>
    </footer>
  );
}