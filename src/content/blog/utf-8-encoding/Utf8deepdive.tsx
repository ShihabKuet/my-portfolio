"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

// ─── Utilities ────────────────────────────────────────────────────────────────

function getCodePoint(char: string): number {
  return char.codePointAt(0) ?? 0;
}

function toBinary(n: number, pad: number = 0): string {
  return n.toString(2).padStart(pad, "0");
}

function toHex(n: number): string {
  return "0x" + n.toString(16).toUpperCase().padStart(2, "0");
}

function encodeToUTF8Bytes(codePoint: number): number[] {
  if (codePoint <= 0x7f) {
    return [codePoint];
  } else if (codePoint <= 0x7ff) {
    return [0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f)];
  } else if (codePoint <= 0xffff) {
    return [
      0xe0 | (codePoint >> 12),
      0x80 | ((codePoint >> 6) & 0x3f),
      0x80 | (codePoint & 0x3f),
    ];
  } else {
    return [
      0xf0 | (codePoint >> 18),
      0x80 | ((codePoint >> 12) & 0x3f),
      0x80 | ((codePoint >> 6) & 0x3f),
      0x80 | (codePoint & 0x3f),
    ];
  }
}

function getRange(codePoint: number): 1 | 2 | 3 | 4 {
  if (codePoint <= 0x7f) return 1;
  if (codePoint <= 0x7ff) return 2;
  if (codePoint <= 0xffff) return 3;
  return 4;
}

interface BitGroup {
  bits: string;
  type: "prefix" | "continuation-prefix" | "payload";
  byteIndex: number;
}

function decomposeBytes(codePoint: number): BitGroup[][] {
  const bytes = encodeToUTF8Bytes(codePoint);
  const n = bytes.length;

  return bytes.map((byte, i) => {
    const full = toBinary(byte, 8);
    if (n === 1) {
      return [
        { bits: "0", type: "prefix", byteIndex: i },
        { bits: full.slice(1), type: "payload", byteIndex: i },
      ];
    }
    if (i === 0) {
      const prefix = "1".repeat(n) + "0";
      const payloadStart = prefix.length;
      return [
        { bits: prefix, type: "prefix", byteIndex: i },
        { bits: full.slice(payloadStart), type: "payload", byteIndex: i },
      ];
    }
    return [
      { bits: "10", type: "continuation-prefix", byteIndex: i },
      { bits: full.slice(2), type: "payload", byteIndex: i },
    ];
  });
}

