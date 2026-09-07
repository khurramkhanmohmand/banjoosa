/** Renders a paisa-free rupee amount as "Rs 1,290", matching the design handoff. */
export function formatPrice(amount: number): string {
  return `Rs ${amount.toLocaleString("en-US")}`;
}

/** "from Rs X" when an item has multiple variant prices, else the flat price. */
export function priceLabel(prices: number[]): string {
  const lowest = Math.min(...prices);
  return prices.length > 1 ? `from ${formatPrice(lowest)}` : formatPrice(lowest);
}
