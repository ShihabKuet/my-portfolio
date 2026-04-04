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
  | "segfault"
  | "typing-nano"
  | "editor"
  | "fixing"
  | "saving"
  | "compiling"
  | "output"
  | "reveal";

// ─── Constants ────────────────────────────────────────────────────────────────

const NANO_CMD    = "nano Portfolio.c";
const EDIT_FROM   = "*name";
const EDIT_TO     = '"MD. SHANJID AREFIN"';
const COMPILE_CMD = "gcc Portfolio.c -o portfolio && ./portfolio";
const OUTPUT_TEXT = "Hello World! I am MD. SHANJID AREFIN";

// ─── Framer-motion blinking cursor ───────────────────────────────────────────

const Cursor = ({ color = "#4ade80" }: { color?: string }) => (
  <motion.span
    animate={{ opacity: [1, 1, 0, 0] }}
    transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
    style={{
      display: "inline-block",
      width: 8,
      height: "0.9em",
      backgroundColor: color,
      marginLeft: 2,
      verticalAlign: "middle",
    }}
  />
);

// ─── Terminal prompt ──────────────────────────────────────────────────────────

const Prompt = () => (
  <span style={{ fontFamily: "monospace" }}>
    <span style={{ color: "#4ade80" }}>user</span>
    <span style={{ color: "#6b7280" }}>@</span>
    <span style={{ color: "#818cf8" }}>portfolio</span>
    <span style={{ color: "#6b7280" }}>:~$ </span>
  </span>
);

// ─── Syntax tokens (Dracula palette) ─────────────────────────────────────────

const Kw  = ({ c }: { c: string }) => <span style={{ color: "#ff79c6" }}>{c}</span>;
const Fn  = ({ c }: { c: string }) => <span style={{ color: "#50fa7b" }}>{c}</span>;
const St  = ({ c }: { c: string }) => <span style={{ color: "#f1fa8c" }}>{c}</span>;
const Inc = ({ c }: { c: string }) => <span style={{ color: "#8be9fd" }}>{c}</span>;
const Num = ({ c }: { c: string }) => <span style={{ color: "#bd93f9" }}>{c}</span>;

// ─── Nano line with line-number gutter ───────────────────────────────────────

