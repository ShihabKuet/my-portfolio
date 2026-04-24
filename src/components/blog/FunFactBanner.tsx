"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import Image from "next/image";
import { FUN_FACTS } from "@/data";
import type { FunFact } from "@/types";

// ─── Timing config ─────────────────────────────────────────────────────────────
// Tweak these to control appearance frequency and duration

const DISPLAY_MS  = 13000;  // how long the banner stays visible
const MIN_WAIT_MS = 60000;   // minimum gap between banners
const MAX_WAIT_MS = 120000;  // maximum gap between banners
const FIRST_DELAY = 4000;   // delay before very first appearance

// How much the image sticks out above the pill (px)
// Increase to show more of the character's head/body above the banner
const IMAGE_OVERFLOW_TOP = 72;

// Total image container height = pill height + how much overflows above
const PILL_HEIGHT    = 92;
const IMAGE_HEIGHT   = PILL_HEIGHT + IMAGE_OVERFLOW_TOP;

// ─── Component ────────────────────────────────────────────────────────────────

export default function FunFactBanner({ enabled }: { enabled: boolean }) {
  const [visible,     setVisible]     = useState(false);
  const [currentFact, setCurrentFact] = useState<FunFact | null>(null);
  const [shownIds,    setShownIds]    = useState<Set<number>>(new Set());

  // Ref so schedule callbacks always see latest enabled value
  const enabledRef = useRef(enabled);
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  // ── Pick a random unseen fact (cycles once all are shown) ──
  const pickFact = useCallback((): FunFact => {
    let pool = FUN_FACTS.filter(f => !shownIds.has(f.id));
    if (pool.length === 0) {
      setShownIds(new Set());
      pool = FUN_FACTS;
    }
    const fact = pool[Math.floor(Math.random() * pool.length)];
    setShownIds(prev => new Set([...prev, fact.id]));
    return fact;
  }, [shownIds]);

  // ── Show a fact ──
  const show = useCallback(() => {
    if (!enabledRef.current) return;
    setCurrentFact(pickFact());
    setVisible(true);
  }, [pickFact]);

  // ── Auto-hide after DISPLAY_MS ──
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), DISPLAY_MS);
    return () => clearTimeout(t);
  }, [visible]);

  // ── Schedule next appearance after banner hides ──
  useEffect(() => {
    if (visible) return;
    const delay = MIN_WAIT_MS + Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS);
    const t = setTimeout(show, delay);
    return () => clearTimeout(t);
  }, [visible, show]);

  // ── First appearance on mount / when re-enabled ──
  useEffect(() => {
    if (!enabled) { setVisible(false); return; }
    const t = setTimeout(show, FIRST_DELAY);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!currentFact) return null;

  const { text, image, imageAlt, imageSide, gradient, accent } = currentFact;
  const isRight = imageSide === "right";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={currentFact.id}
          initial={{ opacity: 0, y: 72, scale: 0.93 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 56, scale: 0.95, transition: { duration: 0.25 } }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed bottom-18 left-1/2 z-50"
          style={{ translateX: "-50%", width: "min(700px, 92vw)" }}
        >
          {/* ── Outer wrapper ──────────────────────────────────────────────────
               paddingTop creates the headroom above the pill that the image
               overflows into. overflow: visible lets it escape upward.          */}
          <div
            className="relative"
            style={{ overflow: "visible", paddingTop: IMAGE_OVERFLOW_TOP }}
          >

            {/* ── Character image ─────────────────────────────────────────────
                 Lives OUTSIDE the overflow:hidden pill so it can poke above.
                 bottom: 0 anchors the feet to the pill floor.
                 Height spans IMAGE_OVERFLOW_TOP above + PILL_HEIGHT below.      */}
            <div
              className="absolute pointer-events-none select-none"
              style={{
                bottom:                                  0,
                [isRight ? "right" : "left"]:            16,
                width:                                   120,
                height:                                  IMAGE_HEIGHT,
                zIndex:                                  20,
              }}
            >
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-contain object-bottom"
                style={{ filter: `drop-shadow(0 -8px 20px ${accent}55)` }}
              />
            </div>

            {/* ── Spinning border ring ─────────────────────────────────────────
                 overflow:hidden here clips the rotating gradient to the pill
                 shape — this is intentional and separate from the outer wrapper. */}
            <div className="relative rounded-[28px] p-[1.5px] overflow-hidden">

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                className="absolute pointer-events-none"
                style={{
                  inset:      "-70%",
                  width:      "240%",
                  height:     "240%",
                  background: `conic-gradient(from 0deg, transparent 0deg, ${accent} 55deg, transparent 130deg)`,
                }}
              />

              {/* ── Pill body ─────────────────────────────────────────────────
                   overflow:hidden here only clips the pill's own contents
                   (shimmer, grid, progress bar) — the image is safe outside.    */}
              <div
                className="relative rounded-[27px] overflow-hidden"
                style={{
                  minHeight:  PILL_HEIGHT,
                  background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  animate={{ x: ["-100%", "220%"] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    width:      "55%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                  }}
                />

                {/* Dot-grid texture overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.06]"
                  style={{
                    backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize:  "18px 18px",
                  }}
                />

                {/* Text content — padded away from whichever side the image is on */}
                <div
                  className="relative flex items-center h-full px-6 py-5"
                  style={{
                    paddingRight: isRight ? 140 : 24,
                    paddingLeft:  isRight ? 24  : 140,
                  }}
                >
                  <div className="flex-1 min-w-0">

                    {/* Fun Fact label badge */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <motion.span
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        className="inline-flex items-center gap-1 text-[0.6rem] font-bold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full"
                        style={{
                          color:      accent,
                          background: `${accent}22`,
                          border:     `1px solid ${accent}44`,
                        }}
                      >
                        <Sparkles size={8} />
                        Fun Fact
                      </motion.span>
                    </div>

                    {/* Fact text */}
                    <p
                      className="text-white/90 leading-relaxed"
                      style={{
                        fontFamily: "'Georgia','Cambria',serif",
                        fontStyle:  "italic",
                        fontSize:   "0.84rem",
                      }}
                    >
                      {text}
                    </p>

                  </div>
                </div>

                {/* Progress bar — depletes linearly over DISPLAY_MS */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] rounded-full"
                  style={{ background: accent }}
                  initial={{ width: "100%", opacity: 0.7 }}
                  animate={{ width: "0%",   opacity: 0.4 }}
                  transition={{ duration: DISPLAY_MS / 1000, ease: "linear" }}
                />

              </div>
            </div>

            {/* ── Close button ─────────────────────────────────────────────────
                 Outside the pill so it's never clipped; z-index above image.    */}
            <button
              onClick={() => setVisible(false)}
              aria-label="Dismiss fun fact"
              className="absolute top-15.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center
                bg-amber-300/50 hover:bg-white/25 text-blue-950 hover:text-white
                backdrop-blur-sm transition-all duration-150"
              style={{ zIndex: 30 }}
            >
              <X size={11} />
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}