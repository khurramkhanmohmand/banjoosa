import { formatPrice } from "./utils/formatPrice";

export interface PriceTagProps {
  amount: number;
  from?: boolean;
  wasAmount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<PriceTagProps["size"]>, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
};

/** Displays a price in the display font/brand red, matching every price shown across the handoff. */
export function PriceTag({ amount, from = false, wasAmount, size = "md", className = "" }: PriceTagProps) {
  return (
    <span className={["inline-flex items-baseline gap-2", className].join(" ")}>
      <span className={["font-display text-brand-red", SIZE_CLASSES[size]].join(" ")}>
        {from ? `from ${formatPrice(amount)}` : formatPrice(amount)}
      </span>
      {wasAmount !== undefined && (
        <span className="font-ui text-brand-yellow line-through text-lg">{formatPrice(wasAmount)}</span>
      )}
    </span>
  );
}
