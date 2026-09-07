"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SocketEvent,
  type Branch,
  type Order,
  type OrderStatus,
  type OrderStatusChangedPayload,
} from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";
import { getSocket } from "@/lib/socketClient";

interface UseAdminOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  refetch: () => void;
}

/**
 * Loads the branch's orders once via REST, then joins the branch's Socket.io
 * room so new orders and status changes made from another admin tab (or by
 * this one) show up live without polling.
 */
export function useAdminOrders(statusFilter?: OrderStatus): UseAdminOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

  const refetch = useCallback(() => setRefetchTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const query = statusFilter ? `?status=${statusFilter}` : "";
    apiFetch<{ orders: Order[] }>(`/api/admin/orders${query}`)
      .then((res) => {
        if (!cancelled) setOrders(res.orders);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [statusFilter, refetchTick]);

  useEffect(() => {
    let cancelled = false;

    async function subscribe() {
      const [branch, tokenRes] = await Promise.all([
        apiFetch<Branch>("/api/branch"),
        apiFetch<{ token: string }>("/api/auth/socket-token"),
      ]);
      if (cancelled) return;

      const socket = getSocket();
      socket.emit(SocketEvent.SUBSCRIBE_BRANCH, { branchId: branch.id, token: tokenRes.token });

      const onCreated = (order: Order) => {
        setOrders((prev) => (prev.some((o) => o.id === order.id) ? prev : [order, ...prev]));
      };
      const onStatusChanged = (payload: OrderStatusChangedPayload) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === payload.orderId ? { ...o, status: payload.status, updatedAt: payload.updatedAt } : o))
        );
      };

      socket.on(SocketEvent.ORDER_CREATED, onCreated);
      socket.on(SocketEvent.ORDER_STATUS_CHANGED, onStatusChanged);

      return () => {
        socket.off(SocketEvent.ORDER_CREATED, onCreated);
        socket.off(SocketEvent.ORDER_STATUS_CHANGED, onStatusChanged);
      };
    }

    let cleanup: (() => void) | undefined;
    subscribe().then((fn) => {
      if (!cancelled) cleanup = fn;
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const updateStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    const updated = await apiFetch<Order>(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }, []);

  return { orders, loading, error, updateStatus, refetch };
}
