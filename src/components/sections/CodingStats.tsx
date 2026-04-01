"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { codingProfiles, manualCodingStats } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { useCountUp } from "@/lib/useCountUp";
import { ExternalLink, Code2, Trophy, Star, Award } from "lucide-react";
import { SiLeetcode, SiHackerrank, SiCodeforces } from "react-icons/si";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────
interface LeetCodeStats {
  solved:   number;
  easy:     number;
  medium:   number;
  hard:     number;
  ranking:  number;
}

// ── Animated number component ────────────────────────────────────────────────
// Reusable: pass any number and it counts up when "start" is true
function AnimatedNumber({
  value,
  start,
  suffix = "",
  className = "",
}: {
  value:     number;
  start:     boolean;
  suffix?:   string;
  className?: string;
}) {
  const count = useCountUp({ target: value, duration: 1500, start });
  return (
    <span className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ── LeetCode difficulty bar ──────────────────────────────────────────────────
function DifficultyBar({
  label,
  count,
  total,
  color,
  start,
}: {
  label:  string;
  count:  number;
  total:  number;
  color:  string;
  start:  boolean;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className={cn("text-xs font-mono", color)}>{label}</span>
        <span className="text-zinc-500 text-xs font-mono">{count}</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: start ? `${percentage}%` : "0%" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className={cn("h-full rounded-full", color.replace("text-", "bg-"))}
        />
      </div>
    </div>
  );
}

// ── LeetCode Card ─────────────────────────────────────────────────────────────
function LeetCodeCard() {
  const [stats, setStats]   = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);
  const [inView, setInView] = useState(false);
  const ref                 = useRef<HTMLDivElement>(null);

  // Fetch stats from our API route
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res  = await fetch(`/api/leetcode?username=${codingProfiles.leetcode}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setStats(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // IntersectionObserver — start animation when card scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <SiLeetcode size={20} className="text-yellow-500" />
          </div>
          <div>
            <h3 className="text-zinc-100 font-semibold">LeetCode</h3>
            <p className="text-zinc-500 text-xs font-mono">@{codingProfiles.leetcode}</p>
          </div>
        </div>
        <a href={`https://leetcode.com/${codingProfiles.leetcode}`}
          target="_blank" rel="noopener noreferrer"
          className="text-zinc-600 hover:text-yellow-500 transition-colors">
          <ExternalLink size={15} />
        </a>
      </div>

      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-12 bg-zinc-800 rounded-lg" />
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
          <div className="h-4 bg-zinc-800 rounded w-1/2" />
        </div>
      )}

      {error && (
        <p className="text-zinc-500 text-sm text-center py-4">
          Could not load stats. Check your username in data/index.ts
        </p>
      )}

      {stats && !loading && (
        <>
          {/* Big solved number */}
          <div className="text-center mb-6 p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/30">
            <AnimatedNumber
              value={stats.solved}
              start={inView}
              className="text-4xl font-bold text-yellow-400 font-mono"
            />
            <p className="text-zinc-500 text-sm mt-1">Problems Solved</p>
          </div>

          {/* Difficulty breakdown */}
          <div className="space-y-3 mb-5">
            <DifficultyBar label="Easy"   count={stats.easy}   total={stats.solved} color="text-emerald-400" start={inView} />
            <DifficultyBar label="Medium" count={stats.medium} total={stats.solved} color="text-yellow-400"  start={inView} />
            <DifficultyBar label="Hard"   count={stats.hard}   total={stats.solved} color="text-red-400"     start={inView} />
          </div>

          {/* Ranking */}
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-zinc-800/50">
            <Trophy size={14} className="text-yellow-500" />
            <span className="text-zinc-400 text-sm">
              Global Rank:{" "}
              <AnimatedNumber
                value={stats.ranking}
                start={inView}
                className="text-zinc-200 font-mono font-semibold"
              />
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
}

// ── HackerRank Card ───────────────────────────────────────────────────────────
function HackerRankCard() {
  const [inView, setInView] = useState(false);
  const ref                 = useRef<HTMLDivElement>(null);
  const stats               = manualCodingStats.hackerrank;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <SiHackerrank size={20} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="text-zinc-100 font-semibold">HackerRank</h3>
            <p className="text-zinc-500 text-xs font-mono">@{codingProfiles.hackerrank}</p>
          </div>
        </div>
        <a href={`https://hackerrank.com/${codingProfiles.hackerrank}`}
          target="_blank" rel="noopener noreferrer"
          className="text-zinc-600 hover:text-emerald-500 transition-colors">
          <ExternalLink size={15} />
        </a>
      </div>

      {/* Big solved number */}
      <div className="text-center mb-6 p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/30">
        <AnimatedNumber
          value={stats.solved}
          start={inView}
          className="text-4xl font-bold text-emerald-400 font-mono"
        />
        <p className="text-zinc-500 text-sm mt-1">Problems Solved</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { icon: <Star size={14} />,  label: "Stars",       value: stats.stars,   color: "text-yellow-400"  },
          { icon: <Award size={14} />, label: "Badges",      value: stats.badges,  color: "text-emerald-400" },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="flex flex-col items-center p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/30">
            <span className={cn("mb-1", color)}>{icon}</span>
            <span className={cn("text-lg font-bold font-mono", color)}>{value}</span>
            <span className="text-zinc-500 text-xs">{label}</span>
          </div>
        ))}
      </div>

      {/* Certificate */}
      <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/50">
        <Award size={14} className="text-emerald-500 shrink-0" />
        <span className="text-zinc-400 text-xs">{stats.certificate}</span>
      </div>
    </motion.div>
  );
}

