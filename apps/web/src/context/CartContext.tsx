"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CartItemType, type CartLine } from "@banjoosa/types";

const STORAGE_KEY = "banjoosa.cart.v1";

/** Cart line identity = item + variant + sorted add-ons, so the same burger with different add-ons is a separate line (per handoff). */
function buildLineKey(itemType: CartItemType, itemId: string, variantId: string | null, addOnIds: string[]): string {
  return [itemType, itemId, variantId ?? "none", [...addOnIds].sort().join("+")].join("|");
}

interface CartContextValue {
  lines: CartLine[];
  cartOpen: boolean;
  itemCount: number;
  addLine: (itemType: CartItemType, itemId: string, variantId: string | null, addOnIds: string[], qty: number) => void;
  incrementLine: (lineKey: string) => void;
  decrementLine: (lineKey: string) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore a previous session's cart so a refresh mid-order doesn't lose it.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // Corrupt or inaccessible storage just means we start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addLine = useCallback(
    (itemType: CartItemType, itemId: string, variantId: string | null, addOnIds: string[], qty: number) => {
      const lineKey = buildLineKey(itemType, itemId, variantId, addOnIds);
      setLines((prev) => {
        const existing = prev.find((l) => l.lineKey === lineKey);
        if (existing) {
          return prev.map((l) => (l.lineKey === lineKey ? { ...l, qty: l.qty + qty } : l));
        }
        return [...prev, { lineKey, itemType, itemId, variantId, addOnIds, qty }];
      });
      setCartOpen(true);
    },
    []
  );

  const incrementLine = useCallback((lineKey: string) => {
    setLines((prev) => prev.map((l) => (l.lineKey === lineKey ? { ...l, qty: l.qty + 1 } : l)));
  }, []);

  const decrementLine = useCallback((lineKey: string) => {
    setLines((prev) =>
      prev.flatMap((l) => {
        if (l.lineKey !== lineKey) return [l];
        return l.qty - 1 <= 0 ? [] : [{ ...l, qty: l.qty - 1 }];
      })
    );
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const toggleCart = useCallback(() => setCartOpen((v) => !v), []);
  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  const value: CartContextValue = {
    lines,
    cartOpen,
    itemCount,
    addLine,
    incrementLine,
    decrementLine,
    openCart,
    closeCart,
    toggleCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
