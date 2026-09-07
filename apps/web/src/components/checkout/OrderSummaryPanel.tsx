import { Button, Card, EmptyState, formatPrice } from "@banjoosa/ui";
import type { PricedCartLine } from "@/lib/cartPricing";

interface OrderSummaryPanelProps {
  lines: PricedCartLine[];
  subtotal: number;
  fee: number;
  feeLabel: string;
  tax: number;
  total: number;
  etaLabel: string;
  onPlaceOrder: () => void;
  submitting: boolean;
  error: string | null;
}

export function OrderSummaryPanel({
  lines,
  subtotal,
  fee,
  feeLabel,
  tax,
  total,
  etaLabel,
  onPlaceOrder,
  submitting,
  error,
}: OrderSummaryPanelProps) {
  return (
    <Card shadow="sticker" className="bg-cream p-6">
      <div className="font-display text-[26px] mb-3.5">YOUR ORDER</div>

      {lines.length === 0 ? (
        <EmptyState title="Cart is empty" description="Add something from the menu first." />
      ) : (
        lines.map((line) => (
          <div key={line.lineKey} className="flex justify-between gap-3 py-2 border-b-2 border-ink/10 text-base">
            <span>
              {line.qty} × {line.name}
              {line.sub !== "As standard" && line.sub !== "Deal bundle" ? ` (${line.sub})` : ""}
            </span>
            <span className="font-semibold whitespace-nowrap">{formatPrice(line.total)}</span>
          </div>
        ))
      )}

      <div className="flex flex-col gap-1.5 mt-3.5 text-base">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>{feeLabel}</span>
          <span>{fee === 0 ? "Free" : formatPrice(fee)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (5%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3.5 pt-3.5 border-t-[3px] border-ink">
        <span className="font-ui font-bold uppercase tracking-wide text-xl">Total</span>
        <span className="font-display text-3xl text-brand-red">{formatPrice(total)}</span>
      </div>

      {error && <p className="text-brand-red text-sm mt-3 mb-0">{error}</p>}

      <div className="mt-5">
        <Button variant="danger" fullWidth onClick={onPlaceOrder} disabled={lines.length === 0 || submitting}>
          {submitting ? "Placing order…" : "Place order"}
        </Button>
      </div>
      <div className="text-center text-sm text-meta mt-2.5">
        Delivery in {etaLabel} · free over Rs 2000
      </div>
    </Card>
  );
}
