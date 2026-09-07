"use client";

import { useState } from "react";
import { OrderStatus, type OrderStatus as OrderStatusType } from "@banjoosa/types";
import { EmptyState, Pill, Spinner } from "@banjoosa/ui";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { OrderCard } from "@/components/orders/OrderCard";

const FILTERS: { label: string; value: OrderStatusType | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Placed", value: OrderStatus.PLACED },
  { label: "Preparing", value: OrderStatus.PREPARING },
  { label: "Ready", value: OrderStatus.READY },
  { label: "Out for delivery", value: OrderStatus.OUT_FOR_DELIVERY },
  { label: "Completed", value: OrderStatus.COMPLETED },
  { label: "Cancelled", value: OrderStatus.CANCELLED },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState<OrderStatusType | undefined>(undefined);
  const { orders, loading, error, updateStatus } = useAdminOrders(filter);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-brand-red">All orders</h1>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <Pill key={f.label} active={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </Pill>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <p className="text-brand-red">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <EmptyState title="No orders" description="No orders match this filter yet." />
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} updating={false} onStatusChange={(status) => updateStatus(order.id, status)} />
          ))}
        </div>
      )}
    </div>
  );
}
