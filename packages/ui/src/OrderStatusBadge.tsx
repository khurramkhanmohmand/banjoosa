import { OrderStatus, type OrderStatus as OrderStatusType } from "@banjoosa/types";

export interface OrderStatusBadgeProps {
  status: OrderStatusType;
  className?: string;
}

const STATUS_LABEL: Record<OrderStatusType, string> = {
  [OrderStatus.PLACED]: "Placed",
  [OrderStatus.PREPARING]: "Preparing",
  [OrderStatus.READY]: "Ready",
  [OrderStatus.OUT_FOR_DELIVERY]: "Out for delivery",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.CANCELLED]: "Cancelled",
};

const STATUS_CLASSES: Record<OrderStatusType, string> = {
  [OrderStatus.PLACED]: "bg-card text-ink",
  [OrderStatus.PREPARING]: "bg-brand-yellow text-ink",
  [OrderStatus.READY]: "bg-brand-yellow text-ink",
  [OrderStatus.OUT_FOR_DELIVERY]: "bg-brand-red text-cream",
  [OrderStatus.COMPLETED]: "bg-ink text-cream",
  [OrderStatus.CANCELLED]: "bg-white text-meta",
};

/** Consistent order-status chip shared by the admin dashboard and the customer tracking page. */
export function OrderStatusBadge({ status, className = "" }: OrderStatusBadgeProps) {
  return (
    <span
      className={[
        "font-ui font-bold uppercase tracking-wide text-xs rounded-full border-[3px] border-ink px-3 py-1 inline-block whitespace-nowrap",
        STATUS_CLASSES[status],
        className,
      ].join(" ")}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
