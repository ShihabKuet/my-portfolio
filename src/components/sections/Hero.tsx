"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo } from "@/data";
import { ArrowDown, MapPin, Mail, Briefcase, SkipForward } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiResearchgate, SiMedium } from "react-icons/si";
import { Globe } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "segfault" | "typing-nano" | "editor"
  | "fixing"   | "saving"      | "compiling"
  | "output"   | "done";

// ─── Constants ────────────────────────────────────────────────────────────────

const NANO_CMD    = "nano Portfolio.c";
const EDIT_FROM   = "*name";
const EDIT_TO     = '"MD. SHANJID AREFIN"';
const COMPILE_CMD = "gcc Portfolio.c -o portfolio && ./portfolio";
const OUTPUT_TEXT = "Hello World! I am MD. SHANJID AREFIN";

// ─── Social links (defined at module level — stable reference) ────────────────

const SOCIALS = [
  { href: personalInfo.github,            icon: <FaGithub size={18} />,       label: "GitHub"       },
  { href: personalInfo.linkedin,          icon: <FaLinkedin size={18} />,     label: "LinkedIn"     },
  { href: personalInfo.researchgate,      icon: <SiResearchgate size={18} />, label: "ResearchGate" },
  { href: personalInfo.medium,            icon: <SiMedium size={18} />,       label: "Medium"       },
  { href: personalInfo.blog,              icon: <Globe size={18} />,          label: "Blog"         },
  { href: `mailto:${personalInfo.email}`, icon: <Mail size={18} />,           label: "Email"        },
];

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
    <span style={{ color: "#4ade80" }}>user</span>
    <span style={{ color: "#6b7280" }}>@</span>
    <span style={{ color: "#818cf8" }}>portfolio</span>
    <span style={{ color: "#6b7280" }}>:~$ </span>
  </span>
);

// ─── Syntax tokens ────────────────────────────────────────────────────────────

const Kw  = ({ c }: { c: string }) => <span style={{ color: "#ff79c6" }}>{c}</span>;
const Fn  = ({ c }: { c: string }) => <span style={{ color: "#50fa7b" }}>{c}</span>;
const St  = ({ c }: { c: string }) => <span style={{ color: "#f1fa8c" }}>{c}</span>;
const Inc = ({ c }: { c: string }) => <span style={{ color: "#8be9fd" }}>{c}</span>;
const Num = ({ c }: { c: string }) => <span style={{ color: "#bd93f9" }}>{c}</span>;

// ─── Nano line ────────────────────────────────────────────────────────────────

function NLine({ n, eof, children }: {
  n?: number; eof?: boolean; children?: React.ReactNode;
}) {
  if (eof) return (
    <div style={{ display: "flex", lineHeight: 1.82, fontSize: "0.82rem" }}>
      <span style={{ minWidth: "2.8rem", textAlign: "right", paddingRight: "0.9rem", color: "#2a2a42", userSelect: "none", fontSize: "0.74rem" }}>~</span>
    </div>
  );
  return (
    <div style={{ display: "flex", lineHeight: 1.82, fontSize: "0.82rem" }}>
      <span style={{ minWidth: "2.8rem", textAlign: "right", paddingRight: "0.9rem", color: "#1e1e32", userSelect: "none", fontSize: "0.74rem", flexShrink: 0 }}>{n}</span>
      <span style={{ color: "#c8ccd8", whiteSpace: "pre", flex: 1 }}>{children ?? ""}</span>
    </div>
  );
}

// ─── LeftContent — defined OUTSIDE Hero so it never remounts on phase change ──
//
// WHY: When a component is defined inside another component, React creates a new
// function reference on every render of the parent. React sees a different component
// type each time and fully unmounts + remounts the child — triggering Framer Motion
// entrance animations repeatedly. Defining it outside gives a stable reference.

interface LeftContentProps {
  centered: boolean;
}

