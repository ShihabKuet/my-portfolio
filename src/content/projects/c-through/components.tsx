"use client";

import { useState } from "react";

const features = [
  {
    id: "callgraph",
    icon: "⬡",
    title: "Interactive Call Graph",
    color: "#58a6ff",
    short: "See how every function connects — visually.",
    detail:
      "A live node graph showing caller and callee relationships across your entire codebase. Pan, zoom, collapse subtrees, switch layouts, search nodes, and navigate history. Click any node to jump to that function's source.",
    tags: ["Pan & Zoom", "Top→Down / Left→Right", "Back/Forward History", "Node Search", "Collapse Subtrees"],
  },
  {
    id: "sidebar",
    icon: "🌳",
    title: "Relational Sidebar",
    color: "#3fb950",
    short: "Every file broken down into a structured tree.",
    detail:
      "The Explorer sidebar gets a new C Through panel. Every file is organized into expandable sections: Includes, Structs, Macros, Global Variables, and Functions — each with callers, callees, fields, and metadata. Everything is clickable.",
    tags: ["Includes", "Structs & Types", "Macros", "Global Variables", "Functions"],
  },
  {
    id: "globals",
    icon: "🌐",
    title: "Global Variable Tracker",
    color: "#d29922",
    short: "Know exactly where every global is touched.",
    detail:
      "Expand any global variable and see a complete cross-file breakdown: where it's defined, where it's declared extern, every function that writes it, reads it, passes it as an argument, or takes its address — with exact file and line.",
    tags: ["Written", "Read", "Extern Declared", "Address Taken", "Passed as Arg"],
  },
  {
    id: "codelens",
    icon: "💡",
    title: "CodeLens Inline Metrics",
    color: "#bc8cff",
    short: "Live metrics floating above every function.",
    detail:
      "Without opening any panel, you see caller count, callee count, cyclomatic complexity (green/yellow/red), which files reference this function, and dead code warnings — all above the function definition, all clickable.",
    tags: ["Caller Count", "Callee Count", "Complexity Score", "Dead Code Warning", "Cross-file Files"],
  },
  {
    id: "deadcode",
    icon: "☠",
    title: "Dead Code Report",
    color: "#f85149",
    short: "Find every unused piece of code in your project.",
    detail:
      "A full analysis panel showing unused functions, write-only globals, unused macros, and unresolved extern declarations. Each finding has severity, confidence, reason, and a direct link to source. Filter, tab by category, jump to line.",
    tags: ["Unused Functions", "Write-only Globals", "Unused Macros", "Unresolved Externs", "Severity Ratings"],
  },
  {
    id: "search",
    icon: "🔍",
    title: "Search & Filter",
    color: "#76e3ea",
    short: "Find anything, instantly.",
    detail:
      "Search the sidebar to filter functions and globals by name. Search inside the call graph to highlight matching nodes and dim everything else. Both search fields persist across panel re-opens.",
    tags: ["Sidebar Filter", "Graph Node Search", "Instant Results", "Persistent State"],
  },
];

const complexityData = [
  { name: "hal_init",       complexity: 3,  color: "#3fb950" },
  { name: "process_packet", complexity: 11, color: "#d29922" },
  { name: "parse_config",   complexity: 7,  color: "#3fb950" },
  { name: "tcp_handler",    complexity: 22, color: "#f85149" },
  { name: "crc_check",      complexity: 4,  color: "#3fb950" },
  { name: "auth_validate",  complexity: 15, color: "#d29922" },
];

function ComplexityBar({ name, complexity, color }: { name: string; complexity: number; color: string }) {
  const max   = 25;
  const width = Math.min((complexity / max) * 100, 100);
  const label = complexity <= 9 ? "Simple" : complexity <= 19 ? "High" : "Critical";

  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      <span className="w-28 truncate text-right text-[#8b949e]">{name}</span>
      <div className="flex-1 h-4 rounded-sm overflow-hidden bg-white/5">
        <div
          className="h-full rounded-sm transition-all duration-700 flex items-center justify-end pr-1"
          style={{ width: `${width}%`, backgroundColor: color + "88", border: `1px solid ${color}` }}
        >
          <span style={{ color }} className="text-[9px] font-bold">{complexity}</span>
        </div>
      </div>
      <span className="w-14 text-[#8b949e] opacity-60">{label}</span>
    </div>
  );
}

function CallGraphMini() {
  const nodes = [
    { id: "root", label: "main",        x: 200, y: 30,  color: "#58a6ff", isRoot: true  },
    { id: "a",    label: "init_system", x: 100, y: 110, color: "#3fb950", isRoot: false },
    { id: "b",    label: "run_loop",    x: 300, y: 110, color: "#3fb950", isRoot: false },
    { id: "c",    label: "hal_init",    x: 50,  y: 190, color: "#3fb950", isRoot: false },
    { id: "d",    label: "load_config", x: 160, y: 190, color: "#3fb950", isRoot: false },
    { id: "e",    label: "process",     x: 260, y: 190, color: "#3fb950", isRoot: false },
    { id: "f",    label: "legacy_fn",   x: 370, y: 190, color: "#f85149", isRoot: false },
  ];
  const edges = [
    ["root", "a"], ["root", "b"],
    ["a", "c"],    ["a", "d"],
    ["b", "e"],    ["b", "f"],
  ];
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg viewBox="0 0 420 230" className="w-full h-full" style={{ fontFamily: "monospace" }}>
      {edges.map(([from, to], i) => {
        const s  = nodeMap[from];
        const t  = nodeMap[to];
        const my = (s.y + t.y) / 2;
        return (
          <path
            key={i}
            d={`M${s.x},${s.y + 14} C${s.x},${my} ${t.x},${my} ${t.x},${t.y - 14}`}
            fill="none"
            stroke="#30363d"
            strokeWidth="1.5"
          />
        );
      })}
      {nodes.map((n) => (
        <g key={n.id} transform={`translate(${n.x},${n.y})`}>
          <circle
            r="13"
            fill={n.color + "22"}
            stroke={n.color}
            strokeWidth={n.isRoot ? 2.5 : 1.5}
            style={n.isRoot ? { filter: "drop-shadow(0 0 6px " + n.color + "88)" } : {}}
          />
          <text textAnchor="middle" dominantBaseline="central" fill={n.color} fontSize="9" fontWeight="bold">
            {n.label[0].toUpperCase()}
          </text>
          <text textAnchor="middle" y="22" fill="#8b949e" fontSize="7">
            {n.label.length > 10 ? n.label.slice(0, 10) + "…" : n.label}
          </text>
          {n.id === "f" && (
            <text textAnchor="middle" y="-20" fill="#f85149" fontSize="7">
              💀 dead
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export default function FeatureGrid() {
  const [active, setActive] = useState("callgraph");
  const current = features.find((f) => f.id === active)!;

  return (
    <div className="my-8 not-prose">

      {/* ── Feature selector tabs ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={[
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-150 border",
              active === f.id
                ? ""
                /* inactive: adapts to light / dark */
                : "border-zinc-300 dark:border-[#30363d] text-zinc-500 dark:text-[#8b949e] hover:border-zinc-400 dark:hover:border-[#8b949e]",
            ].join(" ")}
            style={
              active === f.id
                ? { backgroundColor: f.color + "22", borderColor: f.color, color: f.color }
                : undefined
            }
          >
            <span>{f.icon}</span>
            <span>{f.title}</span>
          </button>
        ))}
      </div>

      {/* ── Feature detail card ── */}
      <div
        className="rounded-xl border p-6 mb-6 transition-all duration-300"
        style={{
          borderColor:     current.color + "55",
          backgroundColor: current.color + "10",
        }}
      >
        <div className="flex items-start gap-4">
          <span className="text-3xl mt-1">{current.icon}</span>
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-bold font-mono mb-1"
              style={{ color: current.color }}
            >
              {current.title}
            </h3>
            {/* Description: dark text in light mode, muted in dark mode */}
            <p className="text-sm text-zinc-600 dark:text-[#8b949e] leading-relaxed mb-4">
              {current.detail}
            </p>
            <div className="flex flex-wrap gap-2">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded font-mono"
                  style={{
                    backgroundColor: current.color + "18",
                    color:           current.color,
                    border:          `1px solid ${current.color}44`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Live visualisations ── */}
      {/*
        The two VS Code mock panels keep their dark backgrounds intentionally —
        they represent a dark IDE and look great on both light and dark pages.
        Only the border is softened for light mode visibility.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Left panel */}
        <div className="rounded-xl border border-zinc-300 dark:border-[#30363d] bg-[#0d1117] overflow-hidden shadow-md dark:shadow-none">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#30363d] bg-[#161b22]">
            <span className="text-[10px] font-mono text-[#58a6ff]">⬡ C Through</span>
            <span className="ml-auto text-[9px] text-[#8b949e] font-mono">
              {active === "callgraph" ? "Call Graph — main()" : active === "globals" ? "Global: g_counter" : "Sidebar Tree"}
            </span>
          </div>

          <div className="p-4 h-52 flex items-center justify-center">

            {(active === "callgraph" || active === "sidebar" || active === "search") && (
              <CallGraphMini />
            )}

            {active === "globals" && (
              <div className="w-full font-mono text-xs space-y-1.5">
                {[
                  { icon: "📝", label: "Defined",        val: "main.c : 12",             color: "#58a6ff" },
                  { icon: "📤", label: "Extern declared", val: "driver.c : 5",            color: "#8b949e" },
                  { icon: "✏️", label: "Written",         val: "reset() — main.c : 45",   color: "#f85149" },
                  { icon: "✏️", label: "Written",         val: "init() — utils.c : 22",   color: "#f85149" },
                  { icon: "👁",  label: "Read",            val: "display() — ui.c : 88",   color: "#3fb950" },
                  { icon: "👁",  label: "Read",            val: "check() — validate.c:33", color: "#3fb950" },
                  { icon: "📌", label: "Address taken",   val: "setup() — init.c : 20",   color: "#d29922" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 cursor-pointer">
                    <span>{r.icon}</span>
                    <span className="w-28 text-[#8b949e]">{r.label}</span>
                    <span style={{ color: r.color }}>{r.val}</span>
                  </div>
                ))}
              </div>
            )}

            {active === "codelens" && (
              <div className="w-full font-mono text-xs space-y-3">
                {[
                  { name: "process_packet",  callers: 4, calls: 7, complexity: 11, compColor: "#d29922", files: "main.c, driver.c" },
                  { name: "hal_init",        callers: 1, calls: 3, complexity: 3,  compColor: "#3fb950", files: "main.c"           },
                  { name: "legacy_handler",  callers: 0, calls: 2, complexity: 6,  compColor: "#3fb950", files: ""                 },
                ].map((fn, i) => (
                  <div key={i}>
                    <div className="text-[#8b949e] text-[10px] mb-0.5 flex flex-wrap gap-2">
                      <span className="text-[#58a6ff]">↑ {fn.callers} caller{fn.callers !== 1 ? "s" : ""}</span>
                      <span className="text-[#3fb950]">↓ {fn.calls} calls</span>
                      <span style={{ color: fn.compColor }}>⚡ complexity: {fn.complexity}</span>
                      {fn.files && <span className="text-[#8b949e]">📄 {fn.files}</span>}
                      {fn.callers === 0 && <span className="text-[#f85149]">⚠ dead code</span>}
                    </div>
                    <div className="text-[#e6edf3]">
                      <span className="text-[#d29922]">int </span>
                      <span className="text-[#58a6ff]">{fn.name}</span>
                      <span className="text-[#8b949e]">(...) {"{"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {active === "deadcode" && (
              <div className="w-full font-mono text-xs">
                <div className="flex gap-2 text-[9px] text-[#8b949e] border-b border-[#30363d] pb-1 mb-2">
                  <span className="w-28">Name</span>
                  <span className="w-16">Severity</span>
                  <span className="flex-1">Reason</span>
                </div>
                {[
                  { name: "legacy_fn",   sev: "High",   sevColor: "#f85149", reason: "Static, no callers"  },
                  { name: "debug_dump",  sev: "High",   sevColor: "#f85149", reason: "No callers found"    },
                  { name: "g_old_flag",  sev: "Medium", sevColor: "#d29922", reason: "Never read"          },
                  { name: "MAX_RETRY",   sev: "Low",    sevColor: "#3fb950", reason: "Macro never used"    },
                  { name: "g_extern_x",  sev: "Info",   sevColor: "#8b949e", reason: "No definition found" },
                ].map((r, i) => (
                  <div key={i} className="flex gap-2 py-1 items-center hover:bg-white/5 cursor-pointer rounded px-1">
                    <span className="w-28 text-[#58a6ff]">{r.name}</span>
                    <span
                      className="w-16 text-[9px] px-1.5 py-0.5 rounded font-bold"
                      style={{ color: r.sevColor, backgroundColor: r.sevColor + "22", border: `1px solid ${r.sevColor}44` }}
                    >
                      {r.sev}
                    </span>
                    <span className="flex-1 text-[#8b949e] truncate">{r.reason}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — complexity chart */}
        <div className="rounded-xl border border-zinc-300 dark:border-[#30363d] bg-[#0d1117] overflow-hidden shadow-md dark:shadow-none">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#30363d] bg-[#161b22]">
            <span className="text-[10px] font-mono text-[#58a6ff]">⚡ Complexity Analysis</span>
            <span className="ml-auto text-[9px] text-[#8b949e] font-mono">cyclomatic score</span>
          </div>
          <div className="p-4 h-52 flex flex-col justify-center gap-2">
            {complexityData.map((d) => (
              <ComplexityBar key={d.name} {...d} />
            ))}
            <div className="flex gap-4 mt-2 text-[9px] font-mono">
              <span style={{ color: "#3fb950" }}>● Simple (1-9)</span>
              <span style={{ color: "#d29922" }}>● High (10-19)</span>
              <span style={{ color: "#f85149" }}>● Critical (20+)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar — fully adaptive ── */}
      <div className="mt-4 rounded-xl border border-zinc-200 dark:border-[#30363d] bg-zinc-50 dark:bg-[#161b22] px-6 py-4">
        <div className="flex flex-wrap gap-8 justify-center">
          {[
            { label: "Files Scanned",          value: "Unlimited", note: "no cap"        },
            { label: "Requires Build System",   value: "No",        note: "zero config"   },
            { label: "Requires clangd / LSP",   value: "No",        note: "pure static"   },
            { label: "Cross-file Analysis",     value: "Yes",       note: "full workspace"},
            { label: "License",                 value: "MIT",       note: "open source"   },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-bold font-mono text-sky-600 dark:text-[#58a6ff]">
                {s.value}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 dark:text-[#8b949e]">
                {s.label}
              </div>
              <div className="text-[9px] text-zinc-400 dark:text-[#30363d]">
                {s.note}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}