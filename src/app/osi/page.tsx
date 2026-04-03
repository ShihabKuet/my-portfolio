"use client";

// NOTE: Add `darkMode: "class"` to your tailwind.config.ts

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// ── Layer data ─────────────────────────────────────────────────────────────────

interface Field {
  name: string;
  size: string;
  value: string;
}

interface Layer {
  osiNumber: number;
  name: string;
  protocol: string;
  pdu: string;
  role: string;
  accent: string;
  fields: Field[];
  payloadLabel: string;
  trailer?: Field;
}

const LAYERS: Layer[] = [
  {
    osiNumber: 7,
    name: "Application Layer",
    protocol: "TFTP",
    pdu: "Message",
    role: "Data origination — application generates request/data",
    accent: "#a78bfa",
    fields: [
      { name: "Opcode",  size: "2B", value: "0x03 (DATA)" },
      { name: "Block #", size: "2B", value: "0x0001"      },
    ],
    payloadLabel: "File Data (512 bytes)",
  },
  {
    osiNumber: 4,
    name: "Transport Layer",
    protocol: "UDP",
    pdu: "Datagram",
    role: "End-to-end delivery — port-based multiplexing, no connection overhead",
    accent: "#60a5fa",
    fields: [
      { name: "Src Port", size: "2B", value: "61234"     },
      { name: "Dst Port", size: "2B", value: "69 (TFTP)" },
      { name: "Length",   size: "2B", value: "524 bytes" },
      { name: "Checksum", size: "2B", value: "0xA4F2"    },
    ],
    payloadLabel: "TFTP Packet (516 bytes)",
  },
  {
    osiNumber: 3,
    name: "Network Layer",
    protocol: "IPv4",
    pdu: "Packet",
    role: "Logical addressing — routes datagrams across networks",
    accent: "#34d399",
    fields: [
      { name: "Ver / IHL", size: "1B", value: "0x45"        },
      { name: "TTL",       size: "1B", value: "64"           },
      { name: "Protocol",  size: "1B", value: "17 (UDP)"     },
      { name: "Src IP",    size: "4B", value: "192.168.1.10" },
      { name: "Dst IP",    size: "4B", value: "192.168.1.1"  },
    ],
    payloadLabel: "UDP Datagram (524 bytes)",
  },
  {
    osiNumber: 2,
    name: "Data Link Layer",
    protocol: "Ethernet II",
    pdu: "Frame",
    role: "Physical addressing — local LAN delivery via MAC",
    accent: "#fbbf24",
    fields: [
      { name: "Dst MAC",   size: "6B", value: "AA:BB:CC:DD:EE:FF" },
      { name: "Src MAC",   size: "6B", value: "11:22:33:44:55:66" },
      { name: "EtherType", size: "2B", value: "0x0800 (IPv4)"     },
    ],
    payloadLabel: "IP Datagram (544 bytes)",
    trailer: { name: "FCS", size: "4B", value: "0x1A2B3C4D" },
  },
  {
    osiNumber: 1,
    name: "Physical Layer",
    protocol: "Signals",
    pdu: "Bits",
    role: "Bit transmission — electrical / optical / radio signals",
    accent: "#94a3b8",
    fields: [
      { name: "Encoding", size: "—", value: "Manchester / NRZ-L"  },
      { name: "Medium",   size: "—", value: "Cat6 / Fiber / WiFi" },
      { name: "Bitrate",  size: "—", value: "1 Gbps"              },
    ],
    payloadLabel: "Ethernet Frame (4,624 bits)",
  },
];

// ── Incoming Packet Card ────────────────────────────────────────────────────────
// Shows the previous layer's PDU in compact form — this card "falls in" from above
// to represent the packet being handed down the stack.

