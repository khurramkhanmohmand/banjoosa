import { CartItemType, type CartLine, type Deal, type MenuItem } from "@banjoosa/types";

export interface PricedCartLine {
  lineKey: string;
  name: string;
  /** "Bread · Cheese, Jalapeno" or "As standard" when there's nothing to show. */
  sub: string;
  unitPrice: number;
  qty: number;
  total: number;
}

/**
 * Mirrors the design handoff's cart pricing: look up each line against the
 * live catalog rather than storing a price on the cart line itself, so the
 * cart always reflects current menu prices until checkout locks them in
 * server-side.
 */
export function priceCartLines(lines: CartLine[], menuItems: MenuItem[], deals: Deal[]): PricedCartLine[] {
  return lines
    .map((line): PricedCartLine | null => {
      if (line.itemType === CartItemType.MENU_ITEM) {
        const item = menuItems.find((m) => m.id === line.itemId);
        if (!item) return null;

        const variant = item.hasVariants ? item.variants.find((v) => v.id === line.variantId) : undefined;
        const base = item.hasVariants ? variant?.price ?? 0 : item.basePrice ?? 0;
        const addOns = item.addOns.filter((a) => line.addOnIds.includes(a.id));
        const addOnSum = addOns.reduce((sum, a) => sum + a.price, 0);
        const unitPrice = base + addOnSum;

        const subBits = [variant?.label, ...addOns.map((a) => a.name)].filter(Boolean) as string[];

        return {
          lineKey: line.lineKey,
          name: item.name,
          sub: subBits.length ? subBits.join(" · ") : "As standard",
          unitPrice,
          qty: line.qty,
          total: unitPrice * line.qty,
        };
      }

      const deal = deals.find((d) => d.id === line.itemId);
      if (!deal) return null;
      return {
        lineKey: line.lineKey,
        name: deal.name,
        sub: "Deal bundle",
        unitPrice: deal.price,
        qty: line.qty,
        total: deal.price * line.qty,
      };
    })
    .filter((l): l is PricedCartLine => l !== null);
}

export function cartSubtotal(pricedLines: PricedCartLine[]): number {
  return pricedLines.reduce((sum, l) => sum + l.total, 0);
}
