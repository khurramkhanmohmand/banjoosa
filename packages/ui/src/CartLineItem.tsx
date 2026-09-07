import { QtyStepper } from "./QtyStepper";

export interface CartLineItemProps {
  name: string;
  sub: string;
  total: string;
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

/** One row in the cart drawer / checkout order summary. */
export function CartLineItem({ name, sub, total, qty, onIncrement, onDecrement }: CartLineItemProps) {
  return (
    <div className="flex gap-3 border-[3px] border-ink rounded-card bg-white p-2.5 items-center">
      <div className="flex-1 min-w-0">
        <div className="font-ui font-bold uppercase tracking-wide text-[19px] leading-tight truncate">{name}</div>
        <div className="text-sm text-meta truncate">{sub}</div>
        <div className="text-[15px] text-brand-red font-semibold">{total}</div>
      </div>
      <QtyStepper qty={qty} onIncrement={onIncrement} onDecrement={onDecrement} size="sm" />
    </div>
  );
}
