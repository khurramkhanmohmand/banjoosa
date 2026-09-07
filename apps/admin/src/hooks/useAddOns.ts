"use client";

import { useCallback, useEffect, useState } from "react";
import type { AddOn } from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";

export function useAddOns(): { addOns: AddOn[]; loading: boolean; createAddOn: (name: string, price: number) => Promise<void> } {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    return apiFetch<{ addOns: AddOn[] }>("/api/admin/addons")
      .then((res) => setAddOns(res.addOns))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createAddOn = useCallback(
    async (name: string, price: number) => {
      await apiFetch<AddOn>("/api/admin/addons", { method: "POST", body: JSON.stringify({ name, price }) });
      await load();
    },
    [load]
  );

  return { addOns, loading, createAddOn };
}