// ── Codeforces Card ───────────────────────────────────────────────────────────
function CodeforcesCard() {
  const [inView, setInView] = useState(false);
  const ref                 = useRef<HTMLDivElement>(null);
  const stats               = manualCodingStats.codeforces;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <SiCodeforces size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-zinc-100 font-semibold">Codeforces</h3>
            <p className="text-zinc-500 text-xs font-mono">@{codingProfiles.codeforces}</p>
          </div>
        </div>
        <a href={`https://codeforces.com/profile/${codingProfiles.codeforces}`}
          target="_blank" rel="noopener noreferrer"
          className="text-zinc-600 hover:text-blue-500 transition-colors">
          <ExternalLink size={15} />
        </a>
      </div>

      {/* Big solved number */}
      <div className="text-center mb-6 p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/30">
        <AnimatedNumber
          value={stats.solved}
          start={inView}
          className="text-4xl font-bold text-blue-400 font-mono"
        />
        <p className="text-zinc-500 text-sm mt-1">Problems Solved</p>
      </div>

      {/* Rating + Rank */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex flex-col items-center p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/30">
          <Code2 size={14} className="text-blue-400 mb-1" />
          <AnimatedNumber
            value={stats.rating}
            start={inView}
            className="text-lg font-bold font-mono text-blue-400"
          />
          <span className="text-zinc-500 text-xs">Rating</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/30">
          <Trophy size={14} className="text-blue-400 mb-1" />
          <span className="text-lg font-bold font-mono text-blue-400">{stats.rank}</span>
          <span className="text-zinc-500 text-xs">Rank</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function CodingStats() {
  const [inView, setInView] = useState(false);
  const ref                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Summary totals — update these to match your real combined total
  const totalSolved = (
    manualCodingStats.hackerrank.solved +
    manualCodingStats.codeforces.solved
  );

  return (
    <section id="coding" className="py-24 px-4 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Coding"
          subtitle="Competitive programming and problem solving across platforms."
        />

        {/* ── Summary Strip ── */}
        <motion.div ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Platforms",          value: 3,            suffix: "",   color: "text-violet-400" },
            { label: "HackerRank Solved",  value: manualCodingStats.hackerrank.solved, suffix: "+", color: "text-emerald-400" },
            { label: "Codeforces Solved",  value: manualCodingStats.codeforces.solved, suffix: "+", color: "text-blue-400"    },
            { label: "Total (excl. LC)",   value: totalSolved,  suffix: "+",  color: "text-yellow-400" },
          ].map(({ label, value, suffix, color }) => (
            <div key={label} className="text-center p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <AnimatedNumber
                value={value}
                start={inView}
                suffix={suffix}
                className={cn("text-3xl font-bold font-mono", color)}
              />
              <p className="text-zinc-500 text-xs mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Platform Cards ── */}
        <div className="grid md:grid-cols-3 gap-6">
          <LeetCodeCard />
          <HackerRankCard />
          <CodeforcesCard />
        </div>
      </div>
    </section>
  );
}