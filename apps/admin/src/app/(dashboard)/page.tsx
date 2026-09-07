"use client";

import { OrderStatus } from "@banjoosa/types";
import { Card, EmptyState, Spinner, formatPrice } from "@banjoosa/ui";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { useReports } from "@/hooks/useReports";
import { OrderCard } from "@/components/orders/OrderCard";

const ACTIVE_STATUSES: OrderStatus[] = [
  OrderStatus.PLACED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.OUT_FOR_DELIVERY,
];

export default function DashboardPage() {
  const { orders, loading, error, updateStatus } = useAdminOrders();
  const { summary } = useReports("today");

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-brand-red mb-1">Live orders</h1>
        <p className="text-meta text-sm m-0">New orders and status changes appear here instantly.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card shadow="sticker-soft" className="p-5">
          <div className="text-sm text-meta uppercase font-ui font-bold tracking-wide">Orders today</div>
          <div className="font-display text-3xl mt-1">{summary?.orderCount ?? "—"}</div>
        </Card>
        <Card shadow="sticker-soft" className="p-5">
          <div className="text-sm text-meta uppercase font-ui font-bold tracking-wide">Revenue today</div>
          <div className="font-display text-3xl mt-1">{summary ? formatPrice(summary.totalRevenue) : "—"}</div>
        </Card>
        <Card shadow="sticker-soft" className="p-5">
          <div className="text-sm text-meta uppercase font-ui font-bold tracking-wide">In progress</div>
          <div className="font-display text-3xl mt-1">{activeOrders.length}</div>
        </Card>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <p className="text-brand-red">{error}</p>}

      {!loading && !error && (
        activeOrders.length === 0 ? (
          <EmptyState title="No active orders" description="New orders will show up here the moment they're placed." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                updating={false}
                onStatusChange={(status) => updateStatus(order.id, status)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
