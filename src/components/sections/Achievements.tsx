"use client";

import { motion } from "framer-motion";
import { achievements } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { ExternalLink, Award, BadgeCheck, Star, Calendar } from "lucide-react";
import { SiHackerrank, SiIeee } from "react-icons/si";
import { cn } from "@/lib/utils";

// ── Maps issuer name to icon + color ─────────────────────────────────────────
function IssuerBadge({ issuer }: { issuer: string }) {
  if (issuer.toLowerCase().includes("hackerrank")) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <SiHackerrank size={12} className="text-emerald-400" />
        <span className="text-emerald-400 text-xs font-mono">HackerRank</span>
      </div>
    );
  }
  if (issuer.toLowerCase().includes("ieee") || issuer.toLowerCase().includes("ncees")) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
        <SiIeee size={12} className="text-blue-400" />
        <span className="text-blue-400 text-xs font-mono">IEEE / NCEES</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
      <Award size={12} className="text-violet-400" />
      <span className="text-violet-400 text-xs font-mono">{issuer}</span>
    </div>
  );
}

// ── Featured Card (large — for FE Exam) ──────────────────────────────────────
function FeaturedAchievementCard({
  achievement,
  index,
}: {
  achievement: (typeof achievements)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900/50 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-start gap-6">

        {/* Icon */}
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <SiIeee size={28} className="text-blue-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <IssuerBadge issuer={achievement.issuer} />

            {/* "Featured" star badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-xs font-mono">Highlight</span>
            </div>
          </div>

          <h3 className="text-sky-950 dark:text-zinc-100 font-bold text-xl leading-snug mb-2">
            {achievement.title}
          </h3>

          <p className="text-sky-700 dark:text-zinc-400 text-sm leading-relaxed mb-4">
            {achievement.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {/* Date */}
            <span className="flex items-center gap-1.5 text-sky-500 dark:text-zinc-500 text-xs font-mono">
              <Calendar size={12} />
              {achievement.date}
            </span>

            {/* Credential link */}
            {achievement.credentialUrl ? (
              <a
                href={achievement.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 hover:text-blue-300 text-xs font-medium transition-all duration-200"
              >
                <BadgeCheck size={13} />
                View Credential
                <ExternalLink size={11} />
              </a>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-100 dark:bg-zinc-800/50 border border-zinc-700/30 text-sky-500 dark:text-zinc-500 text-xs font-mono">
                <BadgeCheck size={13} />
                Certificate Pending Collection
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Regular Card (compact — for HackerRank certs) ─────────────────────────────
function AchievementCard({
  achievement,
  index,
}: {
  achievement: (typeof achievements)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group p-5 rounded-xl bg-white dark:bg-zinc-900/50 border border-sky-200 dark:border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
    >
      <div className="flex items-start gap-4">

        {/* Icon */}
        <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <BadgeCheck size={18} className="text-emerald-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <IssuerBadge issuer={achievement.issuer} />
          </div>

          <h3 className="text-sky-950 dark:text-zinc-100 font-semibold text-base leading-snug mb-1.5 group-hover:text-emerald-300 transition-colors">
            {achievement.title}
          </h3>

          <p className="text-sky-500 dark:text-zinc-500 text-sm leading-relaxed mb-3">
            {achievement.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-sky-400 dark:text-zinc-600 text-xs font-mono">
              <Calendar size={11} />
              {achievement.date}
            </span>

            {achievement.credentialUrl && (
              <a
                href={achievement.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-500 hover:text-emerald-400 text-xs font-medium transition-colors"
              >
                View Certificate
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function Achievements() {
  const featured = achievements.filter((a) => a.highlight);
  const others   = achievements.filter((a) => !a.highlight);

  return (
    <section id="achievements" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Achievements"
          subtitle="Certifications and milestones I'm proud of."
        />

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            { value: achievements.length, label: "Total Achievements", color: "text-violet-400" },
            { value: featured.length,     label: "Major Certifications", color: "text-blue-400"   },
            { value: others.length,       label: "Platform Certificates", color: "text-emerald-400" },
          ].map(({ value, label, color }) => (
            <div key={label} className="text-center p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-sky-200 dark:border-zinc-800/50">
              <p className={cn("text-2xl font-bold font-mono mb-1", color)}>{value}</p>
              <p className="text-sky-500 dark:text-zinc-500 text-xs">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Featured achievements */}
        {featured.length > 0 && (
          <div className="mb-6 space-y-4">
            {featured.map((a, i) => (
              <FeaturedAchievementCard key={a.title} achievement={a} index={i} />
            ))}
          </div>
        )}

        {/* Other certifications */}
        {others.length > 0 && (
          <>
            <h3 className="text-sky-700 dark:text-zinc-400 text-sm font-mono uppercase tracking-widest mb-4 mt-8">
              Platform Certificates
            </h3>
            <div className="space-y-4">
              {others.map((a, i) => (
                <AchievementCard key={a.title} achievement={a} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}