function IncomingPacketCard({ layer }: { layer: Layer }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: `${layer.accent}08`,
        border: `1px solid ${layer.accent}40`,
      }}
    >
      {/* Protocol badge */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
          style={{ background: `${layer.accent}25`, color: layer.accent }}
        >
          {layer.protocol}
        </div>
        <span className="text-[10px] font-mono text-sky-400 dark:text-zinc-600">
          {layer.pdu} · handed down ↓
        </span>
      </div>

      {/* Compact field grid — odd last field spans full width */}
      <div className="grid grid-cols-2 gap-[3px] mb-[6px]">
        {layer.fields.map((f, fi) => (
          <div
            key={f.name}
            className={`px-2 py-[4px] rounded font-mono text-[9px] ${
              fi === layer.fields.length - 1 && layer.fields.length % 2 !== 0
                ? "col-span-2"
                : ""
            }`}
            style={{
              background: `${layer.accent}10`,
              borderLeft: `2px solid ${layer.accent}50`,
            }}
          >
            <div
              className="text-[8px] mb-[1px] opacity-60"
              style={{ color: layer.accent }}
            >
              {f.name}
            </div>
            <div className="text-sky-700 dark:text-zinc-400 truncate">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Payload label */}
      <div
        className="px-2 py-[5px] rounded font-mono text-[10px] border border-dashed"
        style={{ borderColor: `${layer.accent}30` }}
      >
        <span className="text-sky-400 dark:text-zinc-600 text-[9px] mr-1">DATA →</span>
        <span className="text-sky-500 dark:text-zinc-500">{layer.payloadLabel}</span>
      </div>
    </div>
  );
}

// ── Data Source Card (Application layer only) ──────────────────────────────────
// Simulates raw file bytes being handed to TFTP before any header is added.

function DataSourceCard({ accent }: { accent: string }) {
  const hex = ["46","49","52","4D","57","41","52","45",
               "00","01","00","00","00","00","55","AA"];
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: `${accent}08`, border: `1px solid ${accent}40` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
          style={{ background: `${accent}25`, color: accent }}
        >
          FILE DATA
        </div>
        <span className="text-[10px] font-mono text-sky-400 dark:text-zinc-600">
          firmware.bin · block #1 · 512 B
        </span>
      </div>
      <div className="font-mono text-[9px] leading-[1.9] break-all">
        {hex.map((b, i) => (
          <span
            key={i}
            className="mr-1.5"
            style={{
              color:   i % 4 === 0 ? accent : undefined,
              opacity: i % 4 === 0 ? 0.85   : 0.4,
            }}
          >
            {b}
          </span>
        ))}
        <span className="text-sky-400 dark:text-zinc-600 opacity-30"> ···</span>
      </div>
    </div>
  );
}

// ── Static field row ───────────────────────────────────────────────────────────

function FieldRow({ field, accent }: { field: Field; accent: string }) {
  return (
    <div
      className="flex justify-between px-2.5 py-[5px] mb-[3px] rounded-r-md"
      style={{
        borderLeft: `2.5px solid ${accent}`,
        background: `${accent}12`,
      }}
    >
      <div>
        <span
          className="text-[11px] font-bold font-mono"
          style={{ color: accent }}
        >
          {field.name}
        </span>
        <div className="text-[11px] font-mono text-sky-700 dark:text-zinc-400">
          {field.value}
        </div>
      </div>
      <span className="text-[10px] font-mono text-sky-400 dark:text-zinc-600 self-center">
        {field.size}
      </span>
    </div>
  );
}

// ── Animated field row ─────────────────────────────────────────────────────────
// Extracted into its own component so useTransform is called at the top level
// (Rules of Hooks: no hooks inside .map()).

interface AnimatedFieldRowProps {
  field: Field;
  accent: string;
  fieldIndex: number;
  totalFields: number;
  scrollYProgress: MotionValue<number>;
}

function AnimatedFieldRow({
  field,
  accent,
  fieldIndex,
  totalFields,
  scrollYProgress,
}: AnimatedFieldRowProps) {
  const start   = 0.32 + fieldIndex * (0.28 / totalFields);
  const end     = start + 0.12;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const x       = useTransform(scrollYProgress, [start, end], [-14, 0]);

  return (
    <motion.div style={{ opacity, x }}>
      <FieldRow field={field} accent={accent} />
    </motion.div>
  );
}

// ── Accumulated packet strip ───────────────────────────────────────────────────

