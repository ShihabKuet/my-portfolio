"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ── Command map ───────────────────────────────────────────────────────────────
const COMMANDS: Record<string, string> = {
  "cd /home":             "/",
  "cd /home/blog":        "/blog",
  "cd /home/about":       "/#about",
  "cd /home/projects":    "/#projects",
  "cd /home/contact":     "/#contact",
  "cd /home/experience":  "/#experience",
  "cd /home/skills":      "/#skills",
  "cd /home/education":   "/#education",
  "cd /home/research":    "/#publications",
  "cd /home/coding":      "/#coding",
  "cd /home/expertise":   "/#expertise",
  "cd /home/achievements":"/#achievements",
  "clear":                "__clear__",
};

// ── Glitch text component ─────────────────────────────────────────────────────
function GlitchText({ text, className }: { text: string; className?: string }) {
  const [glitched, setGlitched] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitched(true);
      setTimeout(() => setGlitched(false), 120);
    }, 2800 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      {text}
      {glitched && (
        <>
          <span className="absolute inset-0 text-red-500 dark:text-red-400 translate-x-0.5 opacity-80">
            {text}
          </span>
          <span className="absolute inset-0 text-cyan-400 dark:text-cyan-300 -translate-x-0.5 opacity-60">
            {text}
          </span>
        </>
      )}
    </span>
  );
}

// ── Animated hex address ──────────────────────────────────────────────────────
function HexAddress() {
  const [addr, setAddr] = useState("0x00000000");

  useEffect(() => {
    const iv = setInterval(() => {
      const hex = Math.floor(Math.random() * 0xFFFFFFFF)
        .toString(16).toUpperCase().padStart(8, "0");
      setAddr(`0x${hex}`);
    }, 120);
    return () => clearInterval(iv);
  }, []);

  return (
    <span className="font-mono text-red-500 dark:text-red-400 font-bold">
      {addr}
    </span>
  );
}

