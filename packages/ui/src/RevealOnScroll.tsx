"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

export interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Subtle fade/slide-up reveal as sections enter the viewport, used across Home's content blocks. */
export function RevealOnScroll({ children, delay = 0, className = "" }: RevealOnScrollProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
