"use client";

import { useEffect, useState } from "react";
import { SocketEvent, type Order, type OrderStatusChangedPayload } from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";
import { getSocket } from "@/lib/socketClient";

interface UseOrderResult {
  order: Order | null;
  loading: boolean;
  error: string | null;
}

/** Fetches an order once, then joins its Socket.io room for live status pushes — no polling. */
export function useOrder(orderId: string): UseOrderResult {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Order>(`/api/orders/${orderId}`)
      .then((res) => {
        if (!cancelled) setOrder(res);
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
  }, [orderId]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit(SocketEvent.SUBSCRIBE_ORDER, { orderId });

    const onStatusChanged = (payload: OrderStatusChangedPayload) => {
      if (payload.orderId !== orderId) return;
      setOrder((prev) => (prev ? { ...prev, status: payload.status, updatedAt: payload.updatedAt } : prev));
    };
    socket.on(SocketEvent.ORDER_STATUS_CHANGED, onStatusChanged);

    return () => {
      socket.off(SocketEvent.ORDER_STATUS_CHANGED, onStatusChanged);
    };
  }, [orderId]);

  return { order, loading, error };
}
