import Link from "next/link";
import { Button, Card, OrderStatusBadge, formatPrice } from "@banjoosa/ui";
import { DeliveryMode, type Order, type OrderStatus } from "@banjoosa/types";
import { getNextStatusActions } from "@/lib/orderStatusActions";

interface OrderCardProps {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
  updating: boolean;
}

export function OrderCard({ order, onStatusChange, updating }: OrderCardProps) {
  const actions = getNextStatusActions(order);
  const placedAt = new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <Card shadow="sticker-soft" className="p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/orders/${order.id}`} className="font-display text-xl hover:text-brand-red">
            #{order.orderNumber}
          </Link>
          <div className="text-sm text-meta">{placedAt} · {order.customerName}</div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="text-sm text-body">
        {order.deliveryMode === DeliveryMode.DELIVERY ? `Delivery · ${order.address}` : `Pickup · ${order.pickupTime ?? "ASAP"}`}
      </div>

      <div className="text-sm">
        {order.items.map((line) => (
          <div key={line.id}>
            {line.qty} × {line.name}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="font-display text-xl text-brand-red">{formatPrice(order.total)}</span>
        <div className="flex gap-2">
          {actions.map((action) => (
            <Button
              key={action.status}
              variant={action.variant === "danger" ? "danger" : "primary"}
              size="sm"
              disabled={updating}
              onClick={() => onStatusChange(action.status)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
