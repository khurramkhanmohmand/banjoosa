import type { HTMLAttributes, ReactNode } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "yellow" | "red" | "ink";
  children: ReactNode;
}

const TONE_CLASSES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  yellow: "bg-brand-yellow text-ink",
  red: "bg-brand-red text-cream",
  ink: "bg-ink text-cream",
};

/** Small pill label used for item tags ("Best seller"), section labels, etc. */
export function Badge({ tone = "yellow", className = "", children, ...rest }: BadgeProps) {
  return (
    <span
      className={[
        "font-ui font-bold uppercase tracking-wide text-[13px] rounded-full border-[3px] border-ink px-3 py-0.5 inline-block",
        TONE_CLASSES[tone],
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </span>
  );
}
