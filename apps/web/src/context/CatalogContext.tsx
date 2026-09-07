"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Branch, Deal, MenuItem, MenuSection } from "@banjoosa/types";
import { useMenu } from "@/hooks/useMenu";
import { useDeals } from "@/hooks/useDeals";
import { useBranch } from "@/hooks/useBranch";

interface CatalogContextValue {
  sections: MenuSection[];
  items: MenuItem[];
  deals: Deal[];
  branch: Branch | null;
  loading: boolean;
  error: string | null;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

/**
 * Fetches the menu/deals/branch exactly once per page load (via useMenu /
 * useDeals / useBranch) and shares the result through context, so Home,
 * Menu, Deals and the cart/checkout pricing logic don't each re-fetch the
 * same catalog independently.
 */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const menu = useMenu();
  const { deals, loading: dealsLoading, error: dealsError } = useDeals();
  const { branch, loading: branchLoading, error: branchError } = useBranch();

  const value: CatalogContextValue = {
    sections: menu.sections,
    items: menu.items,
    deals,
    branch,
    loading: menu.loading || dealsLoading || branchLoading,
    error: menu.error ?? dealsError ?? branchError,
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within a CatalogProvider");
  return ctx;
}
