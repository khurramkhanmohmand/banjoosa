"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Pill } from "@banjoosa/ui";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Deals", href: "/deals" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const { itemCount, toggleCart } = useCart();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-ink text-cream">
      <div className="max-w-page mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0" onClick={() => setMobileNavOpen(false)}>
          <Image src="/brand/banjoosa-logo.png" alt="Banjoosa" width={36} height={36} className="block w-9 h-9 sm:w-[52px] sm:h-[52px]" />
          <span className="font-display text-base sm:text-[22px] text-brand-yellow tracking-wide leading-none truncate">
            BANJOOSA
          </span>
        </Link>

        {/* Horizontal pill nav — desktop/tablet only, hidden below md in favor of the hamburger menu. */}
        <nav className="hidden md:flex flex-1 gap-1.5 flex-wrap justify-center">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Pill tone="nav" active={pathname === link.href}>
                {link.label}
              </Pill>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <motion.button
            type="button"
            onClick={toggleCart}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 sm:gap-2.5 font-ui font-bold text-sm sm:text-lg uppercase tracking-wide bg-brand-yellow text-ink px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full whitespace-nowrap"
          >
            <span>Cart</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={itemCount}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="bg-brand-red text-cream min-w-[22px] h-[22px] sm:min-w-[26px] sm:h-[26px] rounded-full inline-flex items-center justify-center font-display text-xs sm:text-sm px-1.5"
              >
                {itemCount}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Hamburger toggle — mobile only. */}
          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
            className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 shrink-0"
          >
            <span className={["block h-[3px] w-full bg-cream rounded-full transition-transform", mobileNavOpen ? "translate-y-[7px] rotate-45" : ""].join(" ")} />
            <span className={["block h-[3px] w-full bg-cream rounded-full transition-opacity", mobileNavOpen ? "opacity-0" : ""].join(" ")} />
            <span className={["block h-[3px] w-full bg-cream rounded-full transition-transform", mobileNavOpen ? "-translate-y-[7px] -rotate-45" : ""].join(" ")} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-white/10"
          >
            <div className="flex flex-col gap-1 px-4 sm:px-6 py-3">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileNavOpen(false)}>
                  <Pill tone="nav" active={pathname === link.href} className="w-full text-center block">
                    {link.label}
                  </Pill>
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
