"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Card } from "./Card";
import { Badge } from "./Badge";

export interface MenuItemCardProps {
  imageUrl: string | null;
  imageAlt: string;
  tag?: string | null;
  name: string;
  description: string;
  priceLabel: ReactNode;
  ctaLabel: string;
  onOpen: () => void;
  onCtaClick: () => void;
  size?: "grid" | "featured";
}

const IMAGE_HEIGHT: Record<NonNullable<MenuItemCardProps["size"]>, string> = {
  grid: "h-[170px]",
  featured: "h-[190px]",
};

/**
 * The photo-card pattern reused for Home "fan favourites", Menu grid items
 * and Deals — a single component with props for the few visual/behavioral
 * differences (image height, tag badge, CTA label) rather than three
 * near-duplicate components.
 */
export function MenuItemCard({
  imageUrl,
  imageAlt,
  tag,
  name,
  description,
  priceLabel,
  ctaLabel,
  onOpen,
  onCtaClick,
  size = "grid",
}: MenuItemCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <motion.div
        onClick={onOpen}
        whileHover={{ filter: "brightness(1.03)" }}
        className={["relative border-b-4 border-ink bg-card cursor-pointer overflow-hidden", IMAGE_HEIGHT[size]].join(" ")}
      >
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={imageAlt}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-meta font-ui text-sm uppercase tracking-wide">
            Photo coming soon
          </div>
        )}
        {tag && (
          <Badge tone="yellow" className="absolute top-2.5 left-2.5">
            {tag}
          </Badge>
        )}
      </motion.div>
      <div className="p-4 sm:p-[18px] flex flex-col gap-2 flex-1">
        <button type="button" onClick={onOpen} className="font-display text-left text-[22px] leading-[1.15] cursor-pointer">
          {name}
        </button>
        <p className="text-[15px] leading-normal text-body m-0 flex-1">{description}</p>
        <div className="flex items-center justify-between gap-3">
          {priceLabel}
          <button
            type="button"
            onClick={onCtaClick}
            className="font-ui font-bold uppercase tracking-wide text-[16px] bg-brand-yellow border-[3px] border-ink rounded-full px-4 py-1.5 cursor-pointer hover:bg-brand-red hover:text-cream transition-colors"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </Card>
  );
}
