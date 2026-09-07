"use client";

import { useEffect, useState } from "react";
import type { Deal } from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";

interface UseDealsResult {
  deals: Deal[];
  loading: boolean;
  error: string | null;
}

export function useDeals(): UseDealsResult {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ deals: Deal[] }>("/api/deals")
      .then((res) => {
        if (!cancelled) setDeals(res.deals);
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
  }, []);

  return { deals, loading, error };
}
