"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { MapPin, GraduationCap, Briefcase, Coffee } from "lucide-react";

const stats = [
  { icon: <Briefcase size={16} />, label: "Current Role", value: "R&D Engineer" },
  { icon: <GraduationCap size={16} />, label: "Graduated", value: "KUET, 2024" },
  { icon: <MapPin size={16} />, label: "Location", value: "Bangladesh" },
  { icon: <Coffee size={16} />, label: "Status", value: "Open to Opportunities" },
];

export default function About() {
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
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-violet-500/10 via-sky-500/5 to-blue-500/10 dark:from-violet-900/30 dark:via-blue-900/20 dark:to-zinc-900/30 border border-violet-300/30 dark:border-violet-700/30 rounded-2xl px-10 py-8 shadow-xl shadow-violet-500/10 overflow-hidden">

                {/* Glow blob */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-violet-400/20 dark:bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sky-400/20 dark:bg-sky-600/20 rounded-full blur-2xl pointer-events-none" />

                {/* Opening quote */}
                <span className="absolute top-2 left-3 text-7xl leading-none text-violet-400/40 dark:text-amber-300/80 font-serif select-none">
                  “
                </span>

                {/* If we the quote left aligned, just remove the class attribute - "text-center mx-auto max-w-md" */}
                <p className="relative text-sky-800 dark:text-zinc-200 text-[1.05rem] leading-relaxed tracking-wide text-center mx-auto max-w-md"
                  style={{ fontFamily: "'Georgia', 'Cambria', serif", fontStyle: "italic" }}>
                  {personalInfo.quote}
                </p>

                {/* Closing quote */}
                <span className="absolute bottom-2 right-3 text-7xl leading-none text-violet-400/40 dark:text-amber-300/80 font-serif select-none">
                  ”
                </span>

                {/* Bottom accent line */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
                  <span className="text-xs font-mono text-violet-400/60 tracking-widest uppercase">personal note</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
                </div>

              </div>
            </div>

            {/* Quick stat pills */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-zinc-900/50 border border-sky-200 dark:border-zinc-800/50 hover:bg-amber-50 dark:hover:bg-blue-400/30 transition">
                  <span className="text-violet-400 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-sky-500 dark:text-zinc-500 text-xs">{label}</p>
                    <p className="text-sky-900 dark:text-zinc-200 text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
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
            <div className="relative w-72 h-72">
              {/* Decorative ring */}
              <div className="absolute inset-0" />
              <div className="absolute -inset-1 blur-xl" />

              {/* Photo — put your image at public/profile.jpg to activate */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/profile.png"
                  alt={personalInfo.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                {/* Fallback avatar - if profile pic is unavailable / network load issue */}
                <div
                  style={{ display: "none" }}
                  className="absolute inset-0 flex-col items-center justify-center bg-gradient-to-br from-violet-900/60 to-sky-900/60 dark:from-amber-100/20 dark:to-amber-600 backdrop-blur-sm"
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