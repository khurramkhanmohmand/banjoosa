"use client";

import Link from "next/link";
import { Button, Spinner, useToast } from "@banjoosa/ui";
import { useAdminMenuItems } from "@/hooks/useAdminMenuItems";
import { MenuItemTable } from "@/components/menu/MenuItemTable";
import { ApiError } from "@/lib/apiClient";

export default function MenuListPage() {
  const { items, loading, error, deleteItem } = useAdminMenuItems();
  const { showToast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item? This can't be undone.")) return;
    try {
      await deleteItem(id);
      showToast("Menu item deleted", "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete this item", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-brand-red">Menu items</h1>
        <Link href="/menu/new">
          <Button variant="danger">Add item</Button>
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <p className="text-brand-red">{error}</p>}
      {!loading && !error && <MenuItemTable items={items} onDelete={handleDelete} />}
    </div>
  );
}
