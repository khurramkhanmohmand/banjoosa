"use client";

import { motion } from "motion/react";

export interface MarqueeProps {
  text: string;
  durationSeconds?: number;
  className?: string;
}

/**
 * Infinite scrolling ticker band (reactbits-style marquee, adapted to our
 * tokens/motion setup) — used for the promo ticker on Home. Renders the
 * text twice back-to-back and animates a seamless -50% translate loop.
 */
export function Marquee({ text, durationSeconds = 18, className = "" }: MarqueeProps) {
  return (
    <div className={["overflow-hidden whitespace-nowrap", className].join(" ")}>
      <motion.div
        className="inline-flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: durationSeconds }}
      >
        {[0, 1].map((i) => (
          <span key={i} className="font-display text-2xl text-ink tracking-wide pr-8">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
