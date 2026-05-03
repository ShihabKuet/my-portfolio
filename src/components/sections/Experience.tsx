"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { experiences } from "@/data";
import { WorkAchievement } from "@/types"
import SectionHeading from "@/components/ui/SectionHeading";
import {
  Zap, Link2, ShieldCheck, Layers, TrendingUp, Users,
  MapPin, Calendar, ExternalLink, ChevronDown, ChevronUp,
  Terminal, Cpu, Activity,
} from "lucide-react";

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG = {
  Performance: {
    icon: Zap,
    glow: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.45)",
    badgeClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
    textClass: "text-emerald-700 dark:text-emerald-400",
    metricClass: "text-emerald-700 dark:text-emerald-400",
    bar: "bg-emerald-500",
    dot: "bg-emerald-600 dark:bg-emerald-400",
  },
  Protocol: {
    icon: Link2,
    glow: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.45)",
    badgeClass: "bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-400",
    textClass: "text-cyan-700 dark:text-cyan-400",
    metricClass: "text-cyan-700 dark:text-cyan-400",
    bar: "bg-cyan-500",
    dot: "bg-cyan-600 dark:bg-cyan-400",
  },
  Standards: {
    icon: ShieldCheck,
    glow: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.45)",
    badgeClass: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
    textClass: "text-amber-700 dark:text-amber-400",
    metricClass: "text-amber-700 dark:text-amber-400",
    bar: "bg-amber-500",
    dot: "bg-amber-600 dark:bg-amber-400",
  },
  "Cross-Platform": {
    icon: Layers,
    glow: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.45)",
    badgeClass: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
    textClass: "text-blue-700 dark:text-blue-400",
    metricClass: "text-blue-700 dark:text-blue-400",
    bar: "bg-blue-500",
    dot: "bg-blue-600 dark:bg-blue-400",
  },
  Scalability: {
    icon: TrendingUp,
    glow: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.45)",
    badgeClass: "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400",
    textClass: "text-orange-700 dark:text-orange-400",
    metricClass: "text-orange-700 dark:text-orange-400",
    bar: "bg-orange-500",
    dot: "bg-orange-600 dark:bg-orange-400",
  },
  Leadership: {
    icon: Users,
    glow: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.45)",
    badgeClass: "bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-400",
    textClass: "text-violet-700 dark:text-violet-400",
    metricClass: "text-violet-700 dark:text-violet-400",
    bar: "bg-violet-500",
    dot: "bg-violet-600 dark:bg-violet-400",
  },
} as const;

// ─── Metric Badge ─────────────────────────────────────────────────────────────

function MetricBadge({
  value, label, suffix, metricClass,
}: {
  value: string; label: string; suffix?: string; metricClass: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg
      bg-slate-100 dark:bg-zinc-950/60
      border border-slate-200 dark:border-zinc-800/60
      min-w-[72px]">
      <span className={`text-lg font-black font-mono tracking-tight leading-none ${metricClass}`}>
        {value}
      </span>
      {suffix && (
        <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
          {suffix}
        </span>
      )}
      <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-600 text-center leading-tight mt-0.5">
        {label}
      </span>
    </div>
  );
}

// ─── Achievement Card ─────────────────────────────────────────────────────────

