"use client";

import { useCallback, useEffect, useState } from "react";
import type { Deal } from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";

export interface DealFormInput {
  name: string;
  description: string;
  longDescription: string;
  price: number;
  wasPrice: number;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export function useAdminDeals(): {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  createDeal: (input: DealFormInput) => Promise<Deal>;
  updateDeal: (id: string, input: DealFormInput) => Promise<Deal>;
  deleteDeal: (id: string) => Promise<void>;
} {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    return apiFetch<{ deals: Deal[] }>("/api/admin/deals")
      .then((res) => setDeals(res.deals))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createDeal = useCallback(
    async (input: DealFormInput) => {
      const created = await apiFetch<Deal>("/api/admin/deals", { method: "POST", body: JSON.stringify(input) });
      await load();
      return created;
    },
    [load]
  );

  const updateDeal = useCallback(
    async (id: string, input: DealFormInput) => {
      const updated = await apiFetch<Deal>(`/api/admin/deals/${id}`, { method: "PUT", body: JSON.stringify(input) });
      await load();
      return updated;
    },
    [load]
  );

  const deleteDeal = useCallback(
    async (id: string) => {
      await apiFetch(`/api/admin/deals/${id}`, { method: "DELETE" });
      await load();
    },
    [load]
  );

  return { deals, loading, error, createDeal, updateDeal, deleteDeal };
}

export async function fetchAdminDeal(id: string): Promise<Deal> {
  return apiFetch<Deal>(`/api/admin/deals/${id}`);
}