// ── Typewriter ────────────────────────────────────────────────────────────────
function Typewriter({ lines, onDone }: {
  lines: { text: string; color: string }[];
  onDone: () => void;
}) {
  const [lineIdx, setLineIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [displayed, setDisplayed] = useState<{ text: string; color: string }[]>([]);

  useEffect(() => {
    if (lineIdx >= lines.length) { onDone(); return; }
    const line = lines[lineIdx];
    if (charIdx <= line.text.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev];
          next[lineIdx] = { text: line.text.slice(0, charIdx), color: line.color };
          return next;
        });
        setCharIdx(c => c + 1);
      }, charIdx === 0 ? 400 : 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx, lines, onDone]);

  return (
    <div className="space-y-1">
      {displayed.map((line, i) => line && (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-mono text-sm"
          style={{ color: line.color }}
        >
          {line.text}
          {i === lineIdx && charIdx <= lines[i]?.text.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-3.5 bg-current ml-0.5 align-middle"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ── Terminal input ────────────────────────────────────────────────────────────
function Terminal() {
  const router                      = useRouter();
  const [input, setInput]           = useState("");
  const [history, setHistory]       = useState<{ cmd: string; result: string; ok: boolean }[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx]       = useState(-1);
  const [redirecting, setRedirecting] = useState(false);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const bottomRef                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const execute = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setCmdHistory(prev => [cmd, ...prev]);
    setHistIdx(-1);

    if (cmd === "clear" || cmd === "__clear__") {
      setHistory([]);
      setInput("");
      return;
    }

    if (cmd === "help") {
      setHistory(prev => [...prev, {
        cmd: raw,
        result: "Available: cd /home, cd /home/blog, cd /home/projects, cd /home/contact, cd /home/skills, cd /home/experience, cd /home/education, cd /home/research, cd /home/coding, cd /home/expertise, cd /home/achievements, clear, help",
        ok: true,
      }]);
      setInput("");
      return;
    }

    const target = COMMANDS[cmd];
    if (target) {
      if (target === "__clear__") { setHistory([]); setInput(""); return; }
      setHistory(prev => [...prev, {
        cmd: raw,
        result: `Navigating to ${target}...`,
        ok: true,
      }]);
      setRedirecting(true);
      setTimeout(() => router.push(target), 800);
    } else {
      setHistory(prev => [...prev, {
        cmd: raw,
        result: `bash: ${cmd}: command not found. Type 'help' to see available commands.`,
        ok: false,
      }]);
    }
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { execute(input); return; }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next] ?? "");
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden border border-sky-200 dark:border-zinc-700/50 shadow-xl shadow-sky-200/40 dark:shadow-black/50"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-sky-100 dark:bg-zinc-900 border-b border-sky-200 dark:border-zinc-800">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-3 text-xs font-mono text-sky-500 dark:text-zinc-500">
          bash — recovery terminal
        </span>
      </div>

      {/* Terminal body */}
      <div
        className="bg-white dark:bg-zinc-950 p-4 min-h-[180px] max-h-64 overflow-y-auto cursor-text"
      >
        {/* Welcome line */}
        <div className="font-mono text-xs text-sky-400 dark:text-zinc-600 mb-3">
          Recovery shell — type &apos;help&apos; for commands, ↑↓ for history
        </div>

        {/* Command history */}
        <AnimatePresence>
          {history.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2"
            >
              <div className="flex items-center gap-1 font-mono text-sm">
                <span className="text-emerald-600 dark:text-emerald-400">visitor</span>
                <span className="text-sky-400 dark:text-zinc-600">@</span>
                <span className="text-violet-600 dark:text-violet-400">404</span>
                <span className="text-sky-400 dark:text-zinc-600">:~$</span>
                <span className="text-sky-800 dark:text-zinc-200 ml-1">{entry.cmd}</span>
              </div>
              <div className={`font-mono text-xs ml-1 mt-0.5 ${
                entry.ok
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}>
                {entry.ok ? "→" : "✗"} {entry.result}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Active input line */}
        {!redirecting && (
          <div className="flex items-center gap-1 font-mono text-sm">
            <span className="text-emerald-600 dark:text-emerald-400">visitor</span>
            <span className="text-sky-400 dark:text-zinc-600">@</span>
            <span className="text-violet-600 dark:text-violet-400">404</span>
            <span className="text-sky-400 dark:text-zinc-600">:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="flex-1 bg-transparent outline-none ml-1 text-sky-900 dark:text-zinc-100 caret-violet-500"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
            />
          </div>
        )}

        {redirecting && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            className="font-mono text-sm text-emerald-600 dark:text-emerald-400"
          >
            Redirecting...
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ── Main 404 page ─────────────────────────────────────────────────────────────
export default function NotFound() {
  const [bootDone, setBootDone] = useState(false);

  const bootLines = [
    { text: "KERNEL: Segmentation Fault (core dumped)",                       color: "#ef4444" },
    { text: "SIGSEGV received — invalid memory access detected",              color: "#f87171" },
    { text: `Attempted read at: [RANDOMIZING...]`,                            color: "#f87171" },
    { text: "Stack trace:",                                                   color: "#6b7280" },
    { text: "  #0  0x00007f4a2b1c3d80 in __http_route_resolve ()",           color: "#52525b" },
    { text: "  #1  0x00007f4a2b1c4120 in router_navigate (url=0x404)",       color: "#52525b" },
    { text: "  #2  0x00007f4a2b1c5000 in browser_request_handler ()",        color: "#52525b" },
    { text: "ERROR: URL does not exist in page table",                        color: "#fb923c" },
    { text: "HINT:  Use recovery terminal below to navigate safely.",         color: "#4ade80" },
  ];

  return (
    <main className="min-h-screen bg-sky-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4 py-16 overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-400/5 dark:bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-400/8 dark:bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl z-10">

        {/* ── 404 headline ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {/* Big 404 */}
          <div className="relative inline-block mb-2">
            <GlitchText
              text="404"
              className="text-[7rem] sm:text-[10rem] font-black font-mono text-sky-100 dark:text-zinc-900 leading-none select-none"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[7rem] sm:text-[10rem] font-black font-mono leading-none text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-700 dark:from-red-400 dark:to-red-600 opacity-20 select-none">
                404
              </span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-sky-900 dark:text-zinc-200 mb-2">
            Page Not Found
          </h1>

          {/* Segfault badge — own line below 404 and title */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-400/30 dark:border-red-500/30 mb-4"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            <span className="font-mono text-sm font-bold text-red-600 dark:text-red-400">
              Segmentation Fault (core dumped)
            </span>
          </motion.div>

          <p className="text-sky-600 dark:text-zinc-500 text-sm font-mono">
            Tried to dereference null pointer at <HexAddress />
          </p>
        </motion.div>

        {/* ── Kernel panic terminal ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-xl overflow-hidden border border-sky-200 dark:border-zinc-800 mb-6 shadow-lg shadow-sky-100/50 dark:shadow-black/30"
        >
          {/* Chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-sky-100 dark:bg-zinc-900 border-b border-sky-200 dark:border-zinc-800">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-40" />
            <div className="w-3 h-3 rounded-full bg-green-400 opacity-40" />
            <span className="ml-3 text-xs font-mono text-sky-500 dark:text-zinc-500">
              kernel panic — not syncing
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-red-500"
              />
              <span className="text-xs font-mono text-red-500 dark:text-red-400">CRASH</span>
            </div>
          </div>

          {/* Boot log */}
          <div className="bg-white dark:bg-zinc-950 p-4 min-h-[180px]">
            <Typewriter lines={bootLines} onDone={() => setBootDone(true)} />

            {/* Blinking cursor after typewriter done */}
            {bootDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 mt-2 font-mono text-sm text-sky-500 dark:text-zinc-600"
              >
                <span>System halted.</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-2 h-3.5 bg-sky-400 dark:bg-zinc-600 ml-0.5 align-middle"
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── Suggestion text ── */}
        <AnimatePresence>
          {bootDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-3"
            >
              <div className="rounded-lg bg-sky-100/80 dark:bg-zinc-900/50 border border-sky-200 dark:border-zinc-800/50 px-4 py-3 mb-3">
                <p className="text-sky-600 dark:text-zinc-500 text-xs font-mono mb-2">
                  # recovery suggestions:
                </p>
                <div className="grid sm:grid-cols-2 gap-1.5">
                  {[
                    { cmd: "cd /home",              desc: "→ Go to homepage"     },
                    { cmd: "cd /home/blog",          desc: "→ Go to blog"         },
                    { cmd: "cd /home/projects",      desc: "→ Go to projects"     },
                    { cmd: "cd /home/contact",       desc: "→ Get in touch"       },
                    { cmd: "cd /home/experience",    desc: "→ Work experience"    },
                    { cmd: "cd /home/skills",        desc: "→ Skills"             },
                  ].map(({ cmd, desc }) => (
                    <div key={cmd} className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-violet-600 dark:text-violet-400 font-bold">{cmd}</span>
                      <span className="text-sky-500 dark:text-zinc-600">{desc}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sky-500 dark:text-zinc-600 text-xs font-mono mt-2">
                  Type &apos;help&apos; for all commands · ↑↓ arrow keys for command history
                </p>
              </div>

              {/* Recovery terminal */}
              <Terminal />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}