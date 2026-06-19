"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";

const SAMPLE_WORDS = [
  {
    word: "Ephemeral",
    pronunciation: "ih-FEM-er-ul",
    definition: "Lasting for a very short time; transitory.",
    synonyms: ["fleeting", "transient", "momentary"],
    seen: 7,
  },
  {
    word: "Laconic",
    pronunciation: "luh-KON-ik",
    definition: "Using very few words; brief and concise in speech.",
    synonyms: ["terse", "succinct", "pithy"],
    seen: 3,
  },
  {
    word: "Perfidious",
    pronunciation: "per-FID-ee-us",
    definition: "Deceitful and untrustworthy; guilty of betrayal of trust.",
    synonyms: ["treacherous", "faithless", "disloyal"],
    seen: 11,
  },
  {
    word: "Melancholy",
    pronunciation: "MEL-un-kol-ee",
    definition: "A deep, pensive sadness with no obvious cause.",
    synonyms: ["wistfulness", "glumness", "sorrow"],
    seen: 5,
  },
];

const DARK_THEME = {
  bg:     "rgba(10,12,18,0.97)",
  text:   "#EAE6DC",
  muted:  "#6E6B65",
  border: "#252833",
  gold:   "#C9912A",
};
const LIGHT_THEME = {
  bg:     "rgba(250,248,244,0.98)",
  text:   "#1A1814",
  muted:  "#7A776F",
  border: "#D8D4CC",
  gold:   "#A67420",
};

const INTERVALS = ["30s", "1 min", "2 min", "5 min", "10 min", "15 min", "30 min", "1 hr"];
const DURATIONS = ["5s", "8s", "12s", "15s", "20s", "30s"];
const MODES = [
  { id: "random",  label: "Random",        desc: "Fisher-Yates shuffle each cycle" },
  { id: "order",   label: "Order",          desc: "Oldest-added word first"         },
  { id: "reverse", label: "Reverse Order",  desc: "Newest-added word first"         },
];

