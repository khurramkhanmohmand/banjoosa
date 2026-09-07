import type { ReactNode } from "react";
import { CartItemType, type Deal, type MenuItem } from "@banjoosa/types";
import { priceLabel, formatPrice } from "@banjoosa/ui";

/** Normalizes a MenuItem or a Deal into the same card shape so the Menu page's "Deals" filter can reuse one grid renderer (matches the design handoff's behavior). */
export interface MenuCardEntry {
  id: string;
  imageUrl: string | null;
  name: string;
  description: string;
  tag: string | null;
  priceNode: ReactNode;
  ctaLabel: string;
  onOpen: () => void;
  onCtaClick: () => void;
}

interface MenuItemActions {
  openItem: (id: string) => void;
  handleCtaClick: (item: MenuItem) => void;
}

interface DealActions {
  addDeal: (dealId: string) => void;
}

export function shapeMenuItem(item: MenuItem, actions: MenuItemActions): MenuCardEntry {
  const prices = item.hasVariants ? item.variants.map((v) => v.price) : [item.basePrice ?? 0];
  return {
    id: item.id,
    imageUrl: item.imageUrl,
    name: item.name,
    description: item.description,
    tag: item.tag,
    priceNode: <span className="font-display text-2xl text-brand-red">{priceLabel(prices)}</span>,
    ctaLabel: item.hasVariants || item.addOns.length > 0 ? "Choose" : "Add",
    onOpen: () => actions.openItem(item.id),
    onCtaClick: () => actions.handleCtaClick(item),
  };
}

export function shapeDeal(deal: Deal, actions: DealActions): MenuCardEntry {
  return {
    id: deal.id,
    imageUrl: deal.imageUrl,
    name: deal.name,
    description: deal.description,
    tag: null,
    priceNode: <span className="font-display text-2xl text-brand-red">{formatPrice(deal.price)}</span>,
    ctaLabel: "Add",
    onOpen: () => actions.addDeal(deal.id),
    onCtaClick: () => actions.addDeal(deal.id),
  };
}
