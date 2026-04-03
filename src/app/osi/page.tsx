"use client";

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
    role: "End-to-end delivery — port-based multiplexing",
    accent: "#60a5fa",
    fields: [
      { name: "Src Port", size: "2B", value: "61234"      },
      { name: "Dst Port", size: "2B", value: "69 (TFTP)"  },
      { name: "Length",   size: "2B", value: "524 bytes"  },
      { name: "Checksum", size: "2B", value: "0xA4F2"     },
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

// ── Field row ──────────────────────────────────────────────────────────────────

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
        {/* value: text-sky-700 dark:text-zinc-400 */}
        <div className="text-[11px] font-mono text-sky-700 dark:text-zinc-400">
          {field.value}
        </div>
      </div>
      {/* size: text-sky-400 dark:text-zinc-600 */}
      <span className="text-[10px] font-mono text-sky-400 dark:text-zinc-600 self-center">
        {field.size}
      </span>
    </div>
  );
}

// ── Animated field row (extracted from map to satisfy Rules of Hooks) ──────────

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
  const fieldStart   = 0.30 + fieldIndex * (0.30 / totalFields);
  const fieldEnd     = fieldStart + 0.12;
  const fieldOpacity = useTransform(scrollYProgress, [fieldStart, fieldEnd], [0, 1]);
  const fieldX       = useTransform(scrollYProgress, [fieldStart, fieldEnd], [-8, 0]);

  return (
    <motion.div style={{ opacity: fieldOpacity, x: fieldX }}>
      <FieldRow field={field} accent={accent} />
    </motion.div>
  );
}

// ── Accumulated packet strip ───────────────────────────────────────────────────

