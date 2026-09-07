import { DeliveryMode, OrderStatus, type Order } from "@banjoosa/types";

export interface StatusAction {
  label: string;
  status: OrderStatus;
  variant: "primary" | "danger";
}

/** What buttons an admin can press next, given the order's current status and delivery mode. Kitchen handling is otherwise manual (Phase 1 has no kitchen display screen) — this is just the status the human kitchen/rider workflow reports back. */
export function getNextStatusActions(order: Order): StatusAction[] {
  const isDelivery = order.deliveryMode === DeliveryMode.DELIVERY;

  switch (order.status) {
    case OrderStatus.PLACED:
      return [
        { label: "Start preparing", status: OrderStatus.PREPARING, variant: "primary" },
        { label: "Cancel order", status: OrderStatus.CANCELLED, variant: "danger" },
      ];
    case OrderStatus.PREPARING:
      return [
        { label: "Mark ready", status: OrderStatus.READY, variant: "primary" },
        { label: "Cancel order", status: OrderStatus.CANCELLED, variant: "danger" },
      ];
    case OrderStatus.READY:
      return isDelivery
        ? [{ label: "Out for delivery", status: OrderStatus.OUT_FOR_DELIVERY, variant: "primary" }]
        : [{ label: "Mark completed", status: OrderStatus.COMPLETED, variant: "primary" }];
    case OrderStatus.OUT_FOR_DELIVERY:
      return [{ label: "Mark completed", status: OrderStatus.COMPLETED, variant: "primary" }];
    default:
      return [];
  }
}
