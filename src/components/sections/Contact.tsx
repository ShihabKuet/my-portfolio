"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { personalInfo } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiResearchgate } from "react-icons/si";
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Loader2, WifiOff, ServerCrash } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Schema ───────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name:    z.string().min(2,  "Name must be at least 2 characters"),
  email:   z.string().email("Please enter a valid email"),
  subject: z.string().min(5,  "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;
type FormStatus = "idle" | "loading" | "success" | "error";

// Postbox animation phase — independent from form status so we can sequence animations
type PostboxPhase = "entering" | "waiting" | "success" | "error";

// ─── Static data ──────────────────────────────────────────────────────────────

const contactInfoItems = [
  { icon: <Mail size={16} />,   label: "Email",    value: personalInfo.email,    href: `mailto:${personalInfo.email}` },
  { icon: <MapPin size={16} />, label: "Location", value: personalInfo.location, href: null },
];

const socialLinks = [
  { icon: <FaGithub size={18} />,      label: "GitHub",      href: personalInfo.github    },
  { icon: <FaLinkedin size={18} />,    label: "LinkedIn",    href: personalInfo.linkedin  },
  { icon: <SiResearchgate size={18}/>, label: "ResearchGate",href: personalInfo.researchgate },
  { icon: <Mail size={18} />,          label: "Email",       href: `mailto:${personalInfo.email}` },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSmtpDate() {
  return new Date().toUTCString().replace("GMT", "+0000");
}

function getMsgId() {
  return `<${Math.random().toString(36).slice(2,10)}.${Date.now()}@portfolio.shanjid.dev>`;
}

function byteSize(str: string) {
  return new Blob([str]).size;
}

// ─── InputField ───────────────────────────────────────────────────────────────

function InputField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sky-800 dark:text-zinc-300 text-sm font-medium mb-2">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-red-400 text-xs flex items-center gap-1 overflow-hidden"
          >
            <AlertCircle size={11} />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass = cn(
  "w-full px-4 py-3 rounded-lg text-sm font-mono",
  "bg-white dark:bg-zinc-900/60 border border-sky-200 dark:border-zinc-800",
  "text-sky-950 dark:text-zinc-100 placeholder:text-sky-300 dark:placeholder:text-zinc-600",
  "focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40",
  "transition-colors duration-200"
);

// ─── Envelope SVG ─────────────────────────────────────────────────────────────

function EnvelopeSVG({ open, color = "#818cf8" }: { open?: boolean; color?: string }) {
  return (
    <svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="64" height="44">
      {/* Body */}
      <rect x="1" y="1" width="62" height="42" rx="4" fill="#0f172a" stroke={color} strokeWidth="1.5"/>
      {/* Bottom fold lines */}
      <path d="M1 42 L28 24 M63 42 L36 24" stroke={color} strokeWidth="1" opacity="0.4"/>
      {/* Flap */}
      <motion.path
        d={open
          ? "M1 1 L32 2 L63 1"   // open flap (flat)
          : "M1 1 L32 20 L63 1"  // closed flap (V shape)
        }
        stroke={color} strokeWidth="1.5" fill={open ? "transparent" : "#1e1b4b"}
        animate={{ d: open ? "M1 1 L32 2 L63 1" : "M1 1 L32 20 L63 1" }}
        transition={{ duration: 0.4, delay: 0.3 }}
      />
      {/* Seal dot */}
      {!open && <circle cx="32" cy="14" r="3" fill={color} opacity="0.6"/>}
    </svg>
  );
}

// ─── Mailbox SVG ──────────────────────────────────────────────────────────────

function MailboxSVG({ flagUp, shake }: { flagUp?: boolean; shake?: boolean }) {
  const controls = useAnimation();

  useEffect(() => {
    if (shake) {
      controls.start({
        x: [0, -6, 6, -5, 5, -3, 3, 0],
        transition: { duration: 0.55, ease: "easeInOut" }
      });
    }
  }, [shake, controls]);

  return (
    <motion.svg
      animate={controls}
      viewBox="0 0 140 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="180"
    >
      {/* Post */}
      <rect x="63" y="125" width="14" height="55" rx="3" fill="#334155"/>
      <rect x="63" y="125" width="14" height="4" rx="1" fill="#475569"/>

      {/* Shadow under post */}
      <ellipse cx="70" cy="178" rx="20" ry="4" fill="#0f172a" opacity="0.4"/>

      {/* Mailbox body */}
      <rect x="8" y="50" width="108" height="76" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>

      {/* Rounded dome top */}
      <path d="M8 58 Q8 50 16 50 L108 50 Q120 50 120 58 L120 68 Q120 58 62 54 Q8 58 8 68 Z"
        fill="#263548" stroke="#475569" strokeWidth="1"/>
      <path d="M8 62 Q62 50 120 62" stroke="#475569" strokeWidth="1" fill="none" opacity="0.6"/>

      {/* Mailbox slot */}
      <rect x="18" y="83" width="72" height="9" rx="4" fill="#060d1a" stroke="#334155" strokeWidth="1"/>
      {/* Slot highlight */}
      <rect x="20" y="84" width="68" height="2" rx="1" fill="#1a2a3a" opacity="0.8"/>

      {/* Side door */}
      <rect x="102" y="54" width="14" height="64" rx="4" fill="#131f2e" stroke="#334155" strokeWidth="1"/>
      <circle cx="104" cy="86" r="2.5" fill="#475569"/>

      {/* Decorative panel line */}
      <line x1="14" y1="72" x2="96" y2="72" stroke="#334155" strokeWidth="1" strokeDasharray="3 3"/>

      {/* Address tag */}
      <rect x="14" y="100" width="40" height="18" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
      <line x1="17" y1="106" x2="50" y2="106" stroke="#334155" strokeWidth="1"/>
      <line x1="17" y1="112" x2="44" y2="112" stroke="#334155" strokeWidth="1"/>

      {/* Flag pole */}
      <rect x="118" y="58" width="3" height="38" rx="1.5" fill="#475569"/>

      {/* Flag — animates up on success */}
      <motion.g
        animate={{ y: flagUp ? -28 : 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
      >
        <rect x="121" y="64" width="18" height="13" rx="2" fill="#ef4444"/>
        <path d="M121 64 L129 70 L121 77 Z" fill="#dc2626" opacity="0.6"/>
      </motion.g>

      {/* Rivet details */}
      <circle cx="14" cy="56" r="2" fill="#475569"/>
      <circle cx="110" cy="56" r="2" fill="#475569"/>
    </motion.svg>
  );
}

// ─── Signal ring component (loading pulse) ───────────────────────────────────

function SignalRing({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full border border-violet-500/50"
      style={{ width: 80, height: 80, top: "50%", left: "50%", x: "-50%", y: "-50%" }}
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: 2.2, opacity: 0 }}
      transition={{ duration: 1.8, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

// ─── PostboxScene ─────────────────────────────────────────────────────────────

function PostboxScene({ phase }: { phase: PostboxPhase }) {
  const isSuccess    = phase === "success";
  const isError      = phase === "error";
  const isWaiting    = phase === "waiting";
  const isEntering   = phase === "entering";

  // Envelope: enters from above → slides into slot
  // On success: pops back up from slot, flap opens, letter peaks out
  const envY = isEntering ? [-80, 77] : isSuccess ? [77, 30] : 77;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 py-4 select-none">

      {/* Postbox + envelope + signal rings */}
      <div className="relative flex items-center justify-center" style={{ width: 160, height: 220 }}>

        {/* Pulsing signal rings (loading/waiting) */}
        {(isWaiting || isEntering) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <SignalRing delay={0} />
            <SignalRing delay={0.5} />
            <SignalRing delay={1.0} />
          </div>
        )}

        {/* Envelope — enters slot, or pops back out on success */}
        <motion.div
          className="absolute z-10"
          style={{ left: "50%", x: "-50%" }}
          initial={{ y: -80, opacity: 1 }}
          animate={
            isEntering
              ? { y: 76, opacity: 1, scale: [1, 1, 0.85], transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }
              : isWaiting
              ? { y: 76, opacity: 0, scale: 0.7, transition: { duration: 0.25 } }
              : isSuccess
              ? { y: [76, 30], opacity: [0, 1], scale: [0.8, 1], transition: { duration: 0.5, delay: 0.15 } }
              : isError
              ? { y: [76, 55, 80], opacity: [0, 1, 1], transition: { duration: 0.5, delay: 0.1 } }
              : { y: 76 }
          }
        >
          <EnvelopeSVG open={isSuccess} color={isError ? "#f87171" : "#818cf8"} />
        </motion.div>

        {/* Letter peeking out on success */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              className="absolute z-20 bg-zinc-100 dark:bg-zinc-200 rounded-sm shadow-md flex items-center justify-center"
              style={{ width: 48, height: 36, left: "50%", x: "-50%", top: 28 }}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 16, opacity: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 18 }}
            >
              <CheckCircle size={16} className="text-emerald-500" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mailbox */}
        <div className="absolute bottom-0" style={{ left: "50%", x: "-50%", transform: "translateX(-50%)" }}>
          <MailboxSVG flagUp={isSuccess} shake={isError} />
        </div>
      </div>

      {/* Status message */}
      <AnimatePresence mode="wait">
        {isEntering && (
          <motion.div
            key="entering"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-center space-y-1"
          >
            <p className="text-violet-400 text-sm font-mono font-semibold flex items-center gap-2 justify-center">
              <Loader2 size={13} className="animate-spin" />
              Transmitting packet...
            </p>
            <p className="text-zinc-500 text-xs font-mono">SMTP handshake in progress</p>
          </motion.div>
        )}

        {isWaiting && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-center space-y-1"
          >
            <p className="text-violet-400 text-sm font-mono flex items-center gap-2 justify-center">
              <Loader2 size={13} className="animate-spin" />
              Awaiting server response...
            </p>
            <p className="text-zinc-500 text-xs font-mono">250 OK — DATA accepted</p>
          </motion.div>
        )}

        {isSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 250 }}
            className="text-center space-y-1.5"
          >
            <div className="flex items-center gap-2 justify-center text-emerald-400 font-mono font-semibold text-sm">
              <CheckCircle size={15} />
              Message delivered!
            </div>
            <p className="text-zinc-500 text-xs font-mono">250 2.0.0 OK — Message queued</p>
            <p className="text-zinc-600 text-xs font-mono">I'll get back to you within 24h.</p>
          </motion.div>
        )}

        {isError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center space-y-1.5"
          >
            <div className="flex items-center gap-2 justify-center text-red-400 font-mono font-semibold text-sm">
              <ServerCrash size={15} />
              Transmission failed
            </div>
            <p className="text-zinc-500 text-xs font-mono">550 5.1.1 — Delivery error</p>
            <p className="text-zinc-500 text-xs">
              Email me directly:{" "}
              <a href={`mailto:${personalInfo.email}`} className="text-violet-400 underline underline-offset-2">
                {personalInfo.email}
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SmtpPacketCard ───────────────────────────────────────────────────────────

interface SmtpPacketCardProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  isReady: boolean;
}

