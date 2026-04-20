"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo } from "@/data";
import { ArrowDown, MapPin, Mail, Briefcase, SkipForward, Download, ExternalLink } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiResearchgate, SiMedium } from "react-icons/si";
import { Globe } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "segfault"
  | "typing-nano"
  | "editor"
  | "fixing"
  | "saving"
  | "compiling"
  | "output"
  | "done";

// ─── Terminal Content Constants ────────────────────────────────────────────────────────────────

const NANO_CMD    = "nano shanjid_arefin.c";
const COMPILE_CMD = "gcc shanjid_arefin.c -o shanjid_arefin && ./shanjid_arefin";

const BUGGY_LINE  = 'Engineer *dev = NULL;';
const FIXED_LINE  = 'Engineer *dev = &profile;';

const OUTPUT_LINES = [
  { text: "[SYS]   Boot sequence initialized...",               color: "#6b7280", delay: 0   },
  { text: "[ID]    MD. Shanjid Arefin — engineer loaded",       color: "#a78bfa", delay: 440 },
  { text: "[ROLE]  R&D Engineer · Shanghai BDCOM",              color: "#4ade80", delay: 300 },
  { text: "[STACK] C · Embedded Linux · Network Protocols",     color: "#4ade80", delay: 280 },
  { text: "[PUB]   IEEE Research · RFC 1350 Implementor",       color: "#4ade80", delay: 320 },
  { text: "[EDU]   B.Sc CSE · KUET 2024",                      color: "#4ade80", delay: 260 },
  { text: "[READY] Operational. Let's build something great ∞", color: "#22d3ee", delay: 640 },
];

// ─── Social links ─────────────────────────────────────────────────────────────

const SOCIALS = [
  { href: personalInfo.github,            icon: <FaGithub size={16} />,       label: "GitHub"       },
  { href: personalInfo.linkedin,          icon: <FaLinkedin size={16} />,     label: "LinkedIn"     },
  { href: personalInfo.researchgate,      icon: <SiResearchgate size={16} />, label: "ResearchGate" },
  { href: personalInfo.medium,            icon: <SiMedium size={16} />,       label: "Medium"       },
  { href: personalInfo.blog,              icon: <Globe size={16} />,          label: "Blog"         },
  { href: `mailto:${personalInfo.email}`, icon: <Mail size={16} />,           label: "Email"        },
];

// ─── Roles that cycle in the badge ────────────────────────────────────────────

const ROLES = [
  `R&D Engineer @ ${personalInfo.company}`,
  "Network Systems Developer",
  "IEEE Researcher",
  "Embedded Linux Engineer",
];

// ─── Scramble Text Hook ───────────────────────────────────────────────────────
// Letters randomise then resolve to the real characters — no cursor needed.

const SCRAMBLE_POOL = "!<>-_\\/[]{}=+*^?#01ABCXYZ░▒▓";

function useScramble(target: string, startDelay = 0) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let frameTimer: ReturnType<typeof setTimeout>;
    let iteration = 0;

    const startTimer = setTimeout(() => {
      const tick = () => {
        setDisplay(
          target
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (i < Math.floor(iteration)) return target[i];
              return SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
            })
            .join("")
        );
        if (iteration < target.length + 5) {
          iteration += 0.5;
          frameTimer = setTimeout(tick, 38);
        } else {
          setDisplay(target);
        }
      };
      tick();
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(frameTimer);
    };
  }, [target, startDelay]);

  return display;
}

// ─── Count-Up Hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, delay = 0, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // cubic ease-out
        setValue(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay, duration]);
  return value;
}

// ─── Stat Item ────────────────────────────────────────────────────────────────

function StatItem({
  to, suffix, label, delay,
}: { to: number; suffix: string; label: string; delay: number }) {
  const count = useCountUp(to, delay);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 + 0.1, duration: 0.45 }}
      className="flex flex-col gap-0.5"
    >
      <span
        className="text-2xl font-black leading-none tabular-nums"
        style={{
          fontFamily: "'JetBrains Mono','Fira Code',monospace",
          background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {count}{suffix}
      </span>
      <span className="text-[11px] font-semibold tracking-widest uppercase text-sky-500/60 dark:text-zinc-600">
        {label}
      </span>
    </motion.div>
  );
}

