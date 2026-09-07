"use client";

import { useCallback, useEffect, useState } from "react";
import type { MenuItem } from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";

export interface MenuItemVariantInput {
  label: string;
  price: number;
}

export interface MenuItemFormInput {
  sectionId: string;
  name: string;
  tag: string | null;
  description: string;
  longDescription: string;
  imageUrl: string | null;
  variantLabel: string | null;
  basePrice: number | null;
  variants: MenuItemVariantInput[];
  addOnIds: string[];
  isAvailable: boolean;
  sortOrder: number;
}

export function useAdminMenuItems(): {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  createItem: (input: MenuItemFormInput) => Promise<MenuItem>;
  updateItem: (id: string, input: MenuItemFormInput) => Promise<MenuItem>;
  deleteItem: (id: string) => Promise<void>;
} {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    return apiFetch<{ items: MenuItem[] }>("/api/admin/menu-items")
      .then((res) => setItems(res.items))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createItem = useCallback(
    async (input: MenuItemFormInput) => {
      const created = await apiFetch<MenuItem>("/api/admin/menu-items", { method: "POST", body: JSON.stringify(input) });
      await load();
      return created;
    },
    [load]
  );

  const updateItem = useCallback(
    async (id: string, input: MenuItemFormInput) => {
      const updated = await apiFetch<MenuItem>(`/api/admin/menu-items/${id}`, { method: "PUT", body: JSON.stringify(input) });
      await load();
      return updated;
    },
    [load]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      await apiFetch(`/api/admin/menu-items/${id}`, { method: "DELETE" });
      await load();
    },
    [load]
  );

  return { items, loading, error, createItem, updateItem, deleteItem };
}

export async function fetchAdminMenuItem(id: string): Promise<MenuItem> {
  return apiFetch<MenuItem>(`/api/admin/menu-items/${id}`);
}
