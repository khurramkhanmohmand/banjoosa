"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card, EmptyState, OrderStatusBadge, Spinner, formatPrice } from "@banjoosa/ui";
import { useOrder } from "@/hooks/useOrder";
import { OrderProgress } from "@/components/OrderProgress";

export default function OrderTrackingPage() {
  const params = useParams<{ orderId: string }>();
  const { order, loading, error } = useOrder(params.orderId);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-page mx-auto px-6 py-16">
        <EmptyState
          title="Order not found"
          description={error ?? "We couldn't find that order."}
          action={
            <Link href="/">
              <Button variant="primary">Back to home</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto px-6 py-11">
      <Card shadow="sticker-lg" className="bg-brand-yellow p-8 text-center mb-8">
        <div className="font-display text-4xl sm:text-5xl text-brand-red">ORDER CONFIRMED!</div>
        <p className="text-lg leading-relaxed mt-3 mb-6">
          Order #{order.orderNumber} is in the kitchen. At your door in {order.etaMinutes} minutes.
        </p>
        <Link href="/">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </Card>

      <Card shadow="sticker" className="p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="font-display text-2xl">Order #{order.orderNumber}</div>
          <OrderStatusBadge status={order.status} />
        </div>

        <OrderProgress status={order.status} />

        <div>
          {order.items.map((line) => (
            <div key={line.id} className="flex justify-between gap-3 py-2 border-b-2 border-ink/10 text-base">
              <span>
                {line.qty} × {line.name}
                {line.variantLabel || line.addOnLabels.length
                  ? ` (${[line.variantLabel, ...line.addOnLabels].filter(Boolean).join(", ")})`
                  : ""}
              </span>
              <span className="font-semibold whitespace-nowrap">{formatPrice(line.lineTotal)}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5 text-base">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{order.deliveryFee > 0 ? "Delivery" : "Delivery/Pickup"}</span>
            <span>{order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : "Free"}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3.5 border-t-[3px] border-ink">
          <span className="font-ui font-bold uppercase tracking-wide text-xl">Total</span>
          <span className="font-display text-3xl text-brand-red">{formatPrice(order.total)}</span>
        </div>
      </Card>
    </div>
  );
}
