"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidthClassName?: string;
  align?: "center" | "right";
}

/**
 * Generic overlay + panel used for the item detail modal, the cart drawer
 * and any future dialog. Owns its own mount/unmount animation via
 * AnimatePresence so callers just toggle `open`.
 */
export function Modal({ open, onClose, children, maxWidthClassName = "max-w-[800px]", align = "center" }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div
          className={[
            "fixed inset-0 z-[70] flex p-0 sm:p-6",
            align === "center" ? "items-center justify-center" : "items-stretch justify-end",
          ].join(" ")}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/60"
          />
          <motion.div
            initial={align === "center" ? { opacity: 0, scale: 0.96, y: 12 } : { x: "100%" }}
            animate={align === "center" ? { opacity: 1, scale: 1, y: 0 } : { x: 0 }}
            exit={align === "center" ? { opacity: 0, scale: 0.96, y: 12 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className={[
              "relative bg-cream overflow-auto",
              align === "center"
                ? `w-full ${maxWidthClassName} max-h-[90vh] border-4 border-ink rounded-card-lg shadow-sticker-xl`
                : "w-full sm:w-[420px] h-full border-l-4 border-ink flex flex-col",
            ].join(" ")}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
