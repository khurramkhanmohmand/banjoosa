"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <div className="sticky top-0 z-40 bg-ink text-cream">
      <div className="max-w-page mx-auto px-6 py-3.5 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image src="/brand/banjoosa-logo.png" alt="Banjoosa" width={52} height={52} className="block" />
          <span className="font-display text-[22px] text-brand-yellow tracking-wide leading-none">BANJOOSA</span>
        </Link>

        <nav className="flex-1 flex gap-1.5 flex-wrap justify-center">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Pill tone="nav" active={pathname === link.href}>
                {link.label}
              </Pill>
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={toggleCart}
          className="flex items-center gap-2.5 font-ui font-bold text-lg uppercase tracking-wide bg-brand-yellow text-ink px-5 py-2.5 rounded-full whitespace-nowrap"
        >
          <span>Cart</span>
          <span className="bg-brand-red text-cream min-w-[26px] h-[26px] rounded-full inline-flex items-center justify-center font-display text-sm px-1.5">
            {itemCount}
          </span>
        </button>
      </div>
    </div>
  );
}
