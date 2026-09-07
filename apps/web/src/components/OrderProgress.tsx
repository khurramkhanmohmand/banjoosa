import { ORDER_STATUS_SEQUENCE, OrderStatus, type OrderStatus as OrderStatusType } from "@banjoosa/types";

const STEP_LABEL: Record<OrderStatusType, string> = {
  [OrderStatus.PLACED]: "Placed",
  [OrderStatus.PREPARING]: "Preparing",
  [OrderStatus.READY]: "Ready",
  [OrderStatus.OUT_FOR_DELIVERY]: "Out for delivery",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.CANCELLED]: "Cancelled",
};

/** Visual progress bar through PLACED -> ... -> COMPLETED. Renders a plain cancelled notice instead if the order was cancelled. */
export function OrderProgress({ status }: { status: OrderStatusType }) {
  if (status === OrderStatus.CANCELLED) {
    return (
      <div className="font-ui font-bold uppercase tracking-wide text-lg text-brand-red border-[3px] border-brand-red rounded-card px-4 py-3">
        This order was cancelled
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(status);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5">
      {ORDER_STATUS_SEQUENCE.map((step, i) => {
        const reached = i <= currentIndex;
        return (
          <div key={step} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
            <div
              className={[
                "w-full h-2.5 rounded-full border-2 border-ink",
                reached ? "bg-brand-red" : "bg-white",
              ].join(" ")}
            />
            <div className="font-ui font-semibold uppercase tracking-wide text-[11px] sm:text-xs text-center truncate w-full">
              {STEP_LABEL[step]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