function LeftContent({ centered }: LeftContentProps) {
  const align = centered ? "items-center text-center" : "items-start text-left";
  const wrap  = centered ? "justify-center" : "";

  return (
    <div className={`flex flex-col ${align}`}>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-200 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/50 text-sky-600 dark:text-zinc-400 text-sm mb-6 backdrop-blur-sm shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <Briefcase size={13} />
        <span className="font-medium">{personalInfo.role} @ {personalInfo.company}</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-4xl sm:text-5xl xl:text-6xl font-black text-sky-950 dark:text-zinc-100 leading-tight mb-4"
      >
        Hello World!{" "}
        {!centered && <br className="hidden sm:block" />}
        I&apos;m{" "}
        <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
          {personalInfo.name}
        </span>
      </motion.h1>

      {/* Bio */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className={`text-base sm:text-lg text-sky-700 dark:text-zinc-400 mb-6 leading-relaxed ${centered ? "max-w-2xl" : "max-w-lg"}`}
      >
        {personalInfo.bio}
      </motion.p>

      {/* Location */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="flex items-center gap-1.5 text-sky-500 dark:text-zinc-500 text-sm mb-8"
      >
        <MapPin size={14} className="text-violet-600 dark:text-violet-400" />
        <span>{personalInfo.location}</span>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className={`flex flex-wrap gap-3 mb-8 ${wrap}`}
      >
        <a
          href="/#projects"
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 text-sm"
        >
          View My Work
        </a>
        <a
          href="/#contact"
          className="px-6 py-3 border border-sky-300 dark:border-zinc-700 hover:border-sky-400 dark:hover:border-zinc-500 text-sky-800 dark:text-zinc-300 hover:text-sky-950 dark:hover:text-zinc-100 font-medium rounded-lg transition-all duration-200 hover:bg-sky-100 dark:hover:bg-zinc-800/50 hover:-translate-y-0.5 text-sm"
        >
          Get In Touch
        </a>
      </motion.div>

      {/* Social icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        className={`flex items-center gap-2 flex-wrap ${wrap}`}
      >
        {SOCIALS.map(({ href, icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="p-2.5 text-sky-500 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-sky-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200"
          >
            {icon}
          </a>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Hero component ──────────────────────────────────────────────────────

export default function Hero() {
  const [phase,        setPhase]        = useState<Phase>("segfault");
  const [nanoTyped,    setNanoTyped]    = useState("");
  const [editText,     setEditText]     = useState(EDIT_FROM);
  const [savingStep,   setSavingStep]   = useState(0);
  const [compileTyped, setCompileTyped] = useState("");
  const [outLen,       setOutLen]       = useState(0);
  const [outputDone,   setOutputDone]   = useState(false);
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
      await type(NANO_CMD, setNanoTyped, 80);
      await sleep(1300);              if (abort()) return;
      setPhase("editor");
      await sleep(900);               if (abort()) return;
      setPhase("fixing");
      for (let i = EDIT_FROM.length; i >= 0; i--) {
        if (abort()) return;
        setEditText(EDIT_FROM.slice(0, i));
        await sleep(90);
      }
      for (let i = 1; i <= EDIT_TO.length; i++) {
        if (abort()) return;
        setEditText(EDIT_TO.slice(0, i));
        await sleep(85);
      }
      await sleep(420);              if (abort()) return;
      setPhase("saving");
      await sleep(320); if (abort()) return; setSavingStep(1);
      await sleep(700); if (abort()) return; setSavingStep(2);
      await sleep(700); if (abort()) return; setSavingStep(3);
      await sleep(950);              if (abort()) return;
      setPhase("compiling");
      await type(COMPILE_CMD, setCompileTyped, 36);
      await sleep(420);              if (abort()) return;
      setPhase("output");
      await sleep(500);
      await new Promise<void>(resolve => {
        let i = 0;
        const iv = setInterval(() => {
          if (abort()) { clearInterval(iv); resolve(); return; }
          setOutLen(++i);
          if (i >= OUTPUT_TEXT.length) { clearInterval(iv); resolve(); }
        }, 55);
      });
      if (abort()) return;
      setOutputDone(true);
      await sleep(2400);             if (abort()) return;
      setPhase("done");
    };

    run();
    return () => { cancelRef.current = true; };
  }, []);

  // ── Skip: stop animation + collapse terminal to reveal centered layout ────
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

    const statusContent = (() => {
      if (!isSave) return null;
      if (savingStep === 1) return (
        <span>Save modified buffer?{" "}
          <span style={{ background: "#050510", color: "#c4c8d4", padding: "0 4px", borderRadius: 2, fontWeight: 700 }}>Y</span>
        </span>
      );
      if (savingStep === 2) return (
        <span>File Name to Write:{" "}
          <span style={{ color: "#050510", fontWeight: 700 }}>Portfolio.c</span>
          <span style={{ display: "inline-block", width: 7, height: "0.85em", background: "#050510", marginLeft: 2, verticalAlign: "middle" }} />
        </span>
      );
      if (savingStep === 3) return <span style={{ color: "#155724" }}>[ Wrote 7 lines ]</span>;
    })();

    return (
      <div style={{ fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", width: "100%" }}>
        <div style={{ background: "#c4c8d4", color: "#050510", fontSize: "0.78rem", fontWeight: 700, padding: "0.2rem 0.8rem", display: "flex", justifyContent: "space-between" }}>
          <span>GNU nano 5.4</span>
          <span>Portfolio.c{modified && <span style={{ color: "#6b2e00" }}> [Modified]</span>}</span>
          <span />
        </div>
        <div style={{ background: "#06060d", padding: "0.4rem 0", minHeight: 180 }}>
          <NLine n={1}><Inc c="#include" /> <St c="&lt;stdio.h&gt;" /></NLine>
          <NLine n={2} />
          <NLine n={3}><Kw c="int" /> <Fn c="main" />{"() {"}</NLine>
          <NLine n={4}>{"    "}<Kw c="char" />{" *name = "}<St c={'"???";'} /></NLine>
          <div style={{ display: "flex", lineHeight: 1.82, fontSize: "0.82rem", background: "rgba(0,212,255,0.035)", borderLeft: (showCursor || isSave) ? "2px solid #7c3aed" : "2px solid transparent" }}>
            <span style={{ minWidth: "2.8rem", textAlign: "right", paddingRight: "0.9rem", color: "#1e1e32", userSelect: "none", fontSize: "0.74rem", flexShrink: 0 }}>5</span>
            <span style={{ color: "#c8ccd8", whiteSpace: "pre", flex: 1 }}>
              {"    "}<Fn c="printf" />{"("}<St c={'"Hello World! I am %s"'} />{", "}
              <span style={{ color: editText.startsWith('"') ? "#f1fa8c" : "#c8ccd8" }}>{editText}</span>
              {showCursor && (
                <motion.span
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 0.72, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
                  style={{ display: "inline-block", width: "0.50em", height: "1.12em", background: "#e8eaf4", verticalAlign: "text-bottom", marginLeft: 1 }}
                />
              )}
              {");"}
            </span>
          </div>
          <NLine n={6}>{"    "}<Kw c="return" /> <Num c="0" />{";"}</NLine>
          <NLine n={7}>{"}"}</NLine>
          <NLine eof /><NLine eof />
        </div>
        <div style={{ background: "#c4c8d4", color: "#050510", fontSize: "0.75rem", fontWeight: 700, padding: "0.15rem 0.8rem", minHeight: "1.4rem" }}>
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
    <div style={{ padding: "14px 18px", fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", fontSize: 12.5, lineHeight: 1.75, color: "#d4d4d8" }}>
      <div style={{ marginBottom: 4 }}><Prompt />{"./portfolio"}</div>
      <motion.div
        animate={{ opacity: [1, 0.5, 1, 0.72, 1, 0.58, 1, 0.8, 1, 1] }}
        transition={{ duration: 1.1, times: [0, 0.07, 0.14, 0.26, 0.38, 0.52, 0.63, 0.78, 0.9, 1], repeat: Infinity, repeatDelay: 0.9 }}
        style={{ color: "#ff3333", fontWeight: 700, fontSize: "0.92rem", textShadow: "0 0 14px rgba(255,40,40,0.6)" }}
      >
        Segmentation Fault (Core dumped)
      </motion.div>
      <div style={{ color: "#ff7070", fontSize: "0.82rem", opacity: 0.82 }}>
        Error: Cannot access memory at 0x0000004D
      </div>

      {(["typing-nano","compiling","output"] as Phase[]).includes(phase) && (
        <div style={{ marginTop: 10 }}>
          <Prompt />
          <span style={{ color: phase === "typing-nano" ? "#d4d4d8" : "#52525b" }}>{nanoTyped}</span>
          {phase === "typing-nano" && <Cursor />}
        </div>
      )}
      {(["compiling","output"] as Phase[]).includes(phase) && (
        <div>
          <Prompt />
          <span style={{ color: phase === "compiling" ? "#d4d4d8" : "#52525b" }}>{compileTyped}</span>
          {phase === "compiling" && <Cursor />}
        </div>
      )}
      {phase === "output" && (
        <div style={{ marginTop: 10 }}>
          {outLen < OUTPUT_TEXT.length
            ? <div><span style={{ color: "#c8ccd8" }}>{OUTPUT_TEXT.slice(0, outLen)}</span><Cursor color="#00d4ff" /></div>
            : <div>
                <span style={{ color: "#c8ccd8" }}>Hello World! I am </span>
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ color: "#818cf8", fontWeight: 700, fontSize: 14 }}>
                  MD. SHANJID AREFIN
                </motion.span>
              </div>
          }
          {outputDone && <div style={{ marginTop: 8 }}><Prompt /><Cursor /></div>}
        </div>
      )}
      {phase === "done" && (
        <div style={{ marginTop: 10 }}>
          <div>
            <span style={{ color: "#c8ccd8" }}>Hello World! I am </span>
            <span style={{ color: "#818cf8", fontWeight: 700, fontSize: 14 }}>MD. SHANJID AREFIN</span>
          </div>
          <div style={{ marginTop: 6 }}><Prompt /><Cursor /></div>
        </div>
      )}
      {phase === "segfault" && <div style={{ marginTop: 10 }}><Prompt /><Cursor /></div>}
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

          {/* ── TWO-COLUMN: left=content, right=terminal ── */}
          {showTerminal ? (
            <motion.div
              key="two-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-center"
            >
              {/* Left — stable, never remounts */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                {/*
                  KEY INSIGHT: LeftContent is defined outside Hero.
                  React keeps the same component instance across all Hero re-renders
                  caused by phase changes — so Framer Motion only plays entrance
                  animations ONCE on initial mount, never again.
                */}
                <LeftContent centered={false} />
              </motion.div>

              {/* Right — terminal */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="relative flex flex-col"
              >
                {/* Skip button - Uncomment the bottom line & remove the line after it, if I want the disappear the button after all the Animations are completes */}
                {/* {phase !== "done" && ( */}
                {(
                  <button
                    onClick={skipAnimation}
                    className="absolute -top-8 right-0 flex items-center gap-1.5 text-sky-400 dark:text-zinc-500 hover:text-violet-500 dark:hover:text-zinc-300 text-xs font-mono transition-colors group z-10"
                  >
                    <SkipForward size={12} className="group-hover:text-violet-400 transition-colors" />
                    skip intro
                  </button>
                )}

                {/* Terminal window */}
                <div
                  className="rounded-xl overflow-hidden shadow-2xl shadow-violet-500/10 dark:shadow-black/60 w-full"
                  style={{ border: "1px solid #3f3f46", background: "#18181b" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "#27272a", borderBottom: "1px solid #3f3f46" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", opacity: 0.85 }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#eab308", opacity: 0.85 }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e", opacity: 0.85 }} />
                    <span style={{ marginLeft: 10, color: "#71717a", fontSize: 12, fontFamily: "monospace" }}>
                      {isEditorPhase ? "nano — Portfolio.c" : "bash — user@portfolio"}
                    </span>
                  </div>
                  <div style={{ minHeight: 280 }}>
                    {isEditorPhase ? renderEditor() : renderBash()}
                  </div>
                </div>

                <div className="absolute -inset-4 bg-violet-500/5 rounded-2xl blur-2xl -z-10 pointer-events-none" />
              </motion.div>
            </motion.div>

          ) : (

            /* ── ONE-COLUMN: centered after skip ── */
            <motion.div
              key="one-col"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl mx-auto"
            >
              {/*
                Same LeftContent component, different `centered` prop.
                AnimatePresence mode="wait" unmounts two-col first, then mounts
                one-col — so this IS a fresh mount, and entrance animations
                playing here is intentional and expected.
              */}
              <LeftContent centered={true} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Scroll arrow */}
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