function PacketStrip({
  upToIndex,
  show,
}: {
  upToIndex: number;
  show: boolean;
}) {
  const visible = LAYERS.slice(0, upToIndex + 1);
  return (
    <motion.div
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
      transition={{ duration: 0.4 }}
      className="flex gap-[3px] mt-3 items-center flex-wrap"
    >
      {/* PDU label: text-sky-400 dark:text-zinc-600 */}
      <span className="text-[10px] font-mono text-sky-400 dark:text-zinc-600 mr-1">
        PDU:
      </span>

      {[...visible].reverse().map((layer, i) => (
        <motion.div
          key={layer.protocol}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: i * 0.06 }}
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

      {/* DATA block: bg-sky-100 dark:bg-zinc-800, border-sky-200 dark:border-zinc-700/50, text-sky-400 dark:text-zinc-600 */}
      <div className="flex-1 min-w-[50px] px-2 py-[2px] rounded font-mono text-[10px] text-center
                      bg-sky-100 dark:bg-zinc-800
                      border border-sky-200 dark:border-zinc-700/50
                      text-sky-400 dark:text-zinc-600">
        DATA ██████
      </div>
    </motion.div>
  );
}

// ── Single layer section ───────────────────────────────────────────────────────

function LayerSection({ layer, index }: { layer: Layer; index: number }) {
  const ref       = useRef<HTMLDivElement>(null);
  const prevLayer = index > 0 ? LAYERS[index - 1] : null;
  const isLast    = index === LAYERS.length - 1; // Physical layer (fixes layer.id bug)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 15%"],
  });

  const packetY        = useTransform(scrollYProgress, [0.00, 0.30], [-70,  0]);
  const packetOpacity  = useTransform(scrollYProgress, [0.00, 0.25], [0,    1]);
  const headerShow     = useTransform(scrollYProgress, [0.28, 0.32], [0,    1]);
  const encapShow      = useTransform(scrollYProgress, [0.62, 0.68], [0,    1]);
  const sectionOpacity = useTransform(scrollYProgress, [0.00, 0.12], [0,    1]);
  const payloadOpacity = useTransform(
    scrollYProgress,
    index === 0 ? [0.00, 0.15] : [0.25, 0.40],
    [0, 1]
  );
  const trailerOpacity = useTransform(scrollYProgress, [0.55, 0.68], [0, 1]);

  return (
    <section ref={ref} className="min-h-[160vh] pb-20">
      {/* Sticky inner */}
      <div className="sticky top-[10vh] flex justify-center px-5">
        <motion.div
          style={{ opacity: sectionOpacity }}
          className="w-full max-w-[860px]"
        >
          {/* ── Section header ── */}
          <div className="flex items-center gap-3 mb-5">
            {/* L-badge: accent bg/border, accent text */}
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
              {/* Layer name: text-sky-950 dark:text-zinc-100 */}
              <div className="font-bold text-base text-sky-950 dark:text-zinc-100">
                {layer.name}
              </div>
              {/* Protocol line: accent color */}
              <div
                className="text-xs font-mono"
                style={{ color: layer.accent }}
              >
                {layer.protocol} · PDU: {layer.pdu}
              </div>
            </div>

            {/* OSI badge */}
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

            {/* ── Left: role + incoming packet ── */}
            <div
              className="p-[18px] rounded-2xl flex flex-col gap-3"
              style={{
                background: `${layer.accent}08`,
                border: `1px solid ${layer.accent}25`,
              }}
            >
              {/* Role text: text-sky-700 dark:text-zinc-400 */}
              <p className="text-[13px] leading-[1.7] text-sky-700 dark:text-zinc-400">
                {layer.role}
              </p>

              {/* Incoming packet indicator */}
              {prevLayer && (
                <motion.div
                  style={{ y: packetY, opacity: packetOpacity }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                  {/* bg-sky-100/60 dark:bg-zinc-900/30, border accent */}
                  <div
                    className="p-[10px_14px] rounded-[10px] bg-sky-100/60 dark:bg-zinc-900/30"
                    style={{ border: `1px solid ${prevLayer.accent}40` }}
                  >
                    {/* label: text-sky-400 dark:text-zinc-600 */}
                    <div className="text-[10px] font-mono mb-[5px] text-sky-400 dark:text-zinc-600">
                      ↓ ARRIVING FROM LAYER {layer.osiNumber + 1}
                    </div>
                    <div className="text-xs font-mono font-semibold" style={{ color: prevLayer.accent }}>
                      {prevLayer.protocol} {prevLayer.pdu}
                    </div>
                    {/* payload label: text-sky-400 dark:text-zinc-600 */}
                    <div className="text-[11px] font-mono text-sky-400 dark:text-zinc-600">
                      {prevLayer.payloadLabel}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Physical bit stream */}
              {isLast && (
                <motion.div style={{ opacity: encapShow }}>
                  {/* bg-sky-100/60 dark:bg-zinc-900/30, border-sky-200 dark:border-zinc-800 */}
                  <div className="p-[10px_14px] rounded-[10px] font-mono text-[10px] leading-[2] break-all
                                  bg-sky-100/60 dark:bg-zinc-900/30
                                  border border-sky-200 dark:border-zinc-800
                                  text-sky-400 dark:text-zinc-600">
                    {/* BIT STREAM label: text-slate-400 */}
                    <div className="text-[11px] mb-[6px] text-slate-400 dark:text-slate-400">
                      BIT STREAM →
                    </div>
                    {["10101010","10101011","00000001","00000110","01000101",
                      "01000000","00010001","11000000","10101000","00000001","..."].map((b, i) => (
                      <span
                        key={i}
                        className={`mr-[5px] ${
                          i % 2 === 0
                            ? "text-slate-400"
                            : "text-sky-400 dark:text-zinc-600"
                        }`}
                      >
                        {b}{" "}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Right: packet builder ── */}
            {/* bg-sky-100 dark:bg-zinc-800, border accent */}
            <div
              className="p-[18px] rounded-2xl bg-sky-100 dark:bg-zinc-800"
              style={{ border: `1px solid ${layer.accent}30` }}
            >
              <div className="flex justify-between items-center mb-3">
                {/* label: text-sky-400 dark:text-zinc-600 */}
                <span className="text-[10px] font-mono text-sky-400 dark:text-zinc-600">
                  {layer.protocol} HEADER GENERATION
                </span>
                {/* ✓ built: text-green-500 */}
                <motion.span
                  style={{ opacity: headerShow }}
                  className="text-[10px] font-mono text-green-500"
                >
                  ✓ built
                </motion.span>
              </div>

              {/* Header fields — each animated via extracted sub-component */}
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

              {/* Payload from upper layer */}
              {/* bg-sky-100 dark:bg-zinc-800/50, border-sky-200 dark:border-zinc-700/50 */}
              <motion.div
                style={{ opacity: payloadOpacity }}
                className="mt-2 p-[8px_12px] rounded-lg
                           bg-sky-100 dark:bg-zinc-800/50
                           border border-dashed border-sky-200 dark:border-zinc-700/50"
              >
                {/* label: text-sky-400 dark:text-zinc-600 */}
                <div className="text-[10px] font-mono text-sky-400 dark:text-zinc-600">
                  {index === 0 ? "GENERATED DATA" : "PAYLOAD (UPPER LAYER)"}
                </div>
                {/* value: text-sky-500 dark:text-zinc-500 */}
                <div className="text-xs font-mono mt-0.5 text-sky-500 dark:text-zinc-500">
                  {layer.payloadLabel}
                </div>
              </motion.div>

              {/* Ethernet FCS trailer */}
              {layer.trailer && (
                <motion.div style={{ opacity: trailerOpacity }} className="mt-1">
                  <FieldRow field={layer.trailer} accent={layer.accent} />
                </motion.div>
              )}

              {/* Accumulated packet strip */}
              <motion.div style={{ opacity: encapShow }}>
                <PacketStrip upToIndex={index} show={true} />
              </motion.div>

              {/* Arrow hint to next layer */}
              {index < LAYERS.length - 1 && (
                <motion.div
                  style={{ opacity: encapShow }}
                  className="mt-[14px] text-center text-[11px] font-mono text-sky-400 dark:text-zinc-600"
                >
                  ↓ scroll — {LAYERS[index + 1].protocol} layer encapsulates this
                </motion.div>
              )}

              {/* Final layer message */}
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
          {/* Badge: bg-sky-100/60 dark:bg-zinc-900/30, border-sky-200 dark:border-zinc-800 */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-5
                          bg-sky-100/60 dark:bg-zinc-900/30
                          border border-sky-200 dark:border-zinc-800
                          text-[12px] font-mono"
               style={{ color: LAYERS[0].accent }}>
            Interactive · Scroll-driven · Reversible
          </div>

          {/* H1: text-sky-950 dark:text-zinc-100 */}
          <h1 className="text-[clamp(28px,5vw,52px)] font-extrabold leading-[1.2] mb-4
                         text-sky-950 dark:text-zinc-100">
            TCP/IP Encapsulation
          </h1>

          {/* p: text-sky-500 dark:text-zinc-500 */}
          <p className="text-base max-w-[520px] mx-auto mb-8 leading-[1.7]
                        text-sky-500 dark:text-zinc-500">
            Watch a TFTP file transfer travel down the OSI stack — each layer
            wrapping the data in its own header. Scroll down to transmit,
            scroll up to reverse.
          </p>

          {/* Protocol badges */}
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

        {/* Scroll hint: text-sky-400 dark:text-zinc-600 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-xs font-mono flex flex-col items-center gap-1.5
                     text-sky-400 dark:text-zinc-600"
        >
          <span>start scrolling</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* ── Layer sections ── */}
      <div className="px-6">
        {LAYERS.map((layer, i) => (
          <div key={layer.osiNumber} id={`layer-${layer.osiNumber}`}>
            <LayerSection layer={layer} index={i} />

            {/* Divider between layers */}
            {i < LAYERS.length - 1 && (
              <div className="flex items-center gap-4 pb-10 max-w-[860px] mx-auto">
                {/* line: bg-sky-200 dark:bg-zinc-800 */}
                <div className="flex-1 h-px bg-sky-200 dark:bg-zinc-800" />
                {/* text: text-sky-400 dark:text-zinc-600 */}
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
        {/* Status: text-green-500 */}
        <div className="text-[13px] font-mono mb-3 text-green-500">
          ✓ TRANSMISSION COMPLETE
        </div>

        {/* H2: text-sky-950 dark:text-zinc-100 */}
        <h2 className="text-xl font-bold mb-2 text-sky-950 dark:text-zinc-100">
          Complete Encapsulation
        </h2>

        {/* p: text-sky-500 dark:text-zinc-500 */}
        <p className="text-[13px] mb-6 leading-[1.7] text-sky-500 dark:text-zinc-500">
          The TFTP data payload has been wrapped by 4 protocol headers and is
          ready for physical transmission as an Ethernet frame.
        </p>

        {/* Final packet visualization */}
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

          {/* DATA: bg-sky-100 dark:bg-zinc-800, border-sky-200 dark:border-zinc-700/50, text-sky-400 dark:text-zinc-600 */}
          <div className="px-5 py-1.5 rounded-md text-xs font-mono
                          bg-sky-100 dark:bg-zinc-800
                          border border-sky-200 dark:border-zinc-700/50
                          text-sky-400 dark:text-zinc-600">
            DATA ████████████
          </div>

          {/* FCS: Ethernet accent color */}
          <div className="text-xs font-mono" style={{ color: "#fbbf24" }}>
            FCS
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl no-underline
                       text-[13px] font-mono"
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