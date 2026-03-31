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
            <p className="text-zinc-300 text-lg leading-relaxed mb-6">
              {personalInfo.bio}
            </p>
            <p className="text-zinc-400 leading-relaxed mb-8">
              When I&apos;m not engineering software, I enjoy exploring new technologies,
              contributing to open source, and writing about what I learn.
            </p>

            {/* Quick stat pills */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                  <span className="text-violet-400 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-zinc-500 text-xs">{label}</p>
                    <p className="text-zinc-200 text-sm font-medium">{value}</p>
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
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 blur-xl" />

              {/* Photo — put your image at public/profile.jpg to activate */}
              <div className="relative w-full h-full rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center">
                <div className="text-center text-zinc-600">
                  <div className="w-20 h-20 rounded-full bg-zinc-800 mx-auto mb-3 flex items-center justify-center text-3xl">
                    👤
                  </div>
                  <p className="text-sm">Add profile.jpg to /public</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}