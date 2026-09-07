"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Card, OrderStatusBadge, Spinner, formatPrice, useToast } from "@banjoosa/ui";
import { DeliveryMode, type Order } from "@banjoosa/types";
import { apiFetch, ApiError } from "@/lib/apiClient";
import { getNextStatusActions } from "@/lib/orderStatusActions";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Reuses the public tracking endpoint — same Order shape, and this page already sits behind admin auth.
    apiFetch<Order>(`/api/orders/${params.id}`)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return <p className="text-brand-red">Order not found.</p>;
  }

  const handleStatusChange = async (status: Order["status"]) => {
    setUpdating(true);
    try {
      const updated = await apiFetch<Order>(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrder(updated);
      showToast(`Order marked ${status.toLowerCase().replace(/_/g, " ")}`, "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not update the order", "error");
    } finally {
      setUpdating(false);
    }
  };

  const actions = getNextStatusActions(order);

  return (
    <div className="flex flex-col gap-6 max-w-[720px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl text-brand-red">Order #{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <Card shadow="sticker-soft" className="p-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-ui font-bold uppercase tracking-wide text-meta">Customer</div>
            <div>{order.customerName}</div>
            <div>{order.customerPhone}</div>
          </div>
          <div>
            <div className="font-ui font-bold uppercase tracking-wide text-meta">
              {order.deliveryMode === DeliveryMode.DELIVERY ? "Delivery address" : "Pickup"}
            </div>
            <div>{order.deliveryMode === DeliveryMode.DELIVERY ? order.address : order.pickupTime ?? "ASAP"}</div>
            {order.deliveryNote && <div className="text-meta">{order.deliveryNote}</div>}
          </div>
          <div>
            <div className="font-ui font-bold uppercase tracking-wide text-meta">Payment</div>
            <div>{order.paymentMethod.replace(/_/g, " ")}</div>
          </div>
          <div>
            <div className="font-ui font-bold uppercase tracking-wide text-meta">Placed</div>
            <div>{new Date(order.createdAt).toLocaleString()}</div>
          </div>
        </div>

        <div>
          <div className="font-ui font-bold uppercase tracking-wide text-meta text-sm mb-2">Items</div>
          {order.items.map((line) => (
            <div key={line.id} className="flex justify-between py-2 border-b-2 border-ink/10 text-sm">
              <span>
                {line.qty} × {line.name}
                {line.variantLabel || line.addOnLabels.length
                  ? ` (${[line.variantLabel, ...line.addOnLabels].filter(Boolean).join(", ")})`
                  : ""}
              </span>
              <span className="font-semibold">{formatPrice(line.lineTotal)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-3 border-t-[3px] border-ink">
          <span className="font-ui font-bold uppercase tracking-wide">Total</span>
          <span className="font-display text-2xl text-brand-red">{formatPrice(order.total)}</span>
        </div>

        {actions.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-2">
            {actions.map((action) => (
              <Button
                key={action.status}
                variant={action.variant === "danger" ? "danger" : "primary"}
                disabled={updating}
                onClick={() => handleStatusChange(action.status)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