// ─── Styles (design system) ───────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700;800&display=swap');

  .utf-root {
    --bg: #09090b;
    --bg-2: #111114;
    --bg-3: #18181c;
    --bg-4: #222228;
    --border: rgba(255,255,255,0.08);
    --border-bright: rgba(255,255,255,0.15);
    --text: #e4e4e7;
    --text-dim: #71717a;
    --text-dimmer: #3f3f46;
    --amber: #f59e0b;
    --amber-dim: rgba(245,158,11,0.15);
    --amber-border: rgba(245,158,11,0.3);
    --blue: #60a5fa;
    --blue-dim: rgba(96,165,250,0.12);
    --blue-border: rgba(96,165,250,0.3);
    --green: #4ade80;
    --green-dim: rgba(74,222,128,0.12);
    --green-border: rgba(74,222,128,0.3);
    --rose: #fb7185;
    --rose-dim: rgba(251,113,133,0.12);
    --rose-border: rgba(251,113,133,0.3);
    --violet: #a78bfa;
    --violet-dim: rgba(167,139,250,0.12);
    --radius: 10px;
    font-family: 'Syne', sans-serif;
    color: var(--text);
    background: var(--bg);
  }

  .utf-root * { box-sizing: border-box; }

  .mono { font-family: 'IBM Plex Mono', monospace; }
  .serif { font-family: 'Instrument Serif', serif; }

  /* ── Encoding Rules Table ── */
  .rules-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.8rem;
  }
  .rules-table th {
    text-align: left;
    padding: 8px 16px;
    color: var(--text-dim);
    font-weight: 500;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .rules-table td {
    padding: 12px 16px;
    background: var(--bg-3);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    transition: all 0.25s ease;
  }
  .rules-table tr td:first-child {
    border-left: 1px solid var(--border);
    border-radius: var(--radius) 0 0 var(--radius);
  }
  .rules-table tr td:last-child {
    border-right: 1px solid var(--border);
    border-radius: 0 var(--radius) var(--radius) 0;
  }
  .rules-table tr.active td {
    background: var(--bg-4);
    border-color: var(--amber-border);
  }
  .rules-table tr.active td:first-child { border-left-color: var(--amber); }

  /* ── Bit cell ── */
  .bit-cell {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 5px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    border: 1px solid transparent;
    margin: 1px;
  }
  .bit-cell.prefix { background: var(--amber-dim); border-color: var(--amber-border); color: var(--amber); }
  .bit-cell.continuation { background: var(--rose-dim); border-color: var(--rose-border); color: var(--rose); }
  .bit-cell.payload { background: var(--blue-dim); border-color: var(--blue-border); color: var(--blue); }
  .bit-cell.empty { background: var(--bg-3); color: var(--text-dimmer); border-color: var(--border); }

  /* ── Byte block ── */
  .byte-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border-radius: var(--radius);
    background: var(--bg-3);
    border: 1px solid var(--border);
    transition: all 0.4s ease;
    min-width: 120px;
  }
  .byte-block.active {
    border-color: var(--amber-border);
    box-shadow: 0 0 20px rgba(245,158,11,0.08);
  }

  /* ── Step animation ── */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.6); }
    70% { transform: scale(1.15); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse-border {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.3); }
    50% { box-shadow: 0 0 0 4px rgba(245,158,11,0.1); }
  }
  @keyframes flow {
    0% { stroke-dashoffset: 100; opacity: 0; }
    30% { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .anim-fade { animation: fadeSlideUp 0.4s ease forwards; }
  .anim-pop { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .anim-pulse { animation: pulse-border 2s ease infinite; }

  /* ── Input ── */
  .char-input {
    background: var(--bg-3);
    border: 1px solid var(--border-bright);
    color: var(--text);
    border-radius: var(--radius);
    padding: 10px 16px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 1.4rem;
    text-align: center;
    width: 80px;
    outline: none;
    transition: border-color 0.2s;
  }
  .char-input:focus { border-color: var(--amber); }

  /* ── Pill tags ── */
  .pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 999px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem; font-weight: 500;
  }
  .pill-amber { background: var(--amber-dim); color: var(--amber); border: 1px solid var(--amber-border); }
  .pill-blue  { background: var(--blue-dim);  color: var(--blue);  border: 1px solid var(--blue-border);  }
  .pill-green { background: var(--green-dim); color: var(--green); border: 1px solid var(--green-border); }
  .pill-rose  { background: var(--rose-dim);  color: var(--rose);  border: 1px solid var(--rose-border);  }
  .pill-violet{ background: var(--violet-dim);color: var(--violet);border: 1px solid rgba(167,139,250,.3);}

  /* ── Progress steps ── */
  .step-dot {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700; cursor: pointer;
    transition: all 0.25s ease;
    border: 2px solid var(--border);
    color: var(--text-dim);
  }
  .step-dot.done { background: var(--amber); border-color: var(--amber); color: #000; }
  .step-dot.active { background: transparent; border-color: var(--amber); color: var(--amber); animation: pulse-border 2s ease infinite; }

  /* ── Memory grid ── */
  .mem-cell {
    padding: 8px 6px;
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 6px;
    text-align: center;
    transition: all 0.3s ease;
    min-width: 52px;
  }
  .mem-cell.highlight { background: var(--amber-dim); border-color: var(--amber-border); }
  .mem-cell.continuation-cell { background: var(--blue-dim); border-color: var(--blue-border); }

  /* ── Section card ── */
  .section-card {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px;
    margin-bottom: 32px;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text);
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-title::before {
    content: '';
    display: block; width: 3px; height: 20px;
    background: var(--amber);
    border-radius: 2px;
  }

  /* ── Scrollable ── */
  .overflow-x-auto { overflow-x: auto; }

  /* ── Tooltip / legend ── */
  .legend { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 12px; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--text-dim); }
  .legend-dot { width: 10px; height: 10px; border-radius: 2px; }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .byte-blocks-row { flex-wrap: wrap !important; }
    .section-card { padding: 18px; }
  }
`;

// ─── Component: EncodingRulesTable ────────────────────────────────────────────
export function EncodingRulesTable({
  highlightRange,
}: {
  highlightRange?: 1 | 2 | 3 | 4;
}) {
  const rows = [
    {
      range: 1,
      from: "U+0000",
      to: "U+007F",
      bytes: 1,
      bits: 7,
      pattern: ["0xxxxxxx", "", "", ""],
      example: "A (U+0041)",
    },
    {
      range: 2,
      from: "U+0080",
      to: "U+07FF",
      bytes: 2,
      bits: 11,
      pattern: ["110xxxxx", "10xxxxxx", "", ""],
      example: "é (U+00E9)",
    },
    {
      range: 3,
      from: "U+0800",
      to: "U+FFFF",
      bytes: 3,
      bits: 16,
      pattern: ["1110xxxx", "10xxxxxx", "10xxxxxx", ""],
      example: "中 (U+4E2D)",
    },
    {
      range: 4,
      from: "U+10000",
      to: "U+10FFFF",
      bytes: 4,
      bits: 21,
      pattern: ["11110xxx", "10xxxxxx", "10xxxxxx", "10xxxxxx"],
      example: "😊 (U+1F60A)",
    },
  ];

  const colors = ["var(--green)", "var(--blue)", "var(--amber)", "var(--rose)"];

  return (
    <div className="overflow-x-auto">
      <table className="rules-table">
        <thead>
          <tr>
            <th>Code Point Range</th>
            <th>Bytes</th>
            <th>Payload Bits</th>
            <th>Byte Pattern</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.range}
              className={highlightRange === row.range ? "active" : ""}
            >
              <td>
                <span style={{ color: colors[row.range - 1], fontWeight: 600 }}>
                  {row.from}
                </span>
                <span style={{ color: "var(--text-dim)", margin: "0 6px" }}>
                  →
                </span>
                <span style={{ color: colors[row.range - 1], fontWeight: 600 }}>
                  {row.to}
                </span>
              </td>
              <td>
                <span
                  className="pill"
                  style={{
                    background: `${colors[row.range - 1]}20`,
                    color: colors[row.range - 1],
                    border: `1px solid ${colors[row.range - 1]}40`,
                  }}
                >
                  {row.bytes} byte{row.bytes > 1 ? "s" : ""}
                </span>
              </td>
              <td style={{ color: "var(--text-dim)" }}>{row.bits} bits</td>
              <td>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {row.pattern.map((p, i) =>
                    p ? (
                      <code
                        key={i}
                        style={{
                          background:
                            i === 0
                              ? `${colors[row.range - 1]}18`
                              : "var(--blue-dim)",
                          color:
                            i === 0 ? colors[row.range - 1] : "var(--blue)",
                          border: `1px solid ${i === 0 ? colors[row.range - 1] : "var(--blue)"}30`,
                          borderRadius: 5,
                          padding: "2px 7px",
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "0.72rem",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {p}
                      </code>
                    ) : null
                  )}
                </div>
              </td>
              <td style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
                {row.example}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Component: BitDisplay ────────────────────────────────────────────────────
function BitDisplay({
  groups,
  animate = false,
}: {
  groups: BitGroup[];
  animate?: boolean;
}) {
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [animate, groups]);

  if (!visible) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {groups.flatMap((g, gi) =>
        g.bits.split("").map((bit, bi) => (
          <span
            key={`${gi}-${bi}`}
            className={`bit-cell ${g.type === "prefix" ? "prefix" : g.type === "continuation-prefix" ? "continuation" : "payload"}`}
            style={
              animate
                ? {
                    animation: `popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${(gi * g.bits.length + bi) * 40}ms both`,
                  }
                : {}
            }
          >
            {bit}
          </span>
        ))
      )}
    </div>
  );
}

// ─── Component: InteractiveEncoder (main star) ────────────────────────────────
export function InteractiveEncoder() {
  const PRESETS = [
    { char: "A", label: "ASCII" },
    { char: "é", label: "Latin" },
    { char: "中", label: "CJK" },
    { char: "😊", label: "Emoji" },
    { char: "→", label: "Arrow" },
    { char: "ñ", label: "Tilde" },
  ];

  const [char, setChar] = useState("A");
  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const cp = getCodePoint(char);
  const bytes = encodeToUTF8Bytes(cp);
  const range = getRange(cp);
  const groups = decomposeBytes(cp);
  const binCP = toBinary(cp, range === 1 ? 7 : range === 2 ? 11 : range === 3 ? 16 : 21);

  const STEPS = [
    "Character",
    "Code Point",
    "Binary",
    "Byte Template",
    "Fill Bits",
    "Final Bytes",
  ];

  const handleChar = (c: string) => {
    const cp2 = getCodePoint(c);
    if (cp2 >= 0 && cp2 <= 0x10ffff) {
      setChar(c);
      setStep(0);
      setAnimKey((k) => k + 1);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > 0) {
      const lastChar = [...val].slice(-1)[0];
      handleChar(lastChar);
      e.target.value = lastChar;
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const rangeColors: Record<number, string> = {
    1: "var(--green)",
    2: "var(--blue)",
    3: "var(--amber)",
    4: "var(--rose)",
  };
  const rc = rangeColors[range];

  return (
    <div className="utf-root" style={{ borderRadius: 16, overflow: "hidden" }}>
      <style>{css}</style>

      <div style={{ padding: "28px", background: "var(--bg-2)" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--amber-dim)",
              border: "1px solid var(--amber-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
            }}
          >
            ⚡
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: "1.05rem",
              }}
            >
              Interactive UTF-8 Encoder
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
              Step through the encoding process for any character
            </div>
          </div>
        </div>

        {/* Character Selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <input
            ref={inputRef}
            className="char-input"
            defaultValue={char}
            onChange={handleInput}
            maxLength={2}
            placeholder="?"
          />
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {PRESETS.map((p) => (
              <button
                key={p.char}
                onClick={() => {
                  handleChar(p.char);
                  if (inputRef.current) inputRef.current.value = p.char;
                }}
                style={{
                  background:
                    char === p.char ? "var(--amber-dim)" : "var(--bg-3)",
                  border: `1px solid ${char === p.char ? "var(--amber-border)" : "var(--border)"}`,
                  borderRadius: 8,
                  padding: "6px 12px",
                  color: char === p.char ? "var(--amber)" : "var(--text-dim)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontFamily: "'IBM Plex Mono', monospace",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{p.char}</span>
                <span style={{ fontSize: "0.65rem" }}>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            marginBottom: 32,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <button
                className={`step-dot ${i < step ? "done" : i === step ? "active" : ""}`}
                onClick={() => setStep(i)}
                title={s}
                style={{ flexShrink: 0 }}
              >
                {i < step ? "✓" : i + 1}
              </button>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    height: 2,
                    width: 32,
                    flexShrink: 0,
                    background:
                      i < step ? "var(--amber)" : "var(--border-bright)",
                    transition: "background 0.3s",
                    margin: "0 4px",
                  }}
                />
              )}
            </React.Fragment>
          ))}
          <span
            style={{
              marginLeft: 16,
              color: "var(--text-dim)",
              fontSize: "0.78rem",
              flexShrink: 0,
            }}
          >
            {STEPS[step]}
          </span>
        </div>

        {/* Step Content */}
        <div
          key={`${animKey}-${step}`}
          className="anim-fade"
          style={{
            background: "var(--bg-3)",
            borderRadius: 12,
            padding: 24,
            border: "1px solid var(--border)",
            minHeight: 200,
          }}
        >
          {/* STEP 0 – Character */}
          {step === 0 && (
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 20,
                }}
              >
                The Character
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 32,
                  flexWrap: "wrap",
                }}
              >
                <div
                  className="anim-pop"
                  style={{
                    fontSize: "6rem",
                    lineHeight: 1,
                    fontFamily: "system-ui",
                    filter: "drop-shadow(0 0 24px rgba(245,158,11,0.3))",
                  }}
                >
                  {char}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>
                      This character needs
                    </span>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      {Array.from({ length: range }, (_, i) => (
                        <div
                          key={i}
                          className="anim-pop"
                          style={{
                            animationDelay: `${i * 120}ms`,
                            width: 44,
                            height: 44,
                            borderRadius: 8,
                            background: `${rc}20`,
                            border: `2px solid ${rc}60`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            color: rc,
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontWeight: 600,
                          }}
                        >
                          B{i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  <span
                    className="pill"
                    style={{ background: `${rc}15`, color: rc, border: `1px solid ${rc}40` }}
                  >
                    {range} byte{range > 1 ? "s" : ""} in UTF-8
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginTop: 24,
                  padding: 14,
                  background: "var(--bg-4)",
                  borderRadius: 8,
                  fontSize: "0.78rem",
                  color: "var(--text-dim)",
                  lineHeight: 1.6,
                  borderLeft: `3px solid ${rc}`,
                }}
              >
                Every character you see on screen is ultimately stored as one or more bytes in memory.
                Unicode provides a universal numbering system (code points) and UTF-8 tells us exactly
                how to convert those numbers into bytes.
              </div>
            </div>
          )}

          {/* STEP 1 – Code Point */}
          {step === 1 && (
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 20,
                }}
              >
                Unicode Code Point
              </div>
              <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-dim)",
                      marginBottom: 8,
                    }}
                  >
                    Decimal
                  </div>
                  <div
                    className="anim-pop mono"
                    style={{ fontSize: "2.5rem", fontWeight: 600, color: "var(--amber)" }}
                  >
                    {cp}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-dim)",
                      marginBottom: 8,
                    }}
                  >
                    Hexadecimal (Unicode notation)
                  </div>
                  <div
                    className="anim-pop mono"
                    style={{
                      animationDelay: "80ms",
                      fontSize: "2.5rem",
                      fontWeight: 600,
                      color: "var(--blue)",
                    }}
                  >
                    U+{cp.toString(16).toUpperCase().padStart(4, "0")}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-dim)",
                      marginBottom: 8,
                    }}
                  >
                    Range
                  </div>
                  <div
                    className="anim-pop"
                    style={{ animationDelay: "160ms" }}
                  >
                    <span
                      className="pill"
                      style={{ background: `${rc}15`, color: rc, border: `1px solid ${rc}40`, fontSize: "0.85rem" }}
                    >
                      {range === 1
                        ? "U+0000 → U+007F"
                        : range === 2
                        ? "U+0080 → U+07FF"
                        : range === 3
                        ? "U+0800 → U+FFFF"
                        : "U+10000 → U+10FFFF"}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 28,
                  background: "var(--bg-4)",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-dim)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 14,
                  }}
                >
                  Plane Location
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[
                    { label: "Basic Latin", start: 0, end: 127 },
                    { label: "Latin Extended", start: 128, end: 2047 },
                    { label: "BMP", start: 2048, end: 65535 },
                    { label: "Supplementary", start: 65536, end: 1114111 },
                  ].map((plane) => {
                    const active = cp >= plane.start && cp <= plane.end;
                    return (
                      <div
                        key={plane.label}
                        style={{
                          flex: 1,
                          padding: "10px 8px",
                          borderRadius: 7,
                          background: active ? `${rc}18` : "var(--bg-3)",
                          border: `1px solid ${active ? rc + "50" : "var(--border)"}`,
                          textAlign: "center",
                          transition: "all 0.3s",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.65rem",
                            color: active ? rc : "var(--text-dim)",
                            fontWeight: active ? 600 : 400,
                          }}
                        >
                          {plane.label}
                        </div>
                        <div
                          style={{
                            fontSize: "0.6rem",
                            color: "var(--text-dimmer)",
                            fontFamily: "'IBM Plex Mono', monospace",
                            marginTop: 4,
                          }}
                        >
                          {toHex(plane.start)} – {toHex(plane.end)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 – Binary */}
          {step === 2 && (
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 20,
                }}
              >
                Code Point in Binary
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-dim)",
                  marginBottom: 12,
                }}
              >
                {cp} in decimal ={" "}
                <span style={{ color: "var(--amber)" }}>
                  {cp.toString(16).toUpperCase()}
                </span>{" "}
                in hex ={" "}
                <span style={{ color: "var(--blue)" }}>{binCP}</span> in binary
              </div>
              <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 20 }}>
                {binCP.split("").map((bit, i) => (
                  <span
                    key={i}
                    className="bit-cell payload"
                    style={{
                      animation: `popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 35}ms both`,
                    }}
                  >
                    {bit}
                  </span>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  fontSize: "0.78rem",
                  color: "var(--text-dim)",
                }}
              >
                <div>
                  Total bits needed:{" "}
                  <strong style={{ color: "var(--blue)" }}>
                    {binCP.length}
                  </strong>
                </div>
                <div>
                  Significant bits:{" "}
                  <strong style={{ color: "var(--amber)" }}>
                    {binCP.replace(/^0+/, "").length || 1}
                  </strong>
                </div>
                <div>
                  UTF-8 payload capacity:{" "}
                  <strong style={{ color: rc }}>
                    {range === 1
                      ? "7"
                      : range === 2
                      ? "11"
                      : range === 3
                      ? "16"
                      : "21"}{" "}
                    bits
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 – Byte Template */}
          {step === 3 && (
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 20,
                }}
              >
                UTF-8 Byte Template
              </div>
              <div
                style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginBottom: 20 }}
              >
                Since the code point is in range{" "}
                <span style={{ color: rc, fontWeight: 600 }}>
                  {range === 1
                    ? "U+0000–U+007F"
                    : range === 2
                    ? "U+0080–U+07FF"
                    : range === 3
                    ? "U+0800–U+FFFF"
                    : "U+10000–U+10FFFF"}
                </span>
                , we use a{" "}
                <span style={{ color: rc, fontWeight: 600 }}>
                  {range}-byte
                </span>{" "}
                sequence:
              </div>
              <div
                className="byte-blocks-row"
                style={{
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                {groups.map((g, byteIdx) => {
                  const isFirst = byteIdx === 0;
                  const prefixGroup = g[0];
                  const payloadGroup = g[1];
                  return (
                    <div
                      key={byteIdx}
                      className="byte-block anim-pop"
                      style={{ animationDelay: `${byteIdx * 120}ms` }}
                    >
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--text-dim)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Byte {byteIdx + 1}
                      </div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {prefixGroup.bits.split("").map((b, i) => (
                          <span
                            key={i}
                            className={`bit-cell ${isFirst ? "prefix" : "continuation"}`}
                          >
                            {b}
                          </span>
                        ))}
                        {payloadGroup.bits.split("").map((_, i) => (
                          <span key={i} className="bit-cell empty">
                            x
                          </span>
                        ))}
                      </div>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: isFirst ? "var(--amber)" : "var(--rose)",
                          textAlign: "center",
                        }}
                      >
                        {isFirst
                          ? range === 1
                            ? "0"
                            : "1".repeat(range) + "0"
                          : "10"}{" "}
                        prefix
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="legend" style={{ marginTop: 20 }}>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: "var(--amber)" }} />
                  <span>Leading byte prefix (signals byte count)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: "var(--rose)" }} />
                  <span>Continuation byte prefix (always 10xxxxxx)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: "var(--bg-4)", border: "1px solid var(--border-bright)" }} />
                  <span>Payload slots (x = bits from code point)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 – Fill Bits */}
          {step === 4 && (
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 20,
                }}
              >
                Filling Payload Bits
              </div>
              <div
                style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginBottom: 20 }}
              >
                Binary:{" "}
                <code
                  style={{
                    color: "var(--blue)",
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {binCP}
                </code>{" "}
                → distribute bits right-to-left into payload slots:
              </div>

              {/* Source bits */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-dim)",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Source (code point binary, LSB-last)
                </div>
                <div style={{ display: "flex", gap: 2 }}>
                  {binCP.split("").map((bit, i) => (
                    <span
                      key={i}
                      className="bit-cell payload"
                      style={{
                        animation: `popIn 0.4s ease ${i * 30}ms both`,
                      }}
                    >
                      {bit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Filled bytes */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {groups.map((g, byteIdx) => (
                  <div key={byteIdx} className="byte-block active">
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--text-dim)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Byte {byteIdx + 1}
                    </div>
                    <BitDisplay groups={g} animate />
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: "var(--text-dim)",
                      }}
                    >
                      {toHex(bytes[byteIdx])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 – Final Bytes */}
          {step === 5 && (
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 20,
                }}
              >
                Final UTF-8 Encoding
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginBottom: 28,
                }}
              >
                <div
                  className="anim-pop"
                  style={{
                    fontSize: "4rem",
                    fontFamily: "system-ui",
                    padding: "8px 16px",
                    background: `${rc}10`,
                    borderRadius: 12,
                    border: `1px solid ${rc}30`,
                  }}
                >
                  {char}
                </div>
                <div
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "1.5rem",
                    animation: "popIn 0.4s ease 200ms both",
                  }}
                >
                  →
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {bytes.map((byte, i) => (
                    <div
                      key={i}
                      className="anim-pop"
                      style={{
                        animationDelay: `${300 + i * 120}ms`,
                        background: i === 0 ? `${rc}15` : "var(--blue-dim)",
                        border: `1px solid ${i === 0 ? rc + "40" : "var(--blue-border)"}`,
                        borderRadius: 10,
                        padding: "12px 16px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: i === 0 ? rc : "var(--blue)",
                        }}
                      >
                        {toHex(byte)}
                      </div>
                      <div
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "0.7rem",
                          color: "var(--text-dim)",
                          marginTop: 4,
                        }}
                      >
                        {toBinary(byte, 8)}
                      </div>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--text-dimmer)",
                          marginTop: 4,
                        }}
                      >
                        {byte} dec
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: "var(--bg-4)",
                  borderRadius: 10,
                  padding: 16,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.8rem",
                }}
              >
                <div style={{ color: "var(--text-dim)", marginBottom: 10 }}>
                  // How a language runtime stores this in memory:
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ color: "var(--text-dim)" }}>address:</span>
                  {bytes.map((byte, i) => (
                    <div
                      key={i}
                      className="mem-cell"
                      style={{
                        animation: `popIn 0.4s ease ${i * 100}ms both`,
                        background: i === 0 ? `${rc}15` : "var(--blue-dim)",
                        border: `1px solid ${i === 0 ? rc + "40" : "var(--blue-border)"}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.55rem",
                          color: "var(--text-dimmer)",
                          marginBottom: 3,
                        }}
                      >
                        +{i}
                      </div>
                      <div style={{ color: i === 0 ? rc : "var(--blue)", fontWeight: 600 }}>
                        {toHex(byte)}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 14,
                    color: "var(--green)",
                    animation: "popIn 0.4s ease 600ms both",
                  }}
                >
                  // JavaScript: &quot;{char}&quot;.charCodeAt(0) === {cp} → encoded to{" "}
                  {bytes.map((b) => toHex(b)).join(" ")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <button
            onClick={prev}
            disabled={step === 0}
            style={{
              background: step === 0 ? "var(--bg-3)" : "var(--bg-4)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "8px 20px",
              color: step === 0 ? "var(--text-dimmer)" : "var(--text)",
              cursor: step === 0 ? "not-allowed" : "pointer",
              fontSize: "0.85rem",
              fontFamily: "'Syne', sans-serif",
              transition: "all 0.2s",
            }}
          >
            ← Prev
          </button>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-dim)",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {step + 1} / {STEPS.length}
          </span>
          <button
            onClick={next}
            disabled={step === STEPS.length - 1}
            style={{
              background:
                step === STEPS.length - 1 ? "var(--bg-3)" : "var(--amber)",
              border: "none",
              borderRadius: 8,
              padding: "8px 20px",
              color:
                step === STEPS.length - 1 ? "var(--text-dimmer)" : "#000",
              cursor:
                step === STEPS.length - 1 ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "0.85rem",
              fontFamily: "'Syne', sans-serif",
              transition: "all 0.2s",
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Component: MemoryLayout ──────────────────────────────────────────────────
export function MemoryLayout({ text = "Hello →" }: { text?: string }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chars = [...text];
  const allBytes: { char: string; byte: number; charIdx: number; isLeading: boolean }[] = [];

  chars.forEach((c, ci) => {
    const cp = getCodePoint(c);
    const bytes = encodeToUTF8Bytes(cp);
    bytes.forEach((b, bi) => {
      allBytes.push({ char: c, byte: b, charIdx: ci, isLeading: bi === 0 });
    });
  });

  const colors = [
    "var(--amber)",
    "var(--blue)",
    "var(--green)",
    "var(--rose)",
    "var(--violet)",
    "#34d399",
    "#f472b6",
  ];

  return (
    <div
      className="utf-root section-card"
      style={{ background: "var(--bg-2)" }}
    >
      <style>{css}</style>
      <div className="section-title">Memory Layout</div>
      <div
        style={{
          fontSize: "0.8rem",
          color: "var(--text-dim)",
          marginBottom: 20,
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        String: &quot;{text}&quot; — hover a byte to inspect
      </div>

      {/* Byte cells */}
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
          {allBytes.map((b, i) => {
            const col = colors[b.charIdx % colors.length];
            const isHover = hoveredIdx === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    fontSize: "0.55rem",
                    color: "var(--text-dimmer)",
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {i.toString(16).padStart(2, "0")}
                </div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isHover ? `${col}25` : b.isLeading ? `${col}18` : "var(--bg-3)",
                    border: `1px solid ${isHover ? col : b.isLeading ? col + "50" : "var(--border)"}`,
                    transition: "all 0.2s ease",
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: isHover ? col : b.isLeading ? col : "var(--text-dim)",
                    }}
                  >
                    {toHex(b.byte).replace("0x", "")}
                  </div>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "0.55rem",
                      color: "var(--text-dimmer)",
                    }}
                  >
                    {b.byte}
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem", color: col }}>
                  {b.isLeading ? b.char : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover detail */}
      {hoveredIdx !== null && (
        <div
          className="anim-fade"
          style={{
            marginTop: 20,
            padding: 16,
            background: "var(--bg-3)",
            borderRadius: 10,
            border: "1px solid var(--border-bright)",
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {(() => {
            const b = allBytes[hoveredIdx];
            const col = colors[b.charIdx % colors.length];
            return (
              <>
                <div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Char</div>
                  <div style={{ fontSize: "1.5rem", color: col }}>{b.char}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Hex</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: col, fontWeight: 700, fontSize: "1.1rem" }}>
                    {toHex(b.byte)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Binary</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--blue)", fontSize: "0.85rem" }}>
                    {toBinary(b.byte, 8)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Role</div>
                  <span className={`pill ${b.isLeading ? "pill-amber" : "pill-blue"}`}>
                    {b.isLeading ? "Leading byte" : "Continuation byte"}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Offset</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--text-dim)" }}>
                    +{hoveredIdx}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─── Component: EncodingRulesCard ─────────────────────────────────────────────
export function EncodingRulesCard() {
  const [highlighted, setHighlighted] = useState<1 | 2 | 3 | 4 | null>(null);

  return (
    <div className="utf-root section-card" style={{ background: "var(--bg-2)" }}>
      <style>{css}</style>
      <div className="section-title">UTF-8 Encoding Rules</div>
      <div style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.6 }}>
        Click a row to highlight it. The <span style={{ color: "var(--amber)" }}>x</span> bits
        are filled with the binary representation of the Unicode code point,
        right to left. Leading byte prefixes tell decoders how many bytes to consume.
      </div>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}
      >
        {([1, 2, 3, 4] as const).map((n) => (
          <button
            key={n}
            onClick={() => setHighlighted(highlighted === n ? null : n)}
            style={{
              background:
                highlighted === n ? "var(--amber-dim)" : "var(--bg-3)",
              border: `1px solid ${highlighted === n ? "var(--amber-border)" : "var(--border)"}`,
              borderRadius: 8,
              padding: "6px 14px",
              color: highlighted === n ? "var(--amber)" : "var(--text-dim)",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontFamily: "'IBM Plex Mono', monospace",
              transition: "all 0.2s",
            }}
          >
            {n}-byte
          </button>
        ))}
      </div>
      <EncodingRulesTable highlightRange={highlighted ?? undefined} />
      <div className="legend" style={{ marginTop: 16 }}>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: "var(--amber)" }} />
          <span>Leading byte prefix — encodes the byte count</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: "var(--blue)" }} />
          <span>Continuation byte — always starts with 10</span>
        </div>
      </div>
    </div>
  );
}

// ─── Component: ComparisonTable ───────────────────────────────────────────────
export function EncodingComparison() {
  const rows = [
    {
      feature: "Variable-width",
      utf8: "✓ 1–4 bytes",
      utf16: "✓ 2 or 4 bytes",
      utf32: "✗ Fixed 4 bytes",
    },
    {
      feature: "ASCII compatible",
      utf8: "✓ Identical",
      utf16: "✗ Not compatible",
      utf32: "✗ Not compatible",
    },
    {
      feature: "BOM required",
      utf8: "Optional",
      utf16: "Recommended",
      utf32: "Recommended",
    },
    {
      feature: "Byte order",
      utf8: "Byte-order neutral",
      utf16: "LE / BE variants",
      utf32: "LE / BE variants",
    },
    {
      feature: "Web usage",
      utf8: "Dominant (~98%)",
      utf16: "Rare",
      utf32: "Extremely rare",
    },
    {
      feature: "Self-synchronizing",
      utf8: "✓ Yes",
      utf16: "Partial",
      utf32: "✓ Yes",
    },
    {
      feature: "Null-safe",
      utf8: "✓ No embedded nulls",
      utf16: "✗ Embedded nulls",
      utf32: "✗ Embedded nulls",
    },
  ];

  return (
    <div className="utf-root section-card" style={{ background: "var(--bg-2)" }}>
      <style>{css}</style>
      <div className="section-title">Unicode Encoding Comparison</div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 4px",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.78rem",
          }}
        >
          <thead>
            <tr>
              {["Feature", "UTF-8", "UTF-16", "UTF-32"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "8px 16px",
                    color:
                      i === 1
                        ? "var(--amber)"
                        : i === 2
                        ? "var(--blue)"
                        : i === 3
                        ? "var(--rose)"
                        : "var(--text-dim)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    borderBottom: `2px solid ${i === 1 ? "var(--amber-border)" : i === 2 ? "var(--blue-border)" : i === 3 ? "var(--rose-border)" : "var(--border)"}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <td
                  style={{
                    padding: "10px 16px",
                    color: "var(--text-dim)",
                    background: "var(--bg-3)",
                    borderRadius: "8px 0 0 8px",
                  }}
                >
                  {row.feature}
                </td>
                {[row.utf8, row.utf16, row.utf32].map((val, vi) => (
                  <td
                    key={vi}
                    style={{
                      padding: "10px 16px",
                      background: "var(--bg-3)",
                      color:
                        val.startsWith("✓")
                          ? vi === 0
                            ? "var(--green)"
                            : "var(--green)"
                          : val.startsWith("✗")
                          ? "var(--rose)"
                          : "var(--text)",
                      borderRadius: vi === 2 ? "0 8px 8px 0" : 0,
                      borderLeft:
                        vi === 0
                          ? "1px solid var(--amber-border)"
                          : vi === 1
                          ? "1px solid var(--border)"
                          : "1px solid var(--border)",
                    }}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Component: CommonPitfalls ────────────────────────────────────────────────
export function CommonPitfalls() {
  const pitfalls = [
    {
      title: "String length ≠ byte length",
      icon: "📏",
      bad: `"😊".length   // → 2 (JS counts UTF-16 code units)\n"😊".length   // Rust: "😊".len() → 4 bytes\nbytes_used  // could be 1–4× the char count`,
      good: `// JavaScript\n[..."😊"].length           // → 1 (actual characters)\nnew TextEncoder().encode("😊").length // → 4 bytes\n\n// Python 3\nlen("😊")       # → 1 (characters)\nlen("😊".encode("utf-8"))  # → 4 bytes`,
      color: "var(--rose)",
    },
    {
      title: "Truncating at byte index",
      icon: "✂️",
      bad: `// Cutting a UTF-8 string at byte 3 can split a multi-byte character:\nconst buf = Buffer.from("中文")  // 6 bytes: E4 B8 AD E6 96 87\nconst broken = buf.slice(0, 4).toString("utf8")\n// → "中" + partial bytes → corrupted character`,
      good: `// Always use character-aware APIs:\nconst str = "中文"\nconst safe = [...str].slice(0, 1).join("")  // "中"\n// or use proper unicode-aware substring`,
      color: "var(--amber)",
    },
    {
      title: "Forgetting BOM (Byte Order Mark)",
      icon: "🔖",
      bad: `// UTF-8 BOM: EF BB BF (invisible but real bytes)\n// Files saved by some Windows editors include this.\n// Parsers that don't handle BOM may include it in output:\nif (text.startsWith("\\uFEFF")) {  // BOM character\n  // ← this is why your JSON sometimes fails to parse\n}`,
      good: `// Strip BOM if present:\nconst cleaned = text.replace(/^\\uFEFF/, "")\n// Always specify encoding when reading files:\nfs.readFile(path, { encoding: "utf8" })`,
      color: "var(--blue)",
    },
    {
      title: "Invalid byte sequences",
      icon: "⚠️",
      bad: `// Lone continuation bytes or truncated sequences are INVALID:\n// 0x80 alone is invalid (continuation without leading)\n// 0xC0 0x80 is "overlong" encoding of U+0000 (security issue)\n// Sequences > U+10FFFF are invalid`,
      good: `// Always validate UTF-8 on input from untrusted sources:\n// Rust: str::from_utf8(bytes)?  // returns Err on invalid\n// Go:   utf8.Valid(b)           // returns false\n// Python: bytes.decode("utf-8", errors="strict")`,
      color: "var(--violet)",
    },
  ];

  return (
    <div className="utf-root" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{css}</style>
      {pitfalls.map((p) => (
        <div
          key={p.title}
          style={{
            background: "var(--bg-2)",
            border: `1px solid var(--border)`,
            borderLeft: `3px solid ${p.color}`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>{p.icon}</span>
            <span style={{ fontWeight: 700, color: p.color }}>{p.title}</span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--rose)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                ✗ Problem
              </div>
              <pre
                style={{
                  background: "rgba(251,113,133,0.06)",
                  border: "1px solid rgba(251,113,133,0.2)",
                  borderRadius: 8,
                  padding: 14,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.72rem",
                  color: "var(--text-dim)",
                  overflowX: "auto",
                  margin: 0,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {p.bad}
              </pre>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--green)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                ✓ Solution
              </div>
              <pre
                style={{
                  background: "rgba(74,222,128,0.06)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  borderRadius: 8,
                  padding: 14,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.72rem",
                  color: "var(--text-dim)",
                  overflowX: "auto",
                  margin: 0,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {p.good}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}