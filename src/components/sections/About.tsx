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
          title="About Me"
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
            <p className="text-zinc-700 text-sky-800 dark:text-zinc-300 text-lg leading-relaxed mb-6">
              {personalInfo.aboutBio}
            </p>

            {/* Quote box */}
            <div className="relative mb-8">
              <div className="backdrop-blur-xl bg-white/10 dark:bg-blue-900/30 border border-white/20 dark:border-zinc-800/50 rounded-2xl p-6 shadow-lg">
                
                {/* Big quote mark */}
                <span className="absolute -top-4 -left-2 text-6xl text-violet-500/30 font-serif select-none">
                  “
                </span>

                <p className="text-sky-700 dark:text-zinc-300 italic leading-relaxed">
                  When I&apos;m not engineering software, I enjoy exploring new technologies,
                  contributing to open source, and writing about what I learn.
                </p>

                {/* Closing quote */}
                <div className="flex justify-end mt-4">
                  <span className="text-2xl text-violet-500/40 font-serif">”</span>
                </div>
              </div>
            </div>

            {/* Quick stat pills */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-zinc-900/50 border border-sky-200 dark:border-zinc-800/50">
                  <span className="text-violet-400 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-sky-500 dark:text-zinc-500 text-xs">{label}</p>
                    <p className="text-sky-900 dark:text-zinc-200 text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Photo placeholder (replace with your actual photo later) */}
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
              <div className="relative w-72 h-72 mx-auto">
                <div className="absolute -inset-1 blur-xl" />
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src="/profile.png"
                    alt={personalInfo.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}