// A single SMTP header row — flashes green when its value changes
function PacketRow({
  label,
  value,
  flashKey,
  dim,
  labelColor = "#6272a4",
  valueColor = "#e2e8f0",
}: {
  label: string;
  value: string;
  flashKey: string | number;
  dim?: boolean;
  labelColor?: string;
  valueColor?: string;
}) {
  return (
    <motion.div
      key={flashKey}         // new key → re-mount → fresh initial animation
      initial={{ backgroundColor: "rgba(80,250,123,0.18)" }}
      animate={{ backgroundColor: "rgba(80,250,123,0)" }}
      transition={{ duration: 0.9 }}
      style={{
        display: "flex",
        gap: "0.5rem",
        padding: "2px 10px",
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
        fontSize: "0.70rem",
        lineHeight: 1.9,
        opacity: dim ? 0.38 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <span style={{ color: labelColor, minWidth: "5.8rem", flexShrink: 0 }}>{label}</span>
      <span style={{ color: valueColor, wordBreak: "break-all" }}>{value || <span style={{ color: "#3d3d5c", fontStyle: "italic" }}>—</span>}</span>
    </motion.div>
  );
}

function SmtpPacketCard({ name, email, subject, message, isReady }: SmtpPacketCardProps) {
  // Stable-across-render values for generated SMTP fields
  const msgIdRef   = useRef(getMsgId());
  const dateRef    = useRef(getSmtpDate());

  // Flash keys — incrementing key forces PacketRow to re-mount → retrigger animation
  const [flashKeys, setFlashKeys] = useState({ name: 0, email: 0, subject: 0, message: 0 });
  const prevVals   = useRef({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    const updates: Partial<typeof flashKeys> = {};
    if (name    !== prevVals.current.name)    { updates.name    = flashKeys.name    + 1; }
    if (email   !== prevVals.current.email)   { updates.email   = flashKeys.email   + 1; }
    if (subject !== prevVals.current.subject) { updates.subject = flashKeys.subject + 1; }
    if (message !== prevVals.current.message) { updates.message = flashKeys.message + 1; }

    if (Object.keys(updates).length > 0) {
      setFlashKeys(k => ({ ...k, ...updates }));
      prevVals.current = { name, email, subject, message };
    }
  }, [name, email, subject, message]);

  const totalBytes = byteSize(
    `FROM: visitor@web.client\r\nTO: ${personalInfo.email}\r\nSUBJECT: ${subject}\r\n\r\n${message}`
  );
  const bodyPreview = message
    ? message.length > 90 ? message.slice(0, 90) + "…" : message
    : "";

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
        background: "#05080f",
        border: "1px solid #1a2035",
        borderRadius: 12,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: isReady
          ? "0 0 0 1px rgba(99,102,241,0.3), 0 4px 32px rgba(99,102,241,0.1)"
          : "0 4px 24px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.5s ease",
      }}
    >
      {/* Title bar */}
      <div style={{
        background: "#0a0f1e",
        borderBottom: "1px solid #141830",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444", opacity: 0.8 }}/>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#eab308", opacity: 0.8 }}/>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e", opacity: 0.8 }}/>
        </div>
        {/* Title */}
        <span style={{ color: "#4a5568", fontSize: "0.70rem", marginLeft: 4 }}>SMTP/2.0</span>
        <span style={{ color: "#2d3561", fontSize: "0.68rem", marginLeft: 2 }}>DATA PACKET</span>
        {/* Status pill */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <motion.div
            animate={{ opacity: isReady ? [0.6, 1, 0.6] : [0.3, 0.5, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: isReady ? "#22c55e" : "#4b5563",
            }}
          />
          <span style={{ color: isReady ? "#22c55e" : "#4b5563", fontSize: "0.65rem" }}>
            {isReady ? "READY" : "BUILDING"}
          </span>
        </div>
      </div>

      {/* Hex gutter decoration */}
      <div style={{ position: "relative", flex: 1 }}>
        {/* Left hex gutter */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "1.8rem",
          background: "#070b14",
          borderRight: "1px solid #0f1628",
          display: "flex", flexDirection: "column",
          paddingTop: 6, paddingBottom: 6,
          overflowY: "hidden",
          userSelect: "none",
        }}>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} style={{ color: "#1a2035", fontSize: "0.56rem", lineHeight: 1.9, textAlign: "center", fontFamily: "monospace" }}>
              {(i * 16).toString(16).padStart(2, "0")}
            </div>
          ))}
        </div>

        {/* Packet content */}
        <div style={{ paddingLeft: "1.8rem", paddingTop: 6, paddingBottom: 6 }}>

          {/* SMTP preamble — static */}
          <div style={{ padding: "2px 10px", fontSize: "0.70rem", lineHeight: 1.9, color: "#2d3b55" }}>
            EHLO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; portfolio.shanjid.dev
          </div>
          <div style={{ height: 1, background: "#0f1628", margin: "2px 10px" }}/>

          {/* Headers — live */}
          <PacketRow
            label="FROM:"
            value="visitor@web.client"
            flashKey={0}
            labelColor="#7c3aed"
            valueColor="#a78bfa"
          />
          <PacketRow
            label="TO:"
            value={personalInfo.email}
            flashKey={0}
            labelColor="#7c3aed"
            valueColor="#a78bfa"
          />
          <PacketRow
            label="DATE:"
            value={dateRef.current}
            flashKey={0}
            labelColor="#334155"
            valueColor="#1e2d42"
          />
          <PacketRow
            label="MESSAGE-ID:"
            value={msgIdRef.current}
            flashKey={0}
            labelColor="#334155"
            valueColor="#1e2d42"
          />
          <PacketRow
            label="X-SENDER:"
            value={name}
            flashKey={flashKeys.name}
            dim={!name}
            labelColor="#0e7490"
            valueColor="#67e8f9"
          />
          <PacketRow
            label="REPLY-TO:"
            value={email}
            flashKey={flashKeys.email}
            dim={!email}
            labelColor="#0e7490"
            valueColor="#67e8f9"
          />
          <PacketRow
            label="SUBJECT:"
            value={subject}
            flashKey={flashKeys.subject}
            dim={!subject}
            labelColor="#b45309"
            valueColor="#fcd34d"
          />
          <PacketRow
            label="MIME-VER:"
            value="1.0"
            flashKey={0}
            labelColor="#334155"
            valueColor="#1e2d42"
          />
          <PacketRow
            label="CONTENT:"
            value="text/plain; charset=utf-8"
            flashKey={0}
            labelColor="#334155"
            valueColor="#1e2d42"
          />

          {/* Body section */}
          <div style={{ height: 1, background: "#0f1628", margin: "4px 10px" }}/>
          <div style={{ padding: "2px 10px", fontSize: "0.64rem", color: "#334155", lineHeight: 1.6, fontFamily: "monospace" }}>
            ── BODY ──
          </div>
          <motion.div
            key={flashKeys.message}
            initial={{ backgroundColor: "rgba(80,250,123,0.14)" }}
            animate={{ backgroundColor: "rgba(80,250,123,0)" }}
            transition={{ duration: 1.1 }}
            style={{
              padding: "4px 10px",
              fontSize: "0.68rem",
              color: message ? "#94a3b8" : "#1e2d42",
              fontFamily: "monospace",
              lineHeight: 1.7,
              fontStyle: message ? "normal" : "italic",
              minHeight: 54,
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {bodyPreview || "— awaiting message body —"}
          </motion.div>

          {/* Footer */}
          <div style={{ height: 1, background: "#0f1628", margin: "4px 10px" }}/>
          <div style={{
            display: "flex", justifyContent: "space-between",
            padding: "4px 10px 6px",
            fontSize: "0.63rem",
            color: "#334155",
            fontFamily: "monospace",
          }}>
            <span>SIZE: <span style={{ color: totalBytes > 0 ? "#6272a4" : "#1e2d42" }}>{totalBytes} bytes</span></span>
            <span style={{ color: isReady ? "#22c55e" : "#374151" }}>
              {isReady ? "● READY TO SEND" : "○ INCOMPLETE"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Contact component ───────────────────────────────────────────────────

export default function Contact() {
  const [formStatus,   setFormStatus]   = useState<FormStatus>("idle");
  const [postboxPhase, setPostboxPhase] = useState<PostboxPhase>("entering");

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // Live watch — feeds into SmtpPacketCard
  const watchedName    = watch("name",    "");
  const watchedEmail   = watch("email",   "");
  const watchedSubject = watch("subject", "");
  const watchedMessage = watch("message", "");

  // Is the form valid enough to show READY state on the card?
  const isFormReady = (
    watchedName?.length    >= 2  &&
    watchedEmail?.includes("@") &&
    watchedSubject?.length >= 5  &&
    watchedMessage?.length >= 20
  );

  const onSubmit = async (data: ContactFormData) => {
    setFormStatus("loading");

    // 1. Begin postbox "entering" phase (envelope flies in)
    setPostboxPhase("entering");

    // 2. After envelope enters slot (~900ms), switch to "waiting"
    const waitTimer = setTimeout(() => setPostboxPhase("waiting"), 900);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      clearTimeout(waitTimer);

      if (!response.ok) throw new Error("Failed");

      setFormStatus("success");

      // Ensure we've shown "waiting" for at least a beat before success
      setTimeout(() => {
        setPostboxPhase("success");
      }, postboxPhase === "entering" ? 900 : 200);

      reset();
      setTimeout(() => {
        setFormStatus("idle");
      }, 8000);

    } catch {
      clearTimeout(waitTimer);
      setFormStatus("error");

      setTimeout(() => {
        setPostboxPhase("error");
      }, postboxPhase === "entering" ? 900 : 200);

      setTimeout(() => {
        setFormStatus("idle");
      }, 8000);
    }
  };

  // When form resets to idle, reset postbox too
  useEffect(() => {
    if (formStatus === "idle") {
      setPostboxPhase("entering");
    }
  }, [formStatus]);

  const isSubmitting = formStatus === "loading";
  const isSuccess    = formStatus === "success";
  const isError      = formStatus === "error";
  const isSent       = isSubmitting || isSuccess || isError;

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Contact"
          subtitle="Have a project in mind or just want to connect? I'd love to hear from you."
        />

        {/* 3-column grid: info | form | packet/postbox */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr_200px] xl:grid-cols-[390px_1fr_200px] gap-8 items-start">

          {/* ── Column 3: SMTP Packet Card / Postbox ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
            style={{ minHeight: 480 }}
          >
            <AnimatePresence mode="wait">
              {!isSent ? (
                /* ── SMTP Packet Card — visible before submit ── */
                <motion.div
                  key="packet-card"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.4,
                    x: 120,
                    y: -120,
                    rotate: 18,
                    transition: { duration: 0.55, ease: [0.4, 0, 1, 1] },
                  }}
                  style={{ height: "100%", minHeight: 480 }}
                >
                  <SmtpPacketCard
                    name={watchedName}
                    email={watchedEmail}
                    subject={watchedSubject}
                    message={watchedMessage}
                    isReady={isFormReady}
                  />
                </motion.div>
              ) : (
                /* ── Postbox Scene — visible during/after submit ── */
                <motion.div
                  key="postbox"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="rounded-2xl border border-zinc-800/60 bg-zinc-950/80 dark:bg-zinc-950"
                  style={{ minHeight: 480, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <PostboxScene phase={postboxPhase} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Column 2: Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900/50 border border-sky-100 dark:border-zinc-800/50 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <InputField label="Name" error={errors.name?.message}>
                  <input {...register("name")} placeholder="Your name" className={inputClass} autoComplete="off"/>
                </InputField>
                <InputField label="Email" error={errors.email?.message}>
                  <input {...register("email")} type="email" placeholder="your@email.com" className={inputClass} autoComplete="off"/>
                </InputField>
              </div>

              <InputField label="Subject" error={errors.subject?.message}>
                <input {...register("subject")} placeholder="What's this about?" className={inputClass}/>
              </InputField>

              <InputField label="Message" error={errors.message?.message}>
                <textarea
                  {...register("message")}
                  rows={6}
                  placeholder="Tell me about your project, or just say hi..."
                  className={cn(inputClass, "resize-none")}
                />
              </InputField>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSent}
                className={cn(
                  "w-full py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200",
                  "flex items-center justify-center gap-2 font-mono",
                  isSuccess
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                    : isError
                    ? "bg-red-600/10 text-red-400 border border-red-500/30 cursor-default"
                    : isSubmitting
                    ? "bg-violet-600/50 text-white cursor-wait"
                    : "bg-violet-600 hover:bg-violet-500 text-white hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
                )}
              >
                {isSubmitting && <><Loader2 size={15} className="animate-spin" /> Transmitting packet...</>}
                {isSuccess    && <><CheckCircle size={15} /> Delivered — check inbox!</>}
                {isError      && <><AlertCircle size={15} /> Delivery failed — try again</>}
                {!isSent      && <><Send size={15} /> Send Message</>}
              </button>
            </form>
          </motion.div>

          {/* ── Column 1: Contact info ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-sky-950 dark:text-zinc-100 font-semibold text-base mb-2">Let's talk</h3>
              <p className="text-sky-600 dark:text-zinc-400 text-sm leading-relaxed">
                Job opportunities, collaborations, or just a technical deep-dive — reach out any time.
              </p>
            </div>

            {/* Info cards */}
            <div className="space-y-3">
              {contactInfoItems.map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-zinc-900/50 border border-sky-100 dark:border-zinc-800/60">
                  <span className="text-violet-400 shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-sky-400 dark:text-zinc-500 text-xs">{label}</p>
                    {href
                      ? <a href={href} className="text-sky-800 dark:text-zinc-300 text-xs hover:text-violet-400 transition-colors truncate block">{value}</a>
                      : <p className="text-sky-800 dark:text-zinc-300 text-xs truncate">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div>
              <p className="text-zinc-500 text-xs font-mono mb-3 uppercase tracking-wider">Find me on</p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="p-2.5 rounded-lg bg-white dark:bg-zinc-900/50 border border-sky-100 dark:border-zinc-800/60 text-sky-600 dark:text-zinc-400 hover:text-violet-400 hover:border-violet-500/30 transition-all duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}