"use client";

import { motion } from "motion/react";

export interface QtyStepperProps {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "md";
}

const SIZE_CLASSES: Record<NonNullable<QtyStepperProps["size"]>, { btn: string; label: string }> = {
  sm: { btn: "w-[30px] h-[30px]", label: "text-lg min-w-[18px]" },
  md: { btn: "w-9 h-9", label: "text-xl min-w-[20px]" },
};

/**
 * Shared +/- quantity control. Decrementing to 0 is the caller's cue to
 * remove the line (per handoff behavior) — this component just reports
 * the click, it doesn't know about cart lines.
 */
export function QtyStepper({ qty, onIncrement, onDecrement, size = "md" }: QtyStepperProps) {
  const s = SIZE_CLASSES[size];
  return (
    <div className="flex items-center gap-2">
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className={["rounded-full border-[3px] border-ink flex items-center justify-center font-extrabold cursor-pointer bg-white", s.btn].join(" ")}
      >
        −
      </motion.button>
      <span className={["font-display text-center", s.label].join(" ")}>{qty}</span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={onIncrement}
        aria-label="Increase quantity"
        className={["rounded-full border-[3px] border-ink flex items-center justify-center font-extrabold cursor-pointer bg-brand-yellow", s.btn].join(" ")}
      >
        +
      </motion.button>
    </div>
  );
}
