"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";

export interface CarouselProps {
  children: ReactNode[];
  /** Tailwind width classes applied to each slide, e.g. "w-[85%] sm:w-[360px]". */
  itemClassName?: string;
  className?: string;
}

/**
 * Horizontal scroll-snap carousel (swipe on touch, arrow buttons on
 * desktop) — built on native CSS scroll-snap rather than a carousel
 * library, so it stays within the project's existing dependencies.
 */
export function Carousel({ children, itemClassName = "w-[85%] sm:w-[360px]", className = "" }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstItem = track.firstElementChild as HTMLElement | null;
    const step = (firstItem?.offsetWidth ?? track.clientWidth * 0.85) + 24;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div className={className}>
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, i) => (
          <div key={i} className={["shrink-0 snap-start", itemClassName].join(" ")}>
            {child}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-3 mt-5">
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={() => scrollByAmount(-1)}
          aria-label="Previous"
          className="w-10 h-10 rounded-full border-[3px] border-ink bg-cream flex items-center justify-center font-bold cursor-pointer"
        >
          ‹
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={() => scrollByAmount(1)}
          aria-label="Next"
          className="w-10 h-10 rounded-full border-[3px] border-ink bg-brand-yellow flex items-center justify-center font-bold cursor-pointer"
        >
          ›
        </motion.button>
      </div>
    </div>
  );
}
