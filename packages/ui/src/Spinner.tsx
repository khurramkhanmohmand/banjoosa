"use client";

import { motion } from "motion/react";

export interface SpinnerProps {
  size?: number;
  className?: string;
}

/** Loading indicator shown while hooks fetch menu/order/report data. */
export function Spinner({ size = 28, className = "" }: SpinnerProps) {
  return (
    <motion.div
      role="status"
      aria-label="Loading"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
      style={{ width: size, height: size }}
      className={["border-4 border-ink border-t-brand-yellow rounded-full", className].join(" ")}
    />
  );
}
