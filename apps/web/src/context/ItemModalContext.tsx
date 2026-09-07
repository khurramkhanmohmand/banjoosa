"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CartItemType, type MenuItem } from "@banjoosa/types";
import { useCatalog } from "./CatalogContext";
import { useCart } from "./CartContext";

interface ItemModalContextValue {
  selectedItem: MenuItem | null;
  selectedVariantId: string | null;
  selectedAddOnIds: string[];
  qty: number;
  openItem: (itemId: string) => void;
  close: () => void;
  selectVariant: (variantId: string) => void;
  toggleAddOn: (addOnId: string) => void;
  incrementQty: () => void;
  decrementQty: () => void;
  confirmAdd: () => void;
  /** Photo/name always opens the modal; the CTA button only opens it when there's something to choose (per handoff). */
  handleCtaClick: (item: MenuItem) => void;
}

const ItemModalContext = createContext<ItemModalContextValue | null>(null);

export function ItemModalProvider({ children }: { children: ReactNode }) {
  const { items } = useCatalog();
  const { addLine, openCart } = useCart();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  const selectedItem = useMemo(() => items.find((i) => i.id === selectedItemId) ?? null, [items, selectedItemId]);

  const openItem = useCallback(
    (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      setSelectedItemId(itemId);
      setSelectedVariantId(item?.hasVariants ? item.variants[0]?.id ?? null : null);
      setSelectedAddOnIds([]);
      setQty(1);
    },
    [items]
  );

  const close = useCallback(() => setSelectedItemId(null), []);

  const selectVariant = useCallback((variantId: string) => setSelectedVariantId(variantId), []);

  const toggleAddOn = useCallback((addOnId: string) => {
    setSelectedAddOnIds((prev) => (prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]));
  }, []);

  const incrementQty = useCallback(() => setQty((q) => q + 1), []);
  const decrementQty = useCallback(() => setQty((q) => Math.max(1, q - 1)), []);

  const confirmAdd = useCallback(() => {
    if (!selectedItem) return;
    addLine(CartItemType.MENU_ITEM, selectedItem.id, selectedVariantId, selectedAddOnIds, qty);
    setSelectedItemId(null);
  }, [selectedItem, selectedVariantId, selectedAddOnIds, qty, addLine]);

  const handleCtaClick = useCallback(
    (item: MenuItem) => {
      if (item.hasVariants || item.addOns.length > 0) {
        openItem(item.id);
      } else {
        addLine(CartItemType.MENU_ITEM, item.id, null, [], 1);
        openCart();
      }
    },
    [openItem, addLine, openCart]
  );

  const value: ItemModalContextValue = {
    selectedItem,
    selectedVariantId,
    selectedAddOnIds,
    qty,
    openItem,
    close,
    selectVariant,
    toggleAddOn,
    incrementQty,
    decrementQty,
    confirmAdd,
    handleCtaClick,
  };

  return <ItemModalContext.Provider value={value}>{children}</ItemModalContext.Provider>;
}

export function useItemModal(): ItemModalContextValue {
  const ctx = useContext(ItemModalContext);
  if (!ctx) throw new Error("useItemModal must be used within an ItemModalProvider");
  return ctx;
}
