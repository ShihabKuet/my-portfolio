"use client";

import { useState } from "react";

const STEPS = [
  {
    id: 0,
    title: "🧠 Step 1: You type google.com",
    desc: 'Your browser asks the OS: "Hey! I need to reach 142.250.195.46 (Google). Which door should I use?"',
    highlight: "pc",
    packet: null as string | null,
    routingTable: true,
  },
  {
    id: 1,
    title: "📋 Step 2: OS checks the Routing Table",
    desc: "The OS has a magic cheat-sheet called the Routing Table. It says: 'For traffic to 0.0.0.0/0 (anywhere on the Internet), use the gateway with the lowest metric!'",
    highlight: "table",
    packet: null as string | null,
    routingTable: true,
  },
  {
    id: 2,
    title: "🏆 Step 3: OS picks NIC-1 — Lower Metric Wins!",
    desc: "NIC-1 has metric 100, NIC-2 has metric 200. Lower metric = higher priority. OS picks NIC-1 and sends the packet toward Router-1 at 192.168.1.1.",
    highlight: "nic1",
    packet: "nic1",
    routingTable: true,
  },
  {
    id: 3,
    title: "📦 Step 4: Packet travels to Router-1",
    desc: "The packet leaves your PC via NIC-1 (IP: 192.168.1.10), hits Router-1 at 192.168.1.1, which then forwards it out to the wild Internet!",
    highlight: "router1",
    packet: "router1",
    routingTable: false,
  },
  {
    id: 4,
    title: "🌍 Step 5: Packet reaches Google!",
    desc: "Router-1 performs NAT — swaps your private IP for its public WAN IP — and Google responds. Round trip: milliseconds. 🚀",
    highlight: "internet",
    packet: "internet",
    routingTable: false,
  },
];

const ROUTING_TABLE = [
  { dest: "192.168.1.0/24", gateway: "—", iface: "NIC-1", metric: 100, note: "Local LAN-1" },
  { dest: "192.168.2.0/24", gateway: "—", iface: "NIC-2", metric: 200, note: "Local LAN-2" },
  { dest: "0.0.0.0/0", gateway: "192.168.1.1", iface: "NIC-1", metric: 100, note: "Default ✅ WINNER" },
  { dest: "0.0.0.0/0", gateway: "192.168.2.1", iface: "NIC-2", metric: 200, note: "Default (backup)" },
];

