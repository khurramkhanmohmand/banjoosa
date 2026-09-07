"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface PillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  active?: boolean;
  /** "nav" = transparent/red fill, no border (header nav). "filter" = bordered chip (category/payment pickers). */
  tone?: "nav" | "filter";
  children: ReactNode;
}

/**
 * Generic toggle chip used for nav links, category filters, variant/add-on
 * pickers and payment/delivery-mode selectors — every "pill button showing
 * active state" pattern in the handoff funnels through this one component.
 */
export function Pill({ active = false, tone = "filter", className = "", children, ...rest }: PillProps) {
  const navClasses = active ? "bg-brand-red text-cream" : "bg-transparent text-cream";
  const filterClasses = active ? "bg-brand-yellow text-ink border-[3px] border-ink" : "bg-white text-ink border-[3px] border-ink";

  return (
    <button
      type="button"
      className={[
        "font-ui font-bold uppercase tracking-wide rounded-full cursor-pointer whitespace-nowrap transition-colors",
        "px-4 py-2 text-[15px] sm:text-base",
        tone === "nav" ? navClasses : filterClasses,
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