function AchievementCard({ ach, index }: { ach: WorkAchievement; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = CATEGORY_CONFIG[ach.category];
  const Icon = cfg.icon;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      {/* Ambient glow — subtle in light, richer in dark */}
      <div
        className="absolute inset-0 rounded-xl opacity-0
          group-hover:opacity-40 dark:group-hover:opacity-100
          transition-opacity duration-500 blur-xl pointer-events-none"
        style={{ background: cfg.glow }}
      />

      {/* Card shell */}
      <div
        className={`relative rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300
          bg-white dark:bg-zinc-950/80
          ${expanded
            ? "shadow-md dark:shadow-none"
            : "border border-slate-200 dark:border-zinc-700/60 hover:border-slate-300 dark:hover:border-zinc-600/70"
          }`}
        style={expanded ? {
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: cfg.border,
          boxShadow: `0 0 0 1px ${cfg.border}, 0 8px 32px ${cfg.glow}`,
        } : undefined}
      >
        {/* Colored top bar */}
        <div className={`h-0.5 w-full ${cfg.bar} opacity-50 group-hover:opacity-90 transition-opacity`} />

        {/* Scan line — dark mode only */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl
          opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute inset-x-0 h-px opacity-20 group-hover:animate-[scanline_3s_linear_infinite]"
            style={{ background: `linear-gradient(90deg, transparent, ${cfg.glow.replace("0.12", "0.7")}, transparent)` }}
          />
        </div>

        <div className="p-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border"
                style={{ background: cfg.glow, borderColor: cfg.border }}
              >
                <Icon size={16} className={cfg.textClass} />
              </div>
              <div>
                <p className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-1 ${cfg.textClass}`}>
                  {ach.subtitle}
                </p>
                <h4 className="text-sm font-semibold leading-snug text-slate-800 dark:text-zinc-100">
                  {ach.title}
                </h4>
              </div>
            </div>
            <span className="text-[10px] font-mono shrink-0 mt-1 text-slate-400 dark:text-zinc-600">
              {ach.id}
            </span>
          </div>

          {/* Metrics */}
          {ach.metrics && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {ach.metrics.map((m) => (
                <MetricBadge
                  key={m.label}
                  value={m.value}
                  label={m.label}
                  suffix={m.suffix}
                  metricClass={cfg.metricClass}
                />
              ))}
            </div>
          )}

          {/* Expandable points */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="points"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mb-4 space-y-2.5">
                  {ach.points.map((pt, j) => (
                    <div key={j} className="flex gap-2.5 items-start">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400">{pt}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer: tech tags + toggle */}
          <div className="flex items-center justify-between gap-2 pt-3
            border-t border-slate-100 dark:border-zinc-800/60">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {ach.technologies.slice(0, expanded ? undefined : 3).map((t) => (
                <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${cfg.badgeClass}`}>
                  {t}
                </span>
              ))}
              {!expanded && ach.technologies.length > 3 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono
                  border border-slate-200 dark:border-zinc-700/50
                  text-slate-400 dark:text-zinc-500">
                  +{ach.technologies.length - 3}
                </span>
              )}
            </div>

            <button
              onClick={() => setExpanded((v) => !v)}
              className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md
                text-[10px] font-mono border transition-all duration-200
                ${expanded
                  ? `border-slate-200 dark:border-zinc-700
                     text-slate-400 dark:text-zinc-500
                     hover:border-slate-300 dark:hover:border-zinc-500
                     hover:text-slate-600 dark:hover:text-zinc-300`
                  : `${cfg.badgeClass} hover:opacity-75`
                }`}
              style={!expanded ? { borderColor: cfg.border } : undefined}
            >
              {expanded
                ? <><ChevronUp size={10} /> collapse</>
                : <><ChevronDown size={10} /> details</>
              }
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function Experience() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  useEffect(() => {
    if (headerInView) setHeaderVisible(true);
  }, [headerInView]);

  return (
    <section
      id="experience"
      className="relative py-28 px-4 overflow-hidden
        bg-sky-50/40 dark:bg-[#050508]"
    >
      {/* Subtle grid + violet radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(139,92,246,0.05) 0%, transparent 70%),
            linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeading
          title="Work Experience"
          subtitle="Engineering missions, delivered."
        />

        {experiences.map((exp, expIdx) => (
          <div key={expIdx} className="mt-16">

            {/* ── Personnel File Header ── */}
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, y: -16 }}
              animate={headerVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-10 rounded-2xl overflow-hidden backdrop-blur-md
                bg-white dark:bg-zinc-950/90
                border border-violet-200 dark:border-violet-500/20
                shadow-sm shadow-violet-100 dark:shadow-none"
            >
              {/* Top accent line */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-400 dark:via-violet-500 to-transparent opacity-60" />

              {/* Chrome toolbar */}
              <div className="flex items-center justify-between px-5 py-2.5
                border-b border-slate-100 dark:border-zinc-800/60
                bg-slate-50/80 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-violet-500 dark:text-violet-400" />
                  <span className="text-[10px] font-mono tracking-widest uppercase
                    text-violet-600 dark:text-violet-400">
                    PERSONNEL_FILE · {`EMP-${String(expIdx + 1).padStart(3, "0")}`}
                  </span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-mono
                  text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  ACTIVE DEPLOYMENT
                </span>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">

                  {/* Left: role + company + summary */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu size={14} className="text-violet-500 dark:text-violet-400" />
                      <p className="text-[10px] font-mono tracking-[0.2em] uppercase
                        text-violet-600 dark:text-violet-400">
                        Designation
                      </p>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2
                      text-slate-900 dark:text-zinc-100">
                      {exp.role}
                    </h2>

                    {exp.link ? (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-sm transition-colors group/link
                          text-violet-600 dark:text-violet-400
                          hover:text-violet-500 dark:hover:text-violet-300"
                      >
                        <span className="transition-colors
                          text-violet-400 dark:text-violet-600
                          group-hover/link:text-violet-500 dark:group-hover/link:text-violet-400">⌁</span>
                        {exp.company}
                        <ExternalLink size={11} className="opacity-50 group-hover/link:opacity-100" />
                      </a>
                    ) : (
                      <p className="font-mono text-sm text-violet-600 dark:text-violet-400">⌁ {exp.company}</p>
                    )}

                    <div className="mt-5 space-y-2">
                      {exp.summary.map((s, i) => (
                        <div key={i} className="flex gap-2.5 items-start">
                          <Activity size={10} className="mt-1 shrink-0
                            text-violet-400 dark:text-violet-500/60" />
                          <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-500">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: meta chips + mission count */}
                  <div className="flex flex-col gap-3 sm:items-end">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg
                      bg-slate-50 dark:bg-zinc-900
                      border border-slate-200 dark:border-zinc-800">
                      <Calendar size={12} className="text-slate-400 dark:text-zinc-500" />
                      <span className="text-xs font-mono text-slate-700 dark:text-zinc-300">
                        {exp.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg
                      bg-slate-50 dark:bg-zinc-900
                      border border-slate-200 dark:border-zinc-800">
                      <MapPin size={12} className="text-slate-400 dark:text-zinc-500" />
                      <span className="text-xs font-mono text-slate-700 dark:text-zinc-300">
                        {exp.location}
                      </span>
                    </div>

                    <div className="mt-2 px-4 py-3 rounded-xl text-center
                      bg-violet-50 dark:bg-violet-500/10
                      border border-violet-200 dark:border-violet-500/20">
                      <p className="text-3xl font-black font-mono leading-none
                        text-violet-600 dark:text-violet-400">
                        {exp.achievements.length}
                      </p>
                      <p className="text-[10px] font-mono uppercase tracking-widest mt-1
                        text-violet-500 dark:text-violet-600">
                        Missions
                      </p>
                    </div>
                  </div>

                </div>

                {/* Full tech stack */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800/60">
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase mb-3
                    text-slate-400 dark:text-zinc-600">
                    Full Stack ·
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-[11px] font-mono cursor-default
                        transition-colors
                        bg-slate-50 dark:bg-zinc-900
                        border border-slate-200 dark:border-zinc-800
                        text-slate-600 dark:text-zinc-400
                        hover:border-violet-300 dark:hover:border-violet-500/40
                        hover:text-violet-600 dark:hover:text-violet-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-300 dark:via-violet-500/30 to-transparent" />
            </motion.div>

            {/* ── Divider label ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={headerVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-violet-300/60 dark:from-violet-500/20 to-transparent" />
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase
                text-slate-400 dark:text-zinc-600">
                Mission Logs · {exp.achievements.length} entries
              </p>
              <div className="h-px flex-1 bg-gradient-to-l from-violet-300/60 dark:from-violet-500/20 to-transparent" />
            </motion.div>

            {/* ── Achievement Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {exp.achievements.map((ach, i) => (
                <AchievementCard key={ach.id} ach={ach} index={i} />
              ))}
            </div>

          </div>
        ))}

        {/* ── EOF marker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-14 flex items-center gap-3 pl-2"
        >
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full
                border border-slate-300 dark:border-zinc-700
                bg-slate-200 dark:bg-zinc-800" />
            ))}
          </div>
          <p className="text-[10px] font-mono tracking-widest
            text-slate-400 dark:text-zinc-700">
            END_OF_RECORDS · null route · {new Date().getFullYear()}
          </p>
        </motion.div>

      </div>

      <style>{`
        @keyframes scanline {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
      `}</style>
    </section>
  );
}