function PacketStrip({ upToIndex }: { upToIndex: number }) {
  const visible = LAYERS.slice(0, upToIndex + 1);
  return (
    <div className="flex gap-[3px] mt-3 items-center flex-wrap">
      <span className="text-[10px] font-mono text-sky-400 dark:text-zinc-600 mr-1">
        PDU:
      </span>
      {[...visible].reverse().map((layer, i) => (
        <motion.div
          key={layer.protocol}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: i * 0.07 }}
          className="px-2 py-[2px] rounded text-[10px] font-mono font-bold whitespace-nowrap"
          style={{
            background: `${layer.accent}20`,
            border: `1px solid ${layer.accent}50`,
            color: layer.accent,
            transformOrigin: "left",
          }}
        >
          {layer.protocol}
        </motion.div>
      ))}
      <div className="flex-1 min-w-[50px] px-2 py-[2px] rounded font-mono text-[10px] text-center
                      bg-sky-100 dark:bg-zinc-800
                      border border-sky-200 dark:border-zinc-700/50
                      text-sky-400 dark:text-zinc-600">
        DATA ██████
      </div>
    </div>
  );
}

// ── Single layer section ───────────────────────────────────────────────────────

function LayerSection({ layer, index }: { layer: Layer; index: number }) {
  const ref       = useRef<HTMLDivElement>(null);
  const prevLayer = index > 0 ? LAYERS[index - 1] : null;
  const isLast    = index === LAYERS.length - 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 15%"],
  });

  // ── Scroll animation phases ───────────────────────────────────────────────
  //
  //  0.00 – 0.28  Phase 1 : incoming PDU card drags down from y=-70
  //  0.26 – 0.36  Phase 2a: separator "+ PROTO HEADER ↓" fades in
  //  0.32 – 0.65  Phase 2b: header fields slide in from x=-14 (staggered)
  //  0.55 – 0.65  Phase 3a: Ethernet FCS trailer (if present)
  //  0.55 – 0.63  Phase 3b: "✓ built" badge appears
  //  0.65 – 0.74  Phase 4 : packet strip + final message appear
  //  0.00 – 0.12  Fade-in  : entire section

  const incomingY        = useTransform(scrollYProgress, [0.00, 0.28], [-70, 0]);
  const incomingOpacity  = useTransform(scrollYProgress, [0.00, 0.22], [0,   1]);
  const separatorOpacity = useTransform(scrollYProgress, [0.26, 0.36], [0,   1]);
  const headerShow       = useTransform(scrollYProgress, [0.55, 0.63], [0,   1]);
  const trailerOpacity   = useTransform(scrollYProgress, [0.55, 0.65], [0,   1]);
  const encapShow        = useTransform(scrollYProgress, [0.65, 0.74], [0,   1]);
  const sectionOpacity   = useTransform(scrollYProgress, [0.00, 0.12], [0,   1]);

  return (
    <section ref={ref} className="min-h-[160vh] pb-20">
      <div className="sticky top-[10vh] flex justify-center px-5">
        <motion.div
          style={{ opacity: sectionOpacity }}
          className="w-full max-w-[860px]"
        >
          {/* ── Section header ── */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0"
              style={{
                background: `${layer.accent}20`,
                border: `1px solid ${layer.accent}40`,
                color: layer.accent,
              }}
            >
              L{layer.osiNumber}
            </div>
            <div>
              <div className="font-bold text-base text-sky-950 dark:text-zinc-100">
                {layer.name}
              </div>
              <div className="text-xs font-mono" style={{ color: layer.accent }}>
                {layer.protocol} · PDU: {layer.pdu}
              </div>
            </div>
            <div
              className="ml-auto px-3 py-1 rounded-full text-[11px] font-mono"
              style={{
                background: `${layer.accent}15`,
                border: `1px solid ${layer.accent}30`,
                color: layer.accent,
              }}
            >
              OSI Layer {layer.osiNumber}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1.3fr] gap-4">

            {/* ── LEFT: role + Physical bit stream ── */}
            <div
              className="p-[18px] rounded-2xl flex flex-col gap-3"
              style={{
                background: `${layer.accent}08`,
                border: `1px solid ${layer.accent}25`,
              }}
            >
              <p className="text-[13px] leading-[1.7] text-sky-700 dark:text-zinc-400">
                {layer.role}
              </p>

              {isLast && (
                <motion.div style={{ opacity: encapShow }}>
                  <div className="p-[10px_14px] rounded-[10px] font-mono text-[10px] leading-[2] break-all
                                  bg-sky-100/60 dark:bg-zinc-900/30
                                  border border-sky-200 dark:border-zinc-800
                                  text-sky-400 dark:text-zinc-600">
                    <div className="text-[11px] mb-[6px] text-slate-400">
                      BIT STREAM →
                    </div>
                    {["10101010","10101011","00000001","00000110","01000101",
                      "01000000","00010001","11000000","10101000","00000001","..."].map((b, i) => (
                      <span
                        key={i}
                        className={`mr-[5px] ${
                          i % 2 === 0 ? "text-slate-400" : "text-sky-400 dark:text-zinc-600"
                        }`}
                      >
                        {b}{" "}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── RIGHT: animated packet building ── */}
            <div
              className="p-[18px] rounded-2xl bg-sky-100 dark:bg-zinc-800"
              style={{ border: `1px solid ${layer.accent}30` }}
            >
              {/* Label row */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono text-sky-400 dark:text-zinc-600">
                  {layer.protocol} HEADER GENERATION
                </span>
                <motion.span
                  style={{ opacity: headerShow }}
                  className="text-[10px] font-mono text-green-500"
                >
                  ✓ built
                </motion.span>
              </div>

              {/* ── Phase 1: Incoming PDU drags down from the layer above ── */}
              <motion.div style={{ y: incomingY, opacity: incomingOpacity }}>
                {index === 0
                  ? <DataSourceCard accent={layer.accent} />
                  : <IncomingPacketCard layer={prevLayer!} />
                }
              </motion.div>

              {/* ── Phase 2a: Separator — signals header is being added ── */}
              <motion.div
                style={{ opacity: separatorOpacity }}
                className="flex items-center gap-2 my-3"
              >
                <div className="flex-1 h-px bg-sky-200 dark:bg-zinc-700/50" />
                <span
                  className="text-[9px] font-mono px-2 py-[3px] rounded whitespace-nowrap"
                  style={{
                    color: layer.accent,
                    background: `${layer.accent}12`,
                    border: `1px solid ${layer.accent}35`,
                  }}
                >
                  + {layer.protocol} HEADER ↓
                </span>
                <div className="flex-1 h-px bg-sky-200 dark:bg-zinc-700/50" />
              </motion.div>

              {/* ── Phase 2b: Header fields slide in from left, one by one ── */}
              {layer.fields.map((field, fi) => (
                <AnimatedFieldRow
                  key={field.name}
                  field={field}
                  accent={layer.accent}
                  fieldIndex={fi}
                  totalFields={layer.fields.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}

              {/* Ethernet FCS trailer */}
              {layer.trailer && (
                <motion.div style={{ opacity: trailerOpacity }} className="mt-1">
                  <FieldRow field={layer.trailer} accent={layer.accent} />
                </motion.div>
              )}

              {/* ── Phase 4: Full PDU strip ── */}
              <motion.div style={{ opacity: encapShow }}>
                <PacketStrip upToIndex={index} />
              </motion.div>

              {!isLast && (
                <motion.div
                  style={{ opacity: encapShow }}
                  className="mt-[14px] text-center text-[11px] font-mono text-sky-400 dark:text-zinc-600"
                >
                  ↓ scroll — {LAYERS[index + 1].protocol} layer encapsulates this
                </motion.div>
              )}

              {isLast && (
                <motion.div
                  style={{ opacity: encapShow }}
                  className="mt-[14px] text-center text-xs font-mono font-bold text-green-500"
                >
                  ✓ Frame ready for transmission
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Side OSI stack navigator ───────────────────────────────────────────────────

function SideNav() {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-50">
      {LAYERS.map((layer) => (
        <a
          key={layer.osiNumber}
          href={`#layer-${layer.osiNumber}`}
          title={`Layer ${layer.osiNumber}: ${layer.protocol}`}
          className="block w-2.5 h-2.5 rounded-full transition-transform duration-200 hover:scale-[1.4]"
          style={{
            background: `${layer.accent}40`,
            border: `1.5px solid ${layer.accent}`,
          }}
        />
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function OSIPage() {
  return (
    <main className="bg-white dark:bg-zinc-950 min-h-screen pb-[120px]">
      <SideNav />

      {/* ── Hero intro ── */}
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-[60px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-5
                        bg-sky-100/60 dark:bg-zinc-900/30
                        border border-sky-200 dark:border-zinc-800
                        text-[12px] font-mono"
            style={{ color: LAYERS[0].accent }}
          >
            Interactive · Scroll-driven · Reversible
          </div>

          <h1 className="text-[clamp(28px,5vw,52px)] font-extrabold leading-[1.2] mb-4
                         text-sky-950 dark:text-zinc-100">
            TCP/IP Encapsulation
          </h1>

          <p className="text-base max-w-[520px] mx-auto mb-8 leading-[1.7]
                        text-sky-500 dark:text-zinc-500">
            Watch a TFTP file transfer travel down the OSI stack. Each layer
            drags the packet in from above and appends its own header around it.
            Scroll down to transmit, scroll up to reverse.
          </p>

          <div className="flex gap-2 justify-center flex-wrap">
            {LAYERS.map((l) => (
              <span
                key={l.protocol}
                className="px-3 py-1 rounded-full text-xs font-mono"
                style={{
                  background: `${l.accent}15`,
                  border: `1px solid ${l.accent}35`,
                  color: l.accent,
                }}
              >
                {l.protocol}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-xs font-mono flex flex-col items-center gap-1.5
                     text-sky-400 dark:text-zinc-600"
        >
          <span>start scrolling</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* ── Layer sections ── */}
      <div className="px-6">
        {LAYERS.map((layer, i) => (
          <div key={layer.osiNumber} id={`layer-${layer.osiNumber}`}>
            <LayerSection layer={layer} index={i} />

            {i < LAYERS.length - 1 && (
              <div className="flex items-center gap-4 pb-10 max-w-[860px] mx-auto">
                <div className="flex-1 h-px bg-sky-200 dark:bg-zinc-800" />
                <div className="flex items-center gap-2 text-[11px] font-mono text-sky-400 dark:text-zinc-600">
                  <span style={{ color: layer.accent }}>↓</span>
                  <span>{layer.protocol} hands off to {LAYERS[i + 1].protocol}</span>
                  <span style={{ color: LAYERS[i + 1].accent }}>↓</span>
                </div>
                <div className="flex-1 h-px bg-sky-200 dark:bg-zinc-800" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Final summary ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[860px] mx-auto mt-[60px] p-8 rounded-[20px] text-center
                   bg-sky-100 dark:bg-zinc-800
                   border border-sky-200 dark:border-zinc-800"
      >
        <div className="text-[13px] font-mono mb-3 text-green-500">
          ✓ TRANSMISSION COMPLETE
        </div>
        <h2 className="text-xl font-bold mb-2 text-sky-950 dark:text-zinc-100">
          Complete Encapsulation
        </h2>
        <p className="text-[13px] mb-6 leading-[1.7] text-sky-500 dark:text-zinc-500">
          The TFTP data payload has been wrapped by 4 protocol headers and is
          ready for physical transmission as an Ethernet frame.
        </p>

        <div className="flex gap-[3px] justify-center flex-wrap items-center">
          {(["Ethernet", "IPv4", "UDP", "TFTP"] as const).map((p, i) => {
            const colors = ["#fbbf24", "#34d399", "#60a5fa", "#a78bfa"];
            return (
              <div
                key={p}
                className="px-3.5 py-1.5 rounded-md text-xs font-mono font-bold"
                style={{
                  background: `${colors[i]}20`,
                  border: `1px solid ${colors[i]}50`,
                  color: colors[i],
                }}
              >
                {p}
              </div>
            );
          })}
          <div className="px-5 py-1.5 rounded-md text-xs font-mono
                          bg-sky-100 dark:bg-zinc-800
                          border border-sky-200 dark:border-zinc-700/50
                          text-sky-400 dark:text-zinc-600">
            DATA ████████████
          </div>
          <div className="text-xs font-mono" style={{ color: "#fbbf24" }}>
            FCS
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl no-underline text-[13px] font-mono"
            style={{
              background: `${LAYERS[0].accent}20`,
              border: `1px solid ${LAYERS[0].accent}40`,
              color: LAYERS[0].accent,
            }}
          >
            <ArrowLeft size={14} />
            Back to portfolio
          </Link>
        </div>
      </motion.div>
    </main>
  );
}