import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  shadow?: "sticker" | "sticker-lg" | "sticker-soft" | "sticker-soft-lg" | "none";
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
export function Card({ shadow = "sticker", className = "", children, ...rest }: CardProps) {
  return (
    <div
      className={["border-4 border-ink rounded-card bg-white overflow-hidden", SHADOW_CLASSES[shadow], className].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