export default function NicRoutingDemo() {
  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const cur = STEPS[step];
  const hl = cur.highlight;

  const next  = () => { if (step < STEPS.length - 1) { setStep(s => s + 1); setAnimKey(k => k + 1); } };
  const prev  = () => { if (step > 0)                { setStep(s => s - 1); setAnimKey(k => k + 1); } };
  const reset = () => { setStep(0); setAnimKey(k => k + 1); };

  const glow = (id: string) => ({
    transition: "all 0.4s ease",
    transform: hl === id ? "scale(1.1)" : "scale(1)",
    filter:    hl === id ? "drop-shadow(0 0 14px #00ff88)" : "drop-shadow(0 0 2px rgba(0,0,0,0.2))",
  });

  const packetPos: Record<string, { x: number; y: number }> = {
    nic1:     { x: 195, y: 148 },
    router1:  { x: 72,  y: 95  },
    internet: { x: 265, y: 25  },
  };

  return (
    <div style={{
      background: "#080c18",
      borderRadius: 16,
      border: "1px solid #1e2d40",
      fontFamily: "'Courier New', monospace",
      color: "#c9d1d9",
      padding: "24px 20px",
      boxSizing: "border-box",
      margin: "2rem 0",
    }}>
      <style>{`
        @keyframes nic-pulse  { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes nic-fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes nic-dash   { to{stroke-dashoffset:-18} }
        .nic-wire { stroke-dasharray:7 5; animation:nic-dash .5s linear infinite; }
        .nic-on   { stroke:#00ff88; }
        .nic-off  { stroke:#1e2d40; }
        .nic-btn  {
          cursor:pointer; padding:9px 22px; border-radius:8px;
          border:1.5px solid #1e2d40; background:#0f1624;
          color:#64748b; font-family:monospace; font-size:.82rem;
          transition:all .2s; outline:none;
        }
        .nic-btn:hover:not(:disabled) { border-color:#00ff88; color:#00ff88; background:#001a10; }
        .nic-btn:disabled  { opacity:.25; cursor:not-allowed; }
        .nic-btn.nic-go    { background:#001a10; border-color:#00ff88; color:#00ff88; font-weight:bold; }
        .nic-fa            { animation:nic-fadeUp .4s ease; }
        .nic-packet        { animation:nic-pulse 1s infinite; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ color: "#00ff88", letterSpacing: 3, fontSize: ".75rem", marginBottom: 4 }}>
          // INTERACTIVE DEMO 🧪
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#e2e8f0" }}>
          Multiple NICs &amp; Internet Routing
        </div>
        <div style={{ color: "#334155", fontSize: ".72rem", marginTop: 4 }}>
          Your PC · 2 NICs · 2 Routers · Who wins the packet? 🥊
        </div>
      </div>

      {/* ── Network Diagram ── */}
      <div style={{ maxWidth: 540, margin: "0 auto" }}>
        <svg viewBox="0 0 540 220" width="100%" style={{ display: "block" }}>
          {/* Wires */}
          <line x1="270" y1="44" x2="88"  y2="80"
            className={`nic-wire ${hl === "router1" || hl === "internet" ? "nic-on" : "nic-off"}`}
            strokeWidth="2" />
          <line x1="270" y1="44" x2="452" y2="80"
            className={`nic-wire ${hl === "internet" ? "nic-on" : "nic-off"}`}
            strokeWidth="2" />
          <line x1="88"  y1="102" x2="200" y2="148"
            className={`nic-wire ${hl === "nic1" || hl === "router1" ? "nic-on" : "nic-off"}`}
            strokeWidth="2" />
          <line x1="452" y1="102" x2="340" y2="148"
            className={`nic-wire ${hl === "nic2" ? "nic-on" : "nic-off"}`}
            strokeWidth="2" />

          {/* Animated packet */}
          {cur.packet && packetPos[cur.packet] && (
            <text
              key={animKey}
              x={packetPos[cur.packet].x}
              y={packetPos[cur.packet].y}
              fontSize="22"
              className="nic-packet"
              style={{ filter: "drop-shadow(0 0 8px #00ff88)" }}
            >📦</text>
          )}

          {/* Internet */}
          <g style={glow("internet")}>
            <text x="268" y="32" fontSize="28" textAnchor="middle">🌍</text>
            <text x="268" y="47" fontSize="9"   fill="#60a5fa" textAnchor="middle">Internet</text>
            <text x="268" y="57" fontSize="7.5" fill="#475569" textAnchor="middle">142.250.195.46</text>
          </g>

          {/* Router-1 */}
          <g style={glow("router1")}>
            <text x="72" y="80"  fontSize="26" textAnchor="middle">📡</text>
            <text x="72" y="96"  fontSize="9"   fill="#f59e0b" textAnchor="middle" fontWeight="bold">Router-1</text>
            <text x="72" y="107" fontSize="7.5" fill="#64748b" textAnchor="middle">WAN 203.0.113.1</text>
            <text x="72" y="117" fontSize="7.5" fill="#64748b" textAnchor="middle">LAN 192.168.1.1</text>
          </g>

          {/* Router-2 */}
          <g style={glow("router2")}>
            <text x="465" y="80"  fontSize="26" textAnchor="middle">📡</text>
            <text x="465" y="96"  fontSize="9"   fill="#94a3b8" textAnchor="middle" fontWeight="bold">Router-2</text>
            <text x="465" y="107" fontSize="7.5" fill="#475569" textAnchor="middle">WAN 198.51.100.1</text>
            <text x="465" y="117" fontSize="7.5" fill="#475569" textAnchor="middle">LAN 192.168.2.1</text>
          </g>

          {/* PC */}
          <g style={glow("pc")}>
            <text x="270" y="165" fontSize="30" textAnchor="middle">🖥️</text>
            <text x="270" y="181" fontSize="9"  fill="#a78bfa" textAnchor="middle" fontWeight="bold">Your PC</text>
          </g>

          {/* NIC-1 Badge */}
          <g style={glow("nic1")}>
            <rect x="126" y="152" width="86" height="46" rx="7"
              fill={hl === "nic1" ? "#001a10" : "#0d1421"}
              stroke={hl === "nic1" ? "#00ff88" : "#1e2d40"}
              strokeWidth="1.2" />
            <text x="169" y="165" fontSize="8.5" fill={hl === "nic1" ? "#00ff88" : "#475569"} textAnchor="middle">🔌 NIC-1</text>
            <text x="169" y="177" fontSize="7.5" fill="#64748b" textAnchor="middle">192.168.1.10</text>
            <text x="169" y="189" fontSize="7.5" fill="#00ff88" textAnchor="middle">metric: 100 ⚡</text>
          </g>

          {/* NIC-2 Badge */}
          <g style={glow("nic2")}>
            <rect x="328" y="152" width="86" height="46" rx="7"
              fill="#0d1421" stroke="#1e2d40" strokeWidth="1.2" />
            <text x="371" y="165" fontSize="8.5" fill="#475569" textAnchor="middle">🔌 NIC-2</text>
            <text x="371" y="177" fontSize="7.5" fill="#64748b" textAnchor="middle">192.168.2.20</text>
            <text x="371" y="189" fontSize="7.5" fill="#f59e0b" textAnchor="middle">metric: 200</text>
          </g>
        </svg>
      </div>

      {/* ── Step Card ── */}
      <div
        key={animKey}
        className="nic-fa"
        style={{
          maxWidth: 540, margin: "14px auto 0",
          background: "#0d1421",
          border: "1.5px solid #1e2d40",
          borderLeft: "3px solid #00ff88",
          borderRadius: 10,
          padding: "13px 16px",
        }}
      >
        <div style={{ color: "#00ff88", fontWeight: "bold", fontSize: ".88rem", marginBottom: 6 }}>
          {cur.title}
        </div>
        <div style={{ color: "#94a3b8", fontSize: ".78rem", lineHeight: 1.7 }}>
          {cur.desc}
        </div>
      </div>

      {/* ── Routing Table ── */}
      {cur.routingTable && (
        <div key={"rt" + animKey} className="nic-fa" style={{ maxWidth: 540, margin: "12px auto 0" }}>
          <div style={{ fontSize: ".68rem", color: "#475569", marginBottom: 6 }}>
            <span style={{ color: "#64748b" }}>$</span>{" "}
            <span style={{ color: "#a78bfa" }}>route -n</span>{" "}
            <span style={{ color: "#334155" }}>— OS Routing Table</span>
          </div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #1e2d40" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".67rem" }}>
              <thead>
                <tr style={{ background: "#111827" }}>
                  {["Destination", "Gateway", "Interface", "Metric", "Note"].map(h => (
                    <th key={h} style={{
                      padding: "7px 10px", textAlign: "left",
                      color: "#475569", borderBottom: "1px solid #1e2d40",
                      fontWeight: "normal", letterSpacing: 1,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROUTING_TABLE.map((row, i) => {
                  const win = (hl === "nic1" || hl === "table") && row.note.includes("WINNER");
                  return (
                    <tr key={i} style={{
                      background: win ? "#001a10" : i % 2 === 0 ? "#0a0e18" : "#0d1421",
                      transition: "background .3s",
                    }}>
                      <td style={{ padding: "5px 10px", color: win ? "#00ff88" : "#60a5fa", fontFamily: "monospace" }}>{row.dest}</td>
                      <td style={{ padding: "5px 10px", color: "#f59e0b" }}>{row.gateway}</td>
                      <td style={{ padding: "5px 10px", color: win ? "#00ff88" : "#a78bfa" }}>{row.iface}</td>
                      <td style={{ padding: "5px 10px", color: win ? "#00ff88" : "#64748b", fontWeight: win ? "bold" : "normal" }}>{row.metric}</td>
                      <td style={{ padding: "5px 10px", color: win ? "#00ff88" : "#334155", fontSize: ".63rem" }}>{row.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Controls ── */}
      <div style={{
        maxWidth: 540, margin: "16px auto 0",
        display: "flex", gap: 12, justifyContent: "center", alignItems: "center",
      }}>
        <button className="nic-btn" onClick={prev} disabled={step === 0}>← Prev</button>
        <div style={{ display: "flex", gap: 6 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%",
              background: i === step ? "#00ff88" : "#1e2d40",
              transition: "background .3s",
            }} />
          ))}
        </div>
        {step < STEPS.length - 1
          ? <button className="nic-btn nic-go" onClick={next}>Next →</button>
          : <button className="nic-btn nic-go" onClick={reset}>↺ Replay</button>
        }
      </div>

      {/* ── Fun fact footer ── */}
      <div style={{
        maxWidth: 540, margin: "14px auto 0",
        background: "#0a0e18", border: "1px dashed #1e2d40",
        borderRadius: 8, padding: "10px 14px",
        fontSize: ".68rem", color: "#334155", lineHeight: 1.8,
      }}>
        <span style={{ color: "#f59e0b" }}>💡 </span>
        Override manually:{" "}
        <code style={{ color: "#a78bfa" }}>ip route add</code> (Linux) ·{" "}
        <code style={{ color: "#a78bfa" }}>route ADD</code> (Windows) ·
        NIC-2 auto-takes over if NIC-1 dies ={" "}
        <span style={{ color: "#60a5fa" }}>failover</span> ·
        Both NICs active at once ={" "}
        <span style={{ color: "#60a5fa" }}>policy-based routing</span>
      </div>
    </div>
  );
}
