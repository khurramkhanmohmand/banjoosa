"use client";

import Link from "next/link";
import { Button, Spinner, useToast } from "@banjoosa/ui";
import { useAdminDeals } from "@/hooks/useAdminDeals";
import { DealTable } from "@/components/deals/DealTable";
import { ApiError } from "@/lib/apiClient";

export default function DealsListPage() {
  const { deals, loading, error, deleteDeal } = useAdminDeals();
  const { showToast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this deal? This can't be undone.")) return;
    try {
      await deleteDeal(id);
      showToast("Deal deleted", "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete this deal", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-brand-red">Deals</h1>
        <Link href="/deals/new">
          <Button variant="danger">Add deal</Button>
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <p className="text-brand-red">{error}</p>}
      {!loading && !error && <DealTable deals={deals} onDelete={handleDelete} />}
    </div>
  );
}
