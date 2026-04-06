"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Minus, Square } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Command map — extend this freely ─────────────────────────────────────────
const COMMANDS: Record<string, { target: string; description: string }> = {
  "cd /home":              { target: "/",              description: "Go to homepage"      },
  "cd /home/about":        { target: "/#about",        description: "About me"            },
  "cd /home/skills":       { target: "/#skills",       description: "Skills"              },
  "cd /home/experience":   { target: "/#experience",   description: "Work experience"     },
  "cd /home/projects":     { target: "/#projects",     description: "Projects"            },
  "cd /home/research":     { target: "/#publications", description: "Research"            },
  "cd /home/education":    { target: "/#education",    description: "Education"           },
  "cd /home/expertise":    { target: "/#expertise",    description: "Tech expertise"      },
  "cd /home/achievements": { target: "/#achievements", description: "Achievements"        },
  "cd /home/coding":       { target: "/#coding",       description: "Coding stats"        },
  "cd /home/blog":         { target: "/blog",          description: "Blog"                },
  "cd /home/contact":      { target: "/#contact",      description: "Contact me"          },
  "cd /home/osi":          { target: "/osi",           description: "OSI demo page"       },
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface HistoryEntry {
  id:      number;
  cmd:     string;
  output:  string;
  ok:      boolean;
  isInfo?: boolean;
}

// ── Prompt component ──────────────────────────────────────────────────────────
function Prompt() {
  return (
    <span className="shrink-0 select-none font-mono text-sm">
      <span className="text-emerald-500 dark:text-emerald-400">visitor</span>
      <span className="text-sky-400 dark:text-zinc-500">@</span>
      <span className="text-violet-600 dark:text-violet-400">shanjid-portfolio</span>
      <span className="text-sky-400 dark:text-zinc-500">:~$ </span>
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FloatingTerminal() {
  const router                          = useRouter();
  const [isOpen, setIsOpen]             = useState(false);
  const [isMinimized, setIsMinimized]   = useState(false);
  const [input, setInput]               = useState("");
  const [history, setHistory]           = useState<HistoryEntry[]>([]);
  const [cmdHistory, setCmdHistory]     = useState<string[]>([]);
  const [histIdx, setHistIdx]           = useState(-1);
  const [redirecting, setRedirecting]   = useState(false);
  const [idCounter, setIdCounter]       = useState(0);
  const inputRef                        = useRef<HTMLInputElement>(null);
  const bodyRef                         = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal body (not the page) when history grows
  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, isMinimized]);

  const newId = useCallback(() => {
    setIdCounter(c => c + 1);
    return idCounter;
  }, [idCounter]);

  const addEntry = useCallback((entry: Omit<HistoryEntry, "id">) => {
    setHistory(prev => [...prev, { ...entry, id: Date.now() + Math.random() }]);
  }, []);

  const execute = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setCmdHistory(prev => [cmd, ...prev]);
    setHistIdx(-1);

    // ── built-in commands ──
    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    if (cmd === "help" || cmd === "?") {
      addEntry({ cmd: raw, ok: true, isInfo: true, output:
        Object.entries(COMMANDS)
          .map(([c, { description }]) => `  ${c.padEnd(28)} # ${description}`)
          .join("\n") +
        "\n  ─────────────────────────────────────────" +
        "\n  top                          # Scroll to top of page" +
        "\n  bottom                       # Scroll to bottom of page" +
        "\n  date                         # Show current date & time" +
        "\n  uname                        # System information" +
        "\n  history                      # Command history" +
        "\n  echo <text>                  # Print text" +
        "\n  open <url>                   # Open URL in new tab" +
        "\n  neofetch                     # System overview" +
        "\n  man                          # Full manual" +
        "\n  clear / Ctrl+L               # Clear terminal" +
        "\n  exit / quit                  # Close terminal" +
        "\n  help                         # This message"
      });
      setInput("");
      return;
    }

    if (cmd === "whoami") {
      addEntry({ cmd: raw, ok: true, output: "visitor — guest session on shanjid's portfolio" });
      setInput("");
      return;
    }

    if (cmd === "ls") {
      addEntry({ cmd: raw, ok: true, isInfo: true, output:
        "about/  skills/  experience/  projects/  research/\neducation/  expertise/  achievements/  coding/  blog/  contact/"
      });
      setInput("");
      return;
    }

    if (cmd === "pwd") {
      addEntry({ cmd: raw, ok: true, output: "/home/visitor" });
      setInput("");
      return;
    }

    if (cmd === "exit" || cmd === "quit") {
      setInput("");
      setTimeout(() => setIsOpen(false), 300);
      addEntry({ cmd: raw, ok: true, output: "Closing terminal..." });
      return;
    }

    if (cmd === "top" || cmd === "scroll top" || cmd === "go top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      addEntry({ cmd: raw, ok: true, output: "Scrolled to top." });
      setInput("");
      return;
    }

    if (cmd === "bottom" || cmd === "scroll bottom" || cmd === "go bottom") {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      addEntry({ cmd: raw, ok: true, output: "Scrolled to bottom." });
      setInput("");
      return;
    }

    if (cmd === "date") {
      addEntry({ cmd: raw, ok: true, output: new Date().toString() });
      setInput("");
      return;
    }

    if (cmd === "uname" || cmd === "uname -a") {
      addEntry({ cmd: raw, ok: true, isInfo: true, output:
        "PortfolioOS 1.0.0 — Next.js 16 · TypeScript · Tailwind v4\n" +
        "Arch: web · Kernel: react-18 · Shell: bash (portfolio edition)"
      });
      setInput("");
      return;
    }

    if (cmd === "history") {
      if (cmdHistory.length === 0) {
        addEntry({ cmd: raw, ok: true, output: "No commands in history yet." });
      } else {
        addEntry({ cmd: raw, ok: true, isInfo: true, output:
          cmdHistory
            .slice()
            .reverse()
            .map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`)
            .join("\n")
        });
      }
      setInput("");
      return;
    }

    if (cmd.startsWith("echo ")) {
      addEntry({ cmd: raw, ok: true, output: raw.slice(5) });
      setInput("");
      return;
    }

    if (cmd.startsWith("open ")) {
      const url = raw.trim().slice(5).trim();
      if (url.startsWith("http://") || url.startsWith("https://")) {
        window.open(url, "_blank", "noopener,noreferrer");
        addEntry({ cmd: raw, ok: true, output: `Opening ${url}...` });
      } else {
        addEntry({ cmd: raw, ok: false, output: `open: invalid URL — must start with http:// or https://` });
      }
      setInput("");
      return;
    }

    if (cmd === "man" || cmd === "man help") {
      addEntry({ cmd: raw, ok: true, isInfo: true, output:
        "PORTFOLIO TERMINAL MANUAL\n" +
        "─────────────────────────────────────────────\n" +
        "NAVIGATION\n" +
        "  cd /home/<section>   Navigate to a section\n" +
        "  ls                   List all sections\n" +
        "  pwd                  Print working directory\n\n" +
        "SCROLL\n" +
        "  top                  Scroll to top of page\n" +
        "  bottom               Scroll to bottom of page\n\n" +
        "SYSTEM\n" +
        "  date                 Show current date & time\n" +
        "  uname                Show system information\n" +
        "  history              Show command history\n" +
        "  echo <text>          Print text to terminal\n" +
        "  open <url>           Open a URL in new tab\n\n" +
        "TERMINAL\n" +
        "  clear / Ctrl+L       Clear terminal\n" +
        "  exit / quit          Close terminal\n" +
        "  help                 Quick command list\n" +
        "  man                  This manual\n\n" +
        "KEYBOARD\n" +
        "  Tab                  Autocomplete command\n" +
        "  ↑ / ↓               Browse command history"
      });
      setInput("");
      return;
    }

    if (cmd === "neofetch") {
      addEntry({ cmd: raw, ok: true, isInfo: true, output:
        "        /\\         visitor@shanjid\n" +
        "       /  \\        ───────────────\n" +
        "      / /\\ \\       OS: PortfolioOS · Next.js 16\n" +
        "     / /  \\ \\      Host: shanjidarefin.vercel.app\n" +
        "    / /    \\ \\     Shell: bash (portfolio edition)\n" +
        "   / / /\\   \\ \\    Stack: TypeScript · Tailwind v4\n" +
        "  /_/  \\_\\   \\_\\   Role: Software R&D Engineer\n" +
        "                   Company: Shanghai BDCOM\n" +
        "                   Degree: B.Sc CSE · KUET '24"
      });
      setInput("");
      return;
    }

    // ── navigation commands ──
    const match = COMMANDS[cmd];
    if (match) {
      addEntry({ cmd: raw, ok: true, output: `Navigating to ${match.target}...` });
      setRedirecting(true);
      setInput("");
      setTimeout(() => {
        router.push(match.target);
        setRedirecting(false);
        setTimeout(() => setIsOpen(false), 400);
      }, 600);
      return;
    }

    // ── unknown command ──
    addEntry({
      cmd: raw,
      ok:  false,
      output: `bash: ${cmd}: command not found. Type 'help' to see available commands.`,
    });
    setInput("");
  }, [addEntry, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      execute(input);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next] ?? "");
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      // Tab autocomplete
      const partial = input.trim().toLowerCase();
      const match   = Object.keys(COMMANDS).find(c => c.startsWith(partial));
      if (match) setInput(match);
      return;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
      return;
    }
  };

  return (
    <>
      {/* ── Floating trigger button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,  scale: 1   }}
            exit={{    opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed bottom-6 left-6 z-50",
              "flex items-center gap-2.5 px-4 py-2.5 rounded-xl",
              "bg-zinc-900 dark:bg-zinc-950 border border-zinc-700 dark:border-zinc-800",
              "text-emerald-400 hover:text-emerald-300",
              "hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10",
              "transition-all duration-200 group"
            )}
          >
            <Terminal size={15} className="group-hover:scale-110 transition-transform" />
            <span className="font-mono text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
              visitor@shanjid-portfolio:~$
            </span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="inline-block w-1.5 h-3.5 bg-emerald-400 rounded-sm"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Floating terminal window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className={cn(
              "fixed bottom-6 left-6 z-50 w-[min(560px,calc(100vw-48px))]",
              "rounded-2xl overflow-hidden",
              "border border-zinc-700/80 dark:border-zinc-800",
              "shadow-2xl shadow-black/40 dark:shadow-black/60",
              isMinimized ? "h-auto" : ""
            )}
          >
            {/* ── Window chrome ── */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-950 border-b border-zinc-800">
              {/* Traffic lights */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center group"
                title="Close"
              >
                <X size={7} className="opacity-0 group-hover:opacity-100 text-red-900" />
              </button>
              <button
                onClick={() => setIsMinimized(m => !m)}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors flex items-center justify-center group"
                title="Minimize"
              >
                <Minus size={7} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
              </button>
              <button
                onClick={() => {}}
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors flex items-center justify-center group"
                title="Expand (coming soon)"
              >
                <Square size={6} className="opacity-0 group-hover:opacity-100 text-green-900" />
              </button>

              {/* Title */}
              <div className="flex-1 text-center">
                <span className="font-mono text-xs text-zinc-500">
                  visitor@shanjid-portfolio — bash
                </span>
              </div>

              {/* Close text button */}
              <button
                onClick={() => setIsOpen(false)}
                className="font-mono text-xs text-zinc-600 hover:text-zinc-400 transition-colors px-1"
              >
                exit
              </button>
            </div>

            {/* ── Terminal body (hidden when minimized) ── */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0   }}
                  animate={{ height: "auto" }}
                  exit={{    height: 0   }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    ref={bodyRef}
                    className="bg-zinc-950 p-4 h-64 overflow-y-auto cursor-text font-mono text-sm"
                    onClick={() => inputRef.current?.focus()}
                  >
                    {/* Welcome message */}
                    {history.length === 0 && (
                      <div className="text-zinc-300 text-xs mb-3 space-y-0.5">
                        <div>Welcome to <span className="text-violet-400">MD SHANJID AREFIN</span>&apos;s portfolio terminal.</div>
                        <div>Type <span className="text-yellow-400 font-bold">help</span> for commands · <span className="text-yellow-400 font-bold">ls</span> to list sections · <span className="text-yellow-400 font-bold">Tab</span> to autocomplete</div>
                        <div className="text-zinc-700">────────────────────────────────────</div>
                      </div>
                    )}

                    {/* History */}
                    {history.map((entry) => (
                      <div key={entry.id} className="mb-2">
                        {/* Command line */}
                        <div className="flex items-center gap-0">
                          <Prompt />
                          <span className="text-zinc-200">{entry.cmd}</span>
                        </div>
                        {/* Output */}
                        {entry.output && (
                          <div className={cn(
                            "mt-0.5 whitespace-pre-wrap text-xs leading-relaxed pl-1",
                            entry.isInfo
                              ? "text-sky-400 dark:text-sky-500"
                              : entry.ok
                              ? "text-emerald-400"
                              : "text-red-400"
                          )}>
                            {!entry.ok && <span className="mr-1">✗</span>}
                            {entry.ok && !entry.isInfo && <span className="mr-1">→</span>}
                            {entry.output}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Active input */}
                    {!redirecting ? (
                      <div className="flex items-center">
                        <Prompt />
                        <input
                          ref={inputRef}
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="flex-1 bg-transparent outline-none text-zinc-100 caret-violet-400 text-sm font-mono"
                          spellCheck={false}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                        />
                      </div>
                    ) : (
                      <motion.div
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-emerald-400 text-xs font-mono"
                      >
                        redirecting...
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}