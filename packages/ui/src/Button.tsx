"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type ConflictingHandlers =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | ConflictingHandlers> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-yellow text-ink",
  secondary: "bg-cream text-ink",
  outline: "bg-transparent text-ink",
  danger: "bg-brand-red text-cream",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-3.5 text-lg",
};

/**
 * Primary CTA button matching the handoff's flat "sticker" style: a hard
 * offset shadow that collapses on press, mimicking a physical button
 * rather than a soft/blurred material-design lift.
 */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? undefined : { x: 2, y: 2, boxShadow: "2px 2px 0 #1a1512" }}
      whileTap={disabled ? undefined : { x: 4, y: 4, boxShadow: "0 0 0 #1a1512" }}
      initial={{ boxShadow: "4px 4px 0 #1a1512" }}
      className={[
        "font-ui font-bold uppercase tracking-wide rounded-full border-[3px] border-ink",
        "inline-flex items-center justify-center gap-2 cursor-pointer select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
