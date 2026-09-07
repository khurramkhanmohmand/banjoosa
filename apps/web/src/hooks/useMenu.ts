"use client";

import { useEffect, useState } from "react";
import type { MenuItem, MenuSection } from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";

interface MenuData {
  sections: MenuSection[];
  items: MenuItem[];
}

interface UseMenuResult extends MenuData {
  loading: boolean;
  error: string | null;
}

/** Fetches the full catalog once; Home/Menu pages filter it client-side (shared category-filter state per the handoff). */
export function useMenu(): UseMenuResult {
  const [data, setData] = useState<MenuData>({ sections: [], items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiFetch<MenuData>("/api/menu")
      .then((res) => {
        if (!cancelled) setData(res);
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

  return { ...data, loading, error };
}