function NLine({
  n, active, eof, children,
}: {
  n?: number; active?: boolean; eof?: boolean; children?: React.ReactNode;
}) {
  if (eof) {
    return (
      <div style={{ display: "flex", lineHeight: 1.82, fontSize: "0.87rem" }}>
        <span style={{
          minWidth: "3.4rem", textAlign: "right", paddingRight: "1.1rem",
          color: "#2a2a42", userSelect: "none", fontSize: "0.78rem",
        }}>~</span>
      </div>
    );
  }
  return (
    <div style={{
      display: "flex", lineHeight: 1.82, fontSize: "0.87rem",
      background: active ? "rgba(0,212,255,0.035)" : "transparent",
    }}>
      <span style={{
        minWidth: "3.4rem", textAlign: "right", paddingRight: "1.1rem",
        color: "#1e1e32", userSelect: "none", fontSize: "0.78rem", flexShrink: 0,
      }}>
        {n}
      </span>
      <span style={{ color: "#c8ccd8", whiteSpace: "pre", flex: 1 }}>
        {children ?? ""}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Hero() {
  const [phase,        setPhase]        = useState<Phase>("segfault");
  const [nanoTyped,    setNanoTyped]    = useState("");
  const [editText,     setEditText]     = useState(EDIT_FROM);
  const [savingStep,   setSavingStep]   = useState(0);
  const [compileTyped, setCompileTyped] = useState("");
  const [outLen,       setOutLen]       = useState(0);
  const [outputDone,   setOutputDone]   = useState(false);
  const phaseRef                        = useRef<Phase>(phase); // Use a ref to track the current phase so the async callbacks always see the latest value

  // Keep the ref synced with state
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);  

  // ── Animation sequence ──────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    // Helper to check if we should abort
    const shouldAbort = () => cancelled || phaseRef.current === "reveal";

    const type = async (
      text: string,
      setter: (s: string) => void,
      speed: number,
    ) => {
      for (let i = 1; i <= text.length; i++) {
        if (shouldAbort()) return;
        setter(text.slice(0, i));
        await sleep(speed);
      }
    };

    const run = async () => {
      // 1 ─ Segfault glitters for 2.2s
      await sleep(2200);
      if (shouldAbort()) return;

      // 2 ─ Type "nano Portfolio.c", cursor blinks ~1.3s then Enter
      setPhase("typing-nano");
      await type(NANO_CMD, setNanoTyped, 80);
      await sleep(1300);
      if (shouldAbort()) return;

      // 3 ─ Editor opens, pause before cursor starts moving
      setPhase("editor");
      await sleep(900);
      if (shouldAbort()) return;

      // 4 ─ Backspace through *name → type "MD. SHANJID AREFIN"
      setPhase("fixing");
      for (let i = EDIT_FROM.length; i >= 0; i--) {
        if (shouldAbort()) return;
        setEditText(EDIT_FROM.slice(0, i));
        await sleep(90);
      }
      for (let i = 1; i <= EDIT_TO.length; i++) {
        if (shouldAbort()) return;
        setEditText(EDIT_TO.slice(0, i));
        await sleep(85);
      }
      await sleep(420);
      if (shouldAbort()) return;

      // 5 ─ Ctrl+X save sequence
      setPhase("saving");
      await sleep(320); if (shouldAbort()) return; setSavingStep(1);
      await sleep(700); if (shouldAbort()) return; setSavingStep(2);
      await sleep(700); if (shouldAbort()) return; setSavingStep(3);
      await sleep(950); if (shouldAbort()) return;

      // 6 ─ Compile command types out
      setPhase("compiling");
      await type(COMPILE_CMD, setCompileTyped, 36);
      await sleep(420);
      if (shouldAbort()) return;

      // 7 ─ Typewrite output, name glows
      setPhase("output");
      await sleep(500);
      await new Promise<void>(resolve => {
        let i = 0;
        const iv = setInterval(() => {
          if (shouldAbort()) { clearInterval(iv); resolve(); return; }
          setOutLen(++i);
          if (i >= OUTPUT_TEXT.length) { clearInterval(iv); resolve(); }
        }, 55);
      });
      if (shouldAbort()) return;
      setOutputDone(true);
      await sleep(2400);
      if (shouldAbort()) return;

      // 8 ─ Fade to hero reveal
      setPhase("reveal");
    };

    run();
    return () => { cancelled = true; };
  }, []);

  // ── Render: nano editor ─────────────────────────────────────────────────────
  //
  // Faithful to the original design:
  //   • Light-gray 3-column title bar (GNU nano 5.4 | filename | empty)
  //   • Dark body with right-aligned line numbers + "~" tilde EOF markers
  //   • Active printf line highlighted with teal tint + left border
  //   • Light-gray status bar that shows save-sequence messages
  //   • 3×2 shortcut grid with dark "#141428" key-badge chips

  const renderEditor = () => {
    const isFix       = phase === "fixing";
    const isSave      = phase === "saving";
    const modified    = isFix || (isSave && savingStep < 3);
    const showECursor = phase === "editor" || isFix;

    const statusContent = (() => {
      if (!isSave) return null;
      if (savingStep === 1) return (
        <span>
          Save modified buffer?{" "}
          <span style={{
            background: "#050510", color: "#c4c8d4",
            padding: "0 4px", borderRadius: 2, fontWeight: 700,
          }}>Y</span>
        </span>
      );
      if (savingStep === 2) return (
        <span>
          File Name to Write:{" "}
          <span style={{ color: "#050510", fontWeight: 700 }}>Portfolio.c</span>
          <span style={{
            display: "inline-block", width: 7, height: "0.85em",
            background: "#050510", marginLeft: 2, verticalAlign: "middle",
          }} />
        </span>
      );
      if (savingStep === 3) return (
        <span style={{ color: "#155724" }}>[ Wrote 7 lines ]</span>
      );
    })();

    return (
      <div style={{
        width: "100%",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        boxShadow: "0 0 60px rgba(0,0,0,.92), 0 0 22px rgba(0,212,255,.06)",
      }}>

        {/* ── Gray 3-column title bar ── */}
        <div style={{
          background: "#c4c8d4", color: "#050510",
          fontSize: "0.82rem", fontWeight: 700,
          padding: "0.22rem 1rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "inherit",
        }}>
          <span>GNU nano 5.4</span>
          <span>
            Portfolio.c
            {modified && (
              <span style={{ color: "#6b2e00" }}>&nbsp;&nbsp;[Modified]</span>
            )}
          </span>
          <span />
        </div>

        {/* ── Code body ── */}
        <div style={{ background: "#06060d", padding: "0.5rem 0", minHeight: 218 }}>
          <NLine n={1}><Inc c="#include" /> <St c="&lt;stdio.h&gt;" /></NLine>
          <NLine n={2} />
          <NLine n={3}><Kw c="int" /> <Fn c="main" />{"() {"}</NLine>
          <NLine n={4}>{"    "}<Kw c="char" />{" *name = "}<St c={'"???";'} /></NLine>

          {/* Edited printf line — purple left-border + teal tint while active */}
          <div style={{
            display: "flex", lineHeight: 1.82, fontSize: "0.87rem",
            background: "rgba(0,212,255,0.035)",
            borderLeft: (showECursor || isSave) ? "2px solid #7c3aed" : "2px solid transparent",
          }}>
            <span style={{
              minWidth: "3.4rem", textAlign: "right", paddingRight: "1.1rem",
              color: "#1e1e32", userSelect: "none", fontSize: "0.78rem", flexShrink: 0,
            }}>5</span>
            <span style={{ color: "#c8ccd8", whiteSpace: "pre", flex: 1 }}>
              {"    "}<Fn c="printf" />{"("}
              <St c={'"Hello World! I am %s"'} />
              {", "}
              <span style={{ color: editText.startsWith('"') ? "#f1fa8c" : "#c8ccd8" }}>
                {editText}
              </span>
              {showECursor && (
                <motion.span
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 0.72, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
                  style={{
                    display: "inline-block", width: "0.50em", height: "1.12em",
                    background: "#e8eaf4", verticalAlign: "text-bottom", marginLeft: 1,
                  }}
                />
              )}
              {");"}
            </span>
          </div>

          <NLine n={6}>{"    "}<Kw c="return" /> <Num c="0" />{";"}</NLine>
          <NLine n={7}>{"}"}</NLine>
          <NLine eof />
          <NLine eof />
        </div>

        {/* ── Gray status bar ── */}
        <div style={{
          background: "#c4c8d4", color: "#050510",
          fontSize: "0.79rem", fontWeight: 700,
          padding: "0.18rem 1rem", minHeight: "1.55rem",
          fontFamily: "inherit",
        }}>
          {statusContent ?? "\u00a0"}
        </div>

        {/* ── 3×2 shortcut grid ── */}
        <div style={{
          background: "#06060d",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderTop: "1px solid #0e0e1e",
        }}>
          {[
            ["^G", "Get Help"], ["^X", "Exit"],      ["^O", "Write Out"],
            ["^W", "Search"],   ["^K", "Cut Text"],  ["^U", "Paste"],
          ].map(([key, label]) => (
            <span key={key} style={{
              display: "flex", gap: "0.45rem", alignItems: "center",
              fontSize: "0.74rem", padding: "0.24rem 0.7rem",
              color: "#7880a0", fontFamily: "inherit",
            }}>
              <span style={{
                background: "#141428", color: "#e8eaf4",
                padding: "0 0.33rem", borderRadius: 2, fontSize: "0.73rem",
              }}>
                {key}
              </span>
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // ── Render: bash terminal ───────────────────────────────────────────────────

  const renderBash = () => (
    <div style={{
      padding: "16px 20px",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: 13, lineHeight: 1.75, color: "#d4d4d8",
    }}>
      {/* First failed run */}
      <div style={{ marginBottom: 4 }}>
        <Prompt />{"./portfolio"}
      </div>

      {/* ── Segfault: red + irregular glitter flicker via Framer Motion ── */}
      <motion.div
        animate={{ opacity: [1, 0.5, 1, 0.72, 1, 0.58, 1, 0.8, 1, 1] }}
        transition={{
          duration: 1.1,
          times:    [0, 0.07, 0.14, 0.26, 0.38, 0.52, 0.63, 0.78, 0.9, 1],
          repeat: Infinity,
          repeatDelay: 0.9,
        }}
        style={{
          color: "#ff3333",
          fontWeight: 700,
          fontSize: "0.95rem",
          textShadow: "0 0 14px rgba(255,40,40,0.6), 0 0 28px rgba(255,0,0,0.22)",
        }}
      >
        Segmentation Fault (Core dumped)
      </motion.div>

      <div style={{ color: "#ff7070", fontSize: "0.85rem", opacity: 0.82 }}>
        Error: Cannot access memory at 0x0000004D
      </div>

      {/* nano command */}
      {(["typing-nano", "compiling", "output"] as Phase[]).includes(phase) && (
        <div style={{ marginTop: 10 }}>
          <Prompt />
          <span style={{ color: phase === "typing-nano" ? "#d4d4d8" : "#52525b" }}>
            {nanoTyped}
          </span>
          {phase === "typing-nano" && <Cursor />}
        </div>
      )}

      {/* compile command */}
      {(["compiling", "output"] as Phase[]).includes(phase) && (
        <div>
          <Prompt />
          <span style={{ color: phase === "compiling" ? "#d4d4d8" : "#52525b" }}>
            {compileTyped}
          </span>
          {phase === "compiling" && <Cursor />}
        </div>
      )}

      {/* program output */}
      {phase === "output" && (
        <div style={{ marginTop: 10 }}>
          {outLen < OUTPUT_TEXT.length ? (
            <div>
              <span style={{ color: "#c8ccd8" }}>{OUTPUT_TEXT.slice(0, outLen)}</span>
              <Cursor color="#00d4ff" />
            </div>
          ) : (
            <div>
              <span style={{ color: "#c8ccd8" }}>Hello World! I am </span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ color: "#818cf8", fontWeight: 700, fontSize: 15 }}
              >
                MD. SHANJID AREFIN
              </motion.span>
            </div>
          )}
          {outputDone && (
            <div style={{ marginTop: 8 }}>
              <Prompt /><Cursor />
            </div>
          )}
        </div>
      )}

      {/* idle cursor during segfault */}
      {phase === "segfault" && (
        <div style={{ marginTop: 10 }}>
          <Prompt /><Cursor />
        </div>
      )}
    </div>
  );

  const isEditorPhase = (["editor", "fixing", "saving"] as Phase[]).includes(phase);

  // ─── Full render ──────────────────────────────────────────────────────────

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">

        {/* ── Terminal animation ── */}
        {phase !== "reveal" && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-2xl z-10"
          >
            {/* Skip button */}
            <button
              onClick={() => setPhase("reveal")}
              className="absolute -top-9 right-0 flex items-center gap-1.5 text-sky-400 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-zinc-200 text-xs font-mono transition-colors group"
            >
              <SkipForward size={12} className="group-hover:text-violet-400 transition-colors" />
              skip intro
            </button>

            {/* macOS terminal window */}
            <div
              className="rounded-xl overflow-hidden shadow-2xl shadow-black/60"
              style={{ border: "1px solid #3f3f46", background: "#18181b" }}
            >
              {/* Window chrome */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 14px", background: "#27272a",
                borderBottom: "1px solid #3f3f46",
              }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", opacity: 0.85 }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#eab308", opacity: 0.85 }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e", opacity: 0.85 }} />
                <span style={{ marginLeft: 10, color: "#71717a", fontSize: 12, fontFamily: "monospace" }}>
                  {isEditorPhase ? "nano — Portfolio.c" : "bash — user@portfolio"}
                </span>
              </div>

              {/* Body */}
              <div style={{ minHeight: 320 }}>
                {isEditorPhase ? renderEditor() : renderBash()}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Hero reveal — your original, unchanged ── */}
        {phase === "reveal" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 max-w-4xl w-full text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700/50 bg-white dark:bg-zinc-900/50 text-sky-700 dark:text-zinc-400 text-sm mb-8 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Briefcase size={13} />
              <span>{personalInfo.role} @ {personalInfo.company}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-sky-950 dark:text-zinc-100 leading-tight mb-4"
            >
              Hello World! I&apos;m{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                {personalInfo.name}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg sm:text-xl text-sky-700 dark:text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              {personalInfo.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex items-center justify-center gap-1.5 text-sky-500 dark:text-zinc-500 text-sm mb-10"
            >
              <MapPin size={14} className="text-violet-400" />
              <span>{personalInfo.location}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-12"
            >
              <a href="/#projects"
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5">
                View My Work
              </a>
              <a href="/#contact"
                className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-sky-800 dark:text-zinc-300 hover:text-sky-950 dark:text-zinc-100 font-medium rounded-lg transition-all duration-200 hover:bg-sky-100 bg-sky-100 dark:bg-zinc-800/50 hover:-translate-y-0.5">
                Get In Touch
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex items-center justify-center gap-4"
            >
              {[
                { href: personalInfo.github,            icon: <FaGithub size={20} />,       label: "GitHub"       },
                { href: personalInfo.linkedin,          icon: <FaLinkedin size={20} />,     label: "LinkedIn"     },
                { href: personalInfo.researchgate,      icon: <SiResearchgate size={20} />, label: "ResearchGate" },
                { href: personalInfo.medium,            icon: <SiMedium size={20} />,       label: "Medium"       },
                { href: personalInfo.blog,              icon: <Globe size={20} />,          label: "Blog"         },
                { href: `mailto:${personalInfo.email}`, icon: <Mail size={20} />,           label: "Email"        },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="p-2.5 text-sky-500 dark:text-zinc-500 hover:text-violet-400 hover:bg-sky-100 dark:bg-zinc-800 rounded-lg transition-all duration-200">
                  {icon}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "reveal" && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sky-400 dark:text-zinc-600 animate-bounce"
        >
          <ArrowDown size={20} />
        </motion.div>
      )}
    </section>
  );
}