// ─── LeftContent ──────────────────────────────────────────────────────────────
// Defined outside Hero so React never remounts it on phase change.

interface LeftContentProps { centered: boolean }

function LeftContent({ centered }: LeftContentProps) {
  const align = centered ? "items-center text-center" : "items-start text-left";
  const wrap  = centered ? "justify-center" : "";

  const [roleIndex, setRoleIndex] = useState(0);
  const scrambled = useScramble(personalInfo.name, 300);

  // Cycle roles every 3.2 s
  useEffect(() => {
    const id = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`flex flex-col ${align}`}>

      {/* ── Cycling role badge ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="inline-flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full border border-sky-200 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm mb-6 overflow-hidden"
        style={{ height: 34 }}
      >
        <motion.span
          className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <Briefcase size={12} className="text-sky-500 dark:text-zinc-500 flex-shrink-0" />
        {/* Sliding text slot */}
        <div className="relative overflow-hidden" style={{ width: 220, height: 20 }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ y: 22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -22, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="absolute inset-0 text-sm font-medium text-sky-700 dark:text-zinc-400 whitespace-nowrap"
            >
              {ROLES[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Terminal-style greeting ── */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className="flex items-center gap-2 mb-2"
      >
        <span
          className="text-xs font-mono tracking-widest uppercase"
          style={{ color: "#7c3aed", opacity: 0.7 }}
        >
          &gt;&gt;
        </span>
        <span className="text-xs font-mono tracking-[0.2em] uppercase text-sky-500/50 dark:text-zinc-600">
          Hello, World!
        </span>
        {/* Tiny animated signal bars instead of cursor */}
        <span className="flex items-end gap-[2px] h-3 ml-1">
          {[0.4, 0.65, 0.85, 1].map((h, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-sm bg-violet-500"
              style={{ height: `${h * 100}%` }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </span>
      </motion.div>

      {/* ── Name with scramble + shifting gradient ── */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="text-4xl sm:text-5xl xl:text-6xl font-black leading-tight mb-4"
      >
        <span className="text-sky-950 dark:text-zinc-100">I&apos;m{" "}</span>
        <motion.span
          animate={{ backgroundPosition: ["0% center", "200% center", "0% center"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{
            fontFamily: "'JetBrains Mono','Fira Code',monospace",
            background:
              "linear-gradient(90deg, #7c3aed 0%, #a855f7 25%, #06b6d4 50%, #4ade80 70%, #7c3aed 100%)",
            backgroundSize: "250% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
          }}
        >
          {scrambled || personalInfo.name}
        </motion.span>
      </motion.h1>

      {/* ── Bio ── */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.55 }}
        className={`text-base sm:text-lg text-sky-700 dark:text-zinc-400 mb-6 leading-relaxed ${centered ? "max-w-2xl" : "max-w-lg"}`}
      >
        {personalInfo.bio}
      </motion.p>

      {/* ── Location ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.46, duration: 0.4 }}
        className="flex items-center gap-1.5 text-sky-500 dark:text-zinc-500 text-sm mb-7"
      >
        <MapPin size={13} className="text-violet-500 dark:text-violet-400" />
        <span>{personalInfo.location}</span>
      </motion.div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`flex gap-8 mb-8 pb-7 border-b border-sky-100 dark:border-zinc-800 w-full ${wrap}`}
      >
        <StatItem to={2}  suffix="+"  label="Years Exp"   delay={600} />
        <StatItem to={3}  suffix=""   label="IEEE Papers" delay={760} />
        <StatItem to={10} suffix="+"  label="Projects"    delay={920} />
      </motion.div>

      {/* ── CTA buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58, duration: 0.5 }}
        className={`flex flex-wrap gap-3 mb-8 ${wrap}`}
      >
        <a
          href="/#projects"
          className="group relative px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 text-sm overflow-hidden"
        >
          {/* Shimmer sweep on hover */}
          <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
          View My Work
        </a>

        <a
          href="/#contact"
          className="px-6 py-3 border border-sky-300 dark:border-zinc-700 hover:border-violet-400 dark:hover:border-violet-600 text-sky-800 dark:text-zinc-300 hover:text-violet-700 dark:hover:text-violet-400 font-medium rounded-lg transition-all duration-200 hover:bg-sky-50 dark:hover:bg-violet-900/10 hover:-translate-y-0.5 text-sm"
        >
          Get In Touch
        </a>

        {/* Resume download — distinct pill style */}
        <a
          href={personalInfo.resume ?? "/resume.pdf"}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
          style={{
            border: "1px solid rgba(124,58,237,0.35)",
            color: "#7c3aed",
            background: "rgba(124,58,237,0.06)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.12)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.6)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 18px rgba(124,58,237,0.15)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.06)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.35)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          <motion.span
            className="group-hover:animate-none"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Download size={14} />
          </motion.span>
          <span>Résumé</span>
          <ExternalLink size={11} className="opacity-50" />
        </a>
      </motion.div>

      {/* ── Social icons — spring staggered ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className={`flex items-center gap-1.5 flex-wrap ${wrap}`}
      >
        {SOCIALS.map(({ href, icon, label }, i) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            initial={{ opacity: 0, scale: 0.4, rotate: -15 }}
            animate={{ opacity: 1, scale: 1,   rotate: 0   }}
            transition={{
              delay: 0.72 + i * 0.07,
              type: "spring",
              stiffness: 260,
              damping: 18,
            }}
            whileHover={{ scale: 1.18, y: -2 }}
            className="relative p-2.5 rounded-lg transition-colors duration-150 text-sky-400/70 dark:text-zinc-600 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-zinc-800"
          >
            {icon}
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Cursor ───────────────────────────────────────────────────────────────────

const Cursor = ({ color = "#4ade80" }: { color?: string }) => (
  <motion.span
    animate={{ opacity: [1, 1, 0, 0] }}
    transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
    style={{
      display: "inline-block", width: 8, height: "0.9em",
      backgroundColor: color, marginLeft: 2, verticalAlign: "middle",
    }}
  />
);

const Prompt = () => (
  <span style={{ fontFamily: "monospace" }}>
    <span style={{ color: "#4ade80" }}>visitor</span>
    <span style={{ color: "#6b7280" }}>@</span>
    <span style={{ color: "#818cf8" }}>shanjid-portfolio</span>
    <span style={{ color: "#6b7280" }}>:~$ </span>
  </span>
);

// ─── Syntax tokens ────────────────────────────────────────────────────────────

const Kw  = ({ c }: { c: string }) => <span style={{ color: "#ff79c6" }}>{c}</span>;
const Fn  = ({ c }: { c: string }) => <span style={{ color: "#50fa7b" }}>{c}</span>;
const St  = ({ c }: { c: string }) => <span style={{ color: "#f1fa8c" }}>{c}</span>;
const Inc = ({ c }: { c: string }) => <span style={{ color: "#8be9fd" }}>{c}</span>;
const Num = ({ c }: { c: string }) => <span style={{ color: "#bd93f9" }}>{c}</span>;
const Cm  = ({ c }: { c: string }) => <span style={{ color: "#6272a4", fontStyle: "italic" }}>{c}</span>;
const Err = ({ c }: { c: string }) => <span style={{ color: "#ff5555", fontWeight: 700 }}>{c}</span>;
const Ty  = ({ c }: { c: string }) => <span style={{ color: "#8be9fd" }}>{c}</span>;

// ─── Nano line ────────────────────────────────────────────────────────────────

function NLine({ n, eof, children, highlight }: {
  n?: number; eof?: boolean; highlight?: boolean; children?: React.ReactNode;
}) {
  if (eof) return (
    <div style={{ display: "flex", lineHeight: 1.75, fontSize: "0.80rem" }}>
      <span style={{ minWidth: "2.6rem", textAlign: "right", paddingRight: "0.8rem", color: "#2a2a42", userSelect: "none", fontSize: "0.72rem" }}>~</span>
    </div>
  );
  return (
    <div style={{ display: "flex", lineHeight: 1.75, fontSize: "0.80rem", background: highlight ? "rgba(255,85,85,0.08)" : "transparent", borderLeft: highlight ? "2px solid #ff5555" : "2px solid transparent" }}>
      <span style={{ minWidth: "2.6rem", textAlign: "right", paddingRight: "0.8rem", color: highlight ? "#ff5555" : "#1e1e32", userSelect: "none", fontSize: "0.72rem", flexShrink: 0 }}>{n}</span>
      <span style={{ color: "#c8ccd8", whiteSpace: "pre", flex: 1 }}>{children ?? ""}</span>
    </div>
  );
}

// ─── Main Hero component ──────────────────────────────────────────────────────

export default function Hero() {
  const [phase,        setPhase]        = useState<Phase>("segfault");
  const [nanoTyped,    setNanoTyped]    = useState("");
  const [savingStep,   setSavingStep]   = useState(0);
  const [compileTyped, setCompileTyped] = useState("");
  const [editFixed,     setEditFixed]   = useState(false);
  const [editProgress,  setEditProgress]= useState("");
  const [outputLines,   setOutputLines] = useState<typeof OUTPUT_LINES>([]);
  const [showTerminal, setShowTerminal] = useState(true);
  const cancelRef                       = useRef(false);

  // ── Animation sequence ────────────────────────────────────────────────────
  useEffect(() => {
    cancelRef.current = false;
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
    const abort = () => cancelRef.current;

    const type = async (text: string, setter: (s: string) => void, speed: number) => {
      for (let i = 1; i <= text.length; i++) {
        if (abort()) return;
        setter(text.slice(0, i));
        await sleep(speed);
      }
    };

    const run = async () => {
      await sleep(2200);              if (abort()) return;

      setPhase("typing-nano");
      await type(NANO_CMD, setNanoTyped, 20);
      await sleep(1300);              if (abort()) return;

      setPhase("editor");
      await sleep(900);               if (abort()) return;

      const FIX_PREFIX = "Engineer *dev = ";
      const FIX_REMOVE = "NULL;";
      const FIX_ADD    = "&profile;";

      setPhase("fixing");
      setEditProgress(BUGGY_LINE);

      for (let i = FIX_REMOVE.length; i >= 0; i--) {
        if (abort()) return;
        setEditProgress(FIX_PREFIX + FIX_REMOVE.slice(0, i));
        await sleep(60);
      }
      for (let i = 1; i <= FIX_ADD.length; i++) {
        if (abort()) return;
        setEditProgress(FIX_PREFIX + FIX_ADD.slice(0, i));
        await sleep(70);
      }

      await sleep(500);                    if (abort()) return;
      setEditFixed(true);

      setPhase("saving");
      await sleep(320); if (abort()) return; setSavingStep(1);
      await sleep(700); if (abort()) return; setSavingStep(2);
      await sleep(700); if (abort()) return; setSavingStep(3);
      await sleep(950);              if (abort()) return;

      setPhase("compiling");
      await type(COMPILE_CMD, setCompileTyped, 36);
      await sleep(420);              if (abort()) return;

      setPhase("output");
      for (let i = 0; i < OUTPUT_LINES.length; i++) {
        if (abort()) return;
        await sleep(OUTPUT_LINES[i].delay);
        if (abort()) return;
        setOutputLines(prev => [...prev, OUTPUT_LINES[i]]);
      }
      await sleep(2000);                   if (abort()) return;
      setPhase("done");
    };

    run();
    return () => { cancelRef.current = true; };
  }, []);

  const skipAnimation = () => {
    cancelRef.current = true;
    setPhase("done");
    setTimeout(() => setShowTerminal(false), 80);
  };

  // ── nano editor ───────────────────────────────────────────────────────────
  const renderEditor = () => {
    const isFix      = phase === "fixing";
    const isSave     = phase === "saving";
    const modified   = isFix || (isSave && savingStep < 3);
    const showCursor = phase === "editor" || isFix;

    const lineSrc = editFixed ? FIXED_LINE : isFix ? editProgress : BUGGY_LINE;
    const isFixed = editFixed || (isFix && editProgress === FIXED_LINE);

    const statusContent = (() => {
      if (!isSave) return null;
      if (savingStep === 1) return (
        <span>Save modified buffer?{" "}
          <span style={{ background: "#050510", color: "#c4c8d4", padding: "0 4px", borderRadius: 2, fontWeight: 700 }}>Y</span>
        </span>
      );
      if (savingStep === 2) return (
        <span>File Name to Write:{" "}
          <span style={{ color: "#050510", fontWeight: 700 }}>shanjid_arefin.c</span>
          <span style={{ display: "inline-block", width: 7, height: "0.85em", background: "#050510", marginLeft: 2, verticalAlign: "middle" }} />
        </span>
      );
      if (savingStep === 3) return <span style={{ color: "#4ade80" }}>[ Wrote 24 lines ]</span>;
    })();

    return (
      <div style={{ fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", width: "100%" }}>
        <div style={{ background: "#130d2b", color: "#a78bfa", fontSize: "0.78rem", fontWeight: 600, padding: "0.2rem 0.8rem", display: "flex", justifyContent: "space-between" }}>
          <span>GNU nano 5.4</span>
          <span>shanjid_arefin.c{modified && <span style={{ color: "#6b2e00" }}> [Modified]</span>}</span>
          <span />
        </div>

        <div style={{ background: "#06060d", padding: "0.35rem 0", minHeight: 230 }}>
          <NLine n={1}><Inc c="#include" /> <St c="&lt;stdio.h&gt;" /></NLine>
          <NLine n={2}><Inc c="#include" /> <St c="&lt;string.h&gt;" /></NLine>
          <NLine n={3}><Inc c="#include" /> <St c='"profile_info.h"' /></NLine>
          <NLine n={4} />
          <NLine n={5}><Cm c="/* Engineer profile — network software R&D */" /></NLine>
          <NLine n={6}><Kw c="typedef" /> <Kw c="struct" /> {"{"}</NLine>
          <NLine n={7}>{"    "}<Ty c="char" /> <Cm c="*name" />{", "}<Cm c="*role" />{", "}<Cm c="*stack" />{";"}</NLine>
          <NLine n={8}>{"    "}<Ty c="int" />{"  "}<Cm c="experience" />{";"}</NLine>
          <NLine n={9}>{"} "}<Ty c="Engineer" />{";"}</NLine>
          <NLine n={10} />
          <NLine n={11}><Kw c="int" /> <Fn c="main" />{"() {"}</NLine>
          <NLine n={12}>{"    "}<Ty c="Engineer" />{" profile = {"}</NLine>
          <NLine n={13}>{"        "}<St c={'"MD. SHANJID AREFIN"'} />{", "}<St c={'"R&D Engineer"'} />{","}</NLine>
          <NLine n={14}>{"        "}<St c={'"C · Networking · Embedded"'} />{", "}<Num c="2" /></NLine>
          <NLine n={15}>{"    "}{"}"}</NLine>

          <div style={{
            display: "flex", lineHeight: 1.75, fontSize: "0.80rem",
            background: isFixed ? "rgba(80,250,123,0.06)" : "rgba(255,85,85,0.09)",
            borderLeft: isFixed ? "2px solid #50fa7b" : "2px solid #ff5555",
          }}>
            <span style={{ minWidth: "2.6rem", textAlign: "right", paddingRight: "0.8rem", color: isFixed ? "#50fa7b" : "#ff5555", userSelect: "none", fontSize: "0.72rem", flexShrink: 0 }}>15</span>
            <span style={{ color: "#c8ccd8", whiteSpace: "pre", flex: 1 }}>
              {"    "}<Ty c="Engineer" />{" "}
              {isFixed
                ? <><span style={{ color: "#f1fa8c" }}>*dev = &amp;profile</span>{";"}</>
                : isFix
                ? <><Err c="*dev = " /><span style={{ color: "#f1fa8c" }}>{editProgress.replace("Engineer *dev = ", "").replace(";","")}</span>{";"}</>
                : <><Err c="*dev = NULL" />{";"}</>
              }
              {showCursor && !editFixed && (
                <motion.span
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 0.72, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
                  style={{ display: "inline-block", width: "0.48em", height: "1.1em", background: "#e8eaf4", verticalAlign: "text-bottom", marginLeft: 1 }}
                />
              )}
            </span>
          </div>

          <NLine n={17} />
          <NLine n={18} highlight={!isFixed}>
            {"    "}
            {isFixed ? <Fn c="printf" /> : <Err c="printf" />}
            {"("}
            <St c={'"Hello World! I am %s\\n"'} />
            {", dev->name);"}
            {!isFixed && <Cm c="  // SIGSEGV: null ptr!" />}
          </NLine>
          <NLine n={19}>{"    "}<Fn c="load_profile_info" />{"("}
            <Kw c="void" />{");"}</NLine>
          <NLine n={20}>{"    "}<Kw c="return" /> <Num c="0" />{";"}</NLine>
          <NLine n={21}>{"}"}</NLine>
          <NLine eof /><NLine eof />
        </div>

        <div style={{ background: "#130d2b", color: "#7c6aad", fontSize: "0.75rem", fontWeight: 500, padding: "0.15rem 0.8rem", minHeight: "1.4rem" }}>
          {statusContent ?? "\u00a0"}
        </div>

        <div style={{ background: "#06060d", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid #0e0e1e" }}>
          {[["^G","Help"],["^X","Exit"],["^O","Write Out"],["^W","Search"],["^K","Cut"],["^U","Paste"]].map(([k, l]) => (
            <span key={k} style={{ display: "flex", gap: "0.4rem", alignItems: "center", fontSize: "0.7rem", padding: "0.2rem 0.6rem", color: "#7880a0", fontFamily: "inherit" }}>
              <span style={{ background: "#141428", color: "#e8eaf4", padding: "0 0.3rem", borderRadius: 2 }}>{k}</span>{l}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // ── bash terminal ─────────────────────────────────────────────────────────
  const renderBash = () => (
    <div style={{
      padding: "16px 20px",
      fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
      fontSize: 12.5, lineHeight: 1.75, color: "#d4d4d8",
      backgroundImage: "radial-gradient(rgba(124,58,237,0.05) 1px, transparent 1px)",
      backgroundSize: "22px 22px",
    }}>

      <div style={{
        border: "1px solid rgba(58, 44, 205, 0.18)",
        borderRadius: 8, padding: "10px 14px", marginBottom: 14,
        background: "rgba(37, 117, 245, 0.04)",
      }}>
        <div style={{ marginBottom: 6 }}>
          <Prompt /><span style={{ color: "#4a4a66" }}>./shanjid_arefin</span>
        </div>

        <motion.div
          animate={{ opacity: [1, 0.3, 1, 0.5, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.0 }}
          style={{
            color: "#ff3333", fontWeight: 700, fontSize: "0.92rem",
            letterSpacing: "0.03em", textShadow: "0 0 18px rgba(255,40,40,0.5)",
          }}
        >
          ✗ Segmentation Fault
          <span style={{ color: "#5a2a2a", fontWeight: 400, fontSize: "0.75rem", marginLeft: 10 }}>
            SIGSEGV · core dumped
          </span>
        </motion.div>

        <div style={{
          fontSize: "0.73rem", color: "#3a3a52", marginTop: 6,
          borderTop: "1px solid rgba(255,85,85,0.1)", paddingTop: 6,
          display: "flex", gap: 16,
        }}>
          <span>#0 main() · shanjid_arefin.c:17</span>
          <span style={{ color: "#ff4444" }}>← dev is NULL</span>
        </div>
      </div>

      {(["typing-nano","compiling","output","done"] as Phase[]).includes(phase) && (
        <div style={{ marginBottom: 4 }}>
          <Prompt />
          <span style={{ color: phase === "typing-nano" ? "#d4d4d8" : "#3d3d55" }}>
            {nanoTyped}
          </span>
          {phase === "typing-nano" && <Cursor />}
        </div>
      )}

      {(["compiling","output","done"] as Phase[]).includes(phase) && (
        <div style={{ marginBottom: 4 }}>
          <Prompt />
          <span style={{ color: phase === "compiling" ? "#d4d4d8" : "#3d3d55" }}>
            {compileTyped}
          </span>
          {phase === "compiling" && <Cursor />}
        </div>
      )}

      {(["output","done"] as Phase[]).includes(phase) && outputLines.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {outputLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                color: line.color, fontSize: "0.80rem", lineHeight: 1.95,
                borderLeft: `2px solid ${line.color}45`,
                paddingLeft: 10, marginBottom: 1,
              }}
            >
              {line.text}
            </motion.div>
          ))}
        </div>
      )}

      {(phase === "done" || (phase === "output" && outputLines.length === OUTPUT_LINES.length)) && (
        <div style={{ marginTop: 8 }}><Prompt /><Cursor /></div>
      )}

      {phase === "segfault" && (
        <div style={{ marginTop: 14 }}><Prompt /><Cursor /></div>
      )}
    </div>
  );

  const isEditorPhase = (["editor","fixing","saving"] as Phase[]).includes(phase);

  return (
    <section id="hero" className="relative min-h-screen flex items-center px-4 overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto py-24">
        <AnimatePresence mode="wait">

          {showTerminal ? (
            <motion.div
              key="two-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-center"
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <LeftContent centered={false} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="relative flex flex-col"
              >
                <button
                  onClick={skipAnimation}
                  className="absolute -top-8 right-0 flex items-center gap-1.5 text-sky-400 dark:text-zinc-500 hover:text-violet-500 dark:hover:text-zinc-300 text-xs font-mono transition-colors group z-10"
                >
                  <SkipForward size={12} className="group-hover:text-violet-400 transition-colors" />
                  skip intro
                </button>

                <div
                  className="relative rounded-xl p-[1.5px] overflow-hidden w-full"
                  style={{ boxShadow: "0 24px 64px rgba(124,58,237,0.18), 0 0 0 0px transparent" }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute pointer-events-none"
                    style={{
                      inset: "-50%", width: "200%", height: "200%",
                      background: "conic-gradient(from 0deg, transparent 0deg, #7c3aed 80deg, #06b6d4 150deg, #4ade80 210deg, transparent 290deg)",
                    }}
                  />

                  <div className="relative rounded-[10px] overflow-hidden w-full" style={{ background: "#06060f" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "10px 16px",
                      background: "linear-gradient(90deg, #09091e 0%, #130d2b 100%)",
                      borderBottom: "1px solid rgba(124,58,237,0.2)",
                    }}>
                      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57", boxShadow: "0 0 6px rgba(255,95,87,0.55)" }} />
                      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e", boxShadow: "0 0 6px rgba(254,188,46,0.55)" }} />
                      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840", boxShadow: "0 0 6px rgba(40,200,64,0.55)" }} />

                      <span style={{
                        marginLeft: 10, color: "#6b5f9e", fontSize: 11,
                        fontFamily: "monospace", letterSpacing: "0.06em",
                      }}>
                        {isEditorPhase ? "nano · shanjid_arefin.c" : "bash · visitor@shanjid"}
                      </span>

                      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                        <motion.div
                          animate={{ opacity: [1, 0.2, 1] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                          style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: "#4ade80", boxShadow: "0 0 7px rgba(74,222,128,0.8)",
                          }}
                        />
                        <span style={{ fontSize: 10, fontFamily: "monospace", color: "#2d4a35", letterSpacing: "0.1em" }}>
                          LIVE
                        </span>
                      </div>
                    </div>

                    <div style={{ minHeight: 280 }}>
                      {isEditorPhase ? renderEditor() : renderBash()}
                    </div>
                  </div>
                </div>

                <div className="absolute -inset-6 bg-violet-600/10 rounded-2xl blur-3xl -z-10 pointer-events-none" />
                <div className="absolute -inset-2 bg-cyan-500/5 rounded-2xl blur-xl -z-10 pointer-events-none" />
                <div className="absolute -inset-4 bg-violet-500/5 rounded-2xl blur-2xl -z-10 pointer-events-none" />
              </motion.div>
            </motion.div>

          ) : (

            <motion.div
              key="one-col"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl mx-auto"
            >
              <LeftContent centered={true} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sky-400 dark:text-zinc-600 animate-bounce"
      >
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
}