export default function VocabGlancePreview() {
  const [activeTab, setActiveTab]             = useState<"popup" | "scheduler">("popup");
  const [isDark, setIsDark]                   = useState(true);
  const [wordIdx, setWordIdx]                 = useState(0);
  const [barProgress, setBarProgress]         = useState(75);
  const [justMastered, setJustMastered]       = useState(false);
  const [popupInterval, setPopupInterval]     = useState("5 min");
  const [popupDuration, setPopupDuration]     = useState("12s");
  const [wordMode, setWordMode]               = useState("random");

  const c    = isDark ? DARK_THEME : LIGHT_THEME;
  const word = SAMPLE_WORDS[wordIdx];

  useEffect(() => {
    if (activeTab !== "popup") return;
    const timerId = setInterval(() => {
      setBarProgress((p) => (p <= 0 ? 100 : p - 0.35));
    }, 80);
    return () => clearInterval(timerId);
  }, [activeTab, wordIdx]);

  function goNext() {
    setWordIdx((i) => (i + 1) % SAMPLE_WORDS.length);
    setBarProgress(100);
    setJustMastered(false);
  }
  function goPrev() {
    setWordIdx((i) => (i - 1 + SAMPLE_WORDS.length) % SAMPLE_WORDS.length);
    setBarProgress(100);
    setJustMastered(false);
  }
  function handleGotIt() {
    setJustMastered(true);
    setTimeout(goNext, 500);
  }

  return (
    <div className="not-prose my-8 space-y-4">

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["popup", "scheduler"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={[
              "px-3 py-1.5 rounded-md text-xs font-mono border transition-all duration-150",
              activeTab === t
                ? "bg-amber-500/20 border-amber-500/60 text-amber-400"
                : "border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-500",
            ].join(" ")}
          >
            {t === "popup" ? "🃏 Popup Card" : "⏱ Scheduler"}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="font-mono text-[9px] tracking-widest uppercase text-zinc-500">Preview</span>
          <button
            onClick={() => setIsDark((d) => !d)}
            disabled={activeTab === "scheduler"}
            className="p-1.5 rounded-full border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
          </button>
        </div>
      </div>

      {/* ── Popup Card tab ── */}
      {activeTab === "popup" && (
        <>
          {/* Card — mimics the transparent Electron BrowserWindow */}
          <div
            className="relative mx-auto rounded-2xl overflow-hidden select-none"
            style={{
              maxWidth: 370,
              background: c.bg,
              border: `1px solid ${c.gold}44`,
              boxShadow: `0 0 0 1px ${c.gold}18, 0 24px 64px rgba(0,0,0,0.55)`,
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: `1px solid ${c.border}` }}
            >
              <span
                className="font-serif text-[12px] font-bold tracking-widest"
                style={{ color: c.gold }}
              >
                VocabGlance
              </span>
              {/* Decorative traffic lights */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pt-5 pb-4">
              {/* Word + mastered badge */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h2
                  className="font-serif leading-tight"
                  style={{
                    color: c.text,
                    fontSize: word.word.length > 12 ? "26px" : "34px",
                    fontWeight: 700,
                    transition: "font-size 0.15s",
                  }}
                >
                  {word.word}
                </h2>
                {justMastered && (
                  <span
                    className="mt-1.5 shrink-0 text-[9px] px-1.5 py-0.5 rounded font-mono"
                    style={{
                      background: c.gold + "22",
                      color: c.gold,
                      border: `1px solid ${c.gold}44`,
                    }}
                  >
                    mastered ✓
                  </span>
                )}
              </div>

              {/* Pronunciation */}
              <p className="font-serif text-sm italic mb-4" style={{ color: c.muted }}>
                /{word.pronunciation}/
              </p>

              {/* Divider */}
              <div
                className="h-px mb-4"
                style={{ background: `linear-gradient(to right, ${c.gold}55, transparent)` }}
              />

              {/* Definition */}
              <p className="text-sm leading-relaxed mb-4" style={{ color: c.text, opacity: 0.9 }}>
                {word.definition}
              </p>

              {/* Synonyms */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {word.synonyms.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: c.gold + "1A",
                      color: c.gold,
                      border: `1px solid ${c.gold}33`,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Seen counter (mini progress bar per dot) */}
              <div className="flex items-center gap-1 mb-5">
                <div className="flex gap-0.5 items-center">
                  {Array.from({ length: Math.min(word.seen, 12) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-1.5 rounded-sm"
                      style={{ background: c.gold, opacity: 0.15 + (i / 12) * 0.85 }}
                    />
                  ))}
                </div>
                <span className="ml-1 text-[9px] font-mono" style={{ color: c.muted }}>
                  seen {word.seen}×
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleGotIt}
                  className="flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-150 active:scale-95"
                  style={{
                    background: c.gold + "25",
                    border: `1px solid ${c.gold}50`,
                    color: c.gold,
                  }}
                >
                  Got it ✓
                </button>
                <button
                  onClick={goNext}
                  className="flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-150 active:scale-95"
                  style={{
                    background: "transparent",
                    border: `1px solid ${c.muted}30`,
                    color: c.muted,
                  }}
                >
                  Still learning
                </button>
              </div>
            </div>

            {/* Time-remaining progress bar */}
            <div
              className="h-[3px] transition-all duration-100"
              style={{
                width: `${barProgress}%`,
                background: `linear-gradient(to right, ${c.gold}55, ${c.gold})`,
              }}
            />
          </div>

          {/* Word navigation */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={goPrev}
              className="p-1.5 rounded-full border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <ChevronLeft size={12} />
            </button>
            <span className="font-mono text-[10px] text-zinc-500">
              word {wordIdx + 1} / {SAMPLE_WORDS.length} · {isDark ? "dark" : "light"} mode
            </span>
            <button
              onClick={goNext}
              className="p-1.5 rounded-full border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </>
      )}

      {/* ── Scheduler tab ── */}
      {activeTab === "scheduler" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Interval picker */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-4">
            <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-500 mb-3">
              Popup Interval
            </p>
            <div className="flex flex-wrap gap-1.5">
              {INTERVALS.map((v) => (
                <button
                  key={v}
                  onClick={() => setPopupInterval(v)}
                  className={[
                    "px-2.5 py-1 rounded text-[11px] font-mono border transition-all duration-150",
                    popupInterval === v
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-500",
                  ].join(" ")}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Duration picker */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-4">
            <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-500 mb-3">
              Popup Duration
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DURATIONS.map((v) => (
                <button
                  key={v}
                  onClick={() => setPopupDuration(v)}
                  className={[
                    "px-2.5 py-1 rounded text-[11px] font-mono border transition-all duration-150",
                    popupDuration === v
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-500",
                  ].join(" ")}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Mode picker */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-4">
            <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-500 mb-3">
              Word Order
            </p>
            <div className="flex flex-col gap-1.5">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setWordMode(m.id)}
                  className={[
                    "flex flex-col items-start px-3 py-2 rounded text-left border transition-all duration-150",
                    wordMode === m.id
                      ? "bg-amber-500/15 border-amber-500/50"
                      : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500",
                  ].join(" ")}
                >
                  <span
                    className={`text-[11px] font-mono ${
                      wordMode === m.id ? "text-amber-400" : "text-zinc-500"
                    }`}
                  >
                    {m.label}
                  </span>
                  <span className="text-[9px] text-zinc-500 mt-0.5">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Stats bar ── */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-6 py-4">
        <div className="flex flex-wrap gap-8 justify-center">
          {[
            { label: "Platform",          value: "Windows",       note: "10 / 11"           },
            { label: "Internet Required", value: "No",            note: "100% offline"       },
            { label: "Persistence",       value: "JSON",          note: "no database"        },
            { label: "Popup Level",       value: "screen-saver",  note: "above all windows"  },
            { label: "License",           value: "MIT",           note: "open source"        },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                {s.value}
              </div>
              <div className="text-[10px] font-mono text-zinc-500">{s.label}</div>
              <div className="text-[9px] text-zinc-400 dark:text-zinc-600">{s.note}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
