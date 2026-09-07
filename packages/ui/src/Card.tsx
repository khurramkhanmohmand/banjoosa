"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";

type ConflictingHandlers = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, ConflictingHandlers> {
  shadow?: "sticker" | "sticker-lg" | "sticker-soft" | "sticker-soft-lg" | "none";
  /** Adds a hover lift (translate + deeper shadow) — set on cards that are themselves clickable, e.g. section/menu cards. */
  interactive?: boolean;
  children: ReactNode;
}

const SHADOW_CLASSES: Record<NonNullable<CardProps["shadow"]>, string> = {
  sticker: "shadow-sticker",
  "sticker-lg": "shadow-sticker-lg",
  "sticker-soft": "shadow-sticker-soft",
  "sticker-soft-lg": "shadow-sticker-soft-lg",
  none: "",
};

/** The flat bordered "sticker card" container reused across menu, deal, review and stat cards. */
export function Card({ shadow = "sticker", interactive = false, className = "", children, ...rest }: CardProps) {
  const classes = ["border-4 border-ink rounded-card bg-white overflow-hidden", SHADOW_CLASSES[shadow], className].join(" ");

  if (!interactive) {
    return (
      <div className={classes} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "10px 10px 0 #1a1512" }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className={classes}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
