"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Dashboard", href: "/" },
  { label: "Orders", href: "/orders" },
  { label: "Menu", href: "/menu" },
  { label: "Deals", href: "/deals" },
  { label: "Reports", href: "/reports" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-[220px] shrink-0 bg-ink text-cream flex flex-col">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <Image src="/brand/banjoosa-logo.png" alt="Banjoosa" width={36} height={36} />
          <span className="font-display text-lg text-brand-yellow leading-none">BANJOOSA</span>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
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
      </aside>
      <main className="flex-1 bg-cream min-h-screen">
        <div className="max-w-[1200px] mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
