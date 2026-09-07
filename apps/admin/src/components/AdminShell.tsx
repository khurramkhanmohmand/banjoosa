"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Dashboard", href: "/" },
  { label: "Orders", href: "/orders" },
  { label: "Menu", href: "/menu" },
  { label: "Deals", href: "/deals" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const navContent = (onNavigate?: () => void) => (
    <>
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={[
                "font-ui font-bold uppercase tracking-wide text-sm px-3.5 py-2.5 rounded-card",
                active ? "bg-brand-red text-cream" : "text-cream/80 hover:bg-white/10",
              ].join(" ")}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-5 border-t border-white/10">
        <div className="text-xs text-cream/60 mb-2 truncate">{admin?.email}</div>
        <button
          type="button"
          onClick={handleLogout}
          className="font-ui font-bold uppercase tracking-wide text-sm text-brand-yellow cursor-pointer"
        >
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Top bar — mobile only. */}
      <div className="md:hidden flex items-center justify-between bg-ink text-cream px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <Image src="/brand/banjoosa-logo.png" alt="Banjoosa" width={30} height={30} />
          <span className="font-display text-base text-brand-yellow leading-none">BANJOOSA</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileNavOpen}
          className="flex flex-col justify-center gap-1.5 w-8 h-8 shrink-0"
        >
          <span className={["block h-[3px] w-full bg-cream rounded-full transition-transform", mobileNavOpen ? "translate-y-[7px] rotate-45" : ""].join(" ")} />
          <span className={["block h-[3px] w-full bg-cream rounded-full transition-opacity", mobileNavOpen ? "opacity-0" : ""].join(" ")} />
          <span className={["block h-[3px] w-full bg-cream rounded-full transition-transform", mobileNavOpen ? "-translate-y-[7px] -rotate-45" : ""].join(" ")} />
        </button>
      </div>
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden overflow-hidden bg-ink text-cream flex flex-col sticky top-[57px] z-30"
          >
            {navContent(() => setMobileNavOpen(false))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permanent sidebar — desktop/tablet only. */}
      <aside className="hidden md:flex w-[220px] shrink-0 bg-ink text-cream flex-col">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <Image src="/brand/banjoosa-logo.png" alt="Banjoosa" width={36} height={36} />
          <span className="font-display text-lg text-brand-yellow leading-none">BANJOOSA</span>
        </div>
        {navContent()}
      </aside>

      <main className="flex-1 bg-cream min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 py-6 sm:px-8 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
