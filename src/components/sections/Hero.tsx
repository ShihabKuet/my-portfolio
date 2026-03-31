"use client";

import { motion } from "framer-motion";
import { ArrowDown, MapPin, Briefcase, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { personalInfo } from "@/data";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center">

        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700/50 bg-zinc-900/50 text-zinc-400 text-sm mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Briefcase size={13} />
          <span>{personalInfo.role} @ {personalInfo.company}</span>
        </motion.div>

        <motion.h1 {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="text-5xl sm:text-6xl md:text-7xl font-bold text-zinc-100 leading-tight mb-4">
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {personalInfo.name}
          </span>
        </motion.h1>

        <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.35 }} className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          {personalInfo.bio}
        </motion.p>

        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.45 }} className="flex items-center justify-center gap-1.5 text-zinc-500 text-sm mb-10">
          <MapPin size={14} className="text-violet-400" />
          <span>{personalInfo.location}</span>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.55 }} className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <a href="#projects" className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5">
            View My Work
          </a>
          <a href="#contact" className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 font-medium rounded-lg transition-all duration-200 hover:bg-zinc-800/50 hover:-translate-y-0.5">
            Get In Touch
          </a>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.65 }} className="flex items-center justify-center gap-4">
          {[
            { href: personalInfo.github,   icon: <FaGithub size={20} />,   label: "GitHub"   },
            { href: personalInfo.linkedin, icon: <FaLinkedin size={20} />, label: "LinkedIn" },
            { href: `mailto:${personalInfo.email}`, icon: <Mail size={20} />, label: "Email" },
          ].map(({ href, icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="p-2.5 text-zinc-500 hover:text-violet-400 hover:bg-zinc-800 rounded-lg transition-all duration-200">
              {icon}
            </a>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 animate-bounce">
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
}