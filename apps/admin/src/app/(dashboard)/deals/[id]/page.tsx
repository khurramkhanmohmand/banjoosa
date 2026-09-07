"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner, useToast } from "@banjoosa/ui";
import type { Deal } from "@banjoosa/types";
import { fetchAdminDeal, useAdminDeals, type DealFormInput } from "@/hooks/useAdminDeals";
import { DealForm } from "@/components/deals/DealForm";

function toFormInput(deal: Deal): DealFormInput {
  return {
    name: deal.name,
    description: deal.description,
    longDescription: deal.longDescription,
    price: deal.price,
    wasPrice: deal.wasPrice,
    imageUrl: deal.imageUrl,
    isActive: deal.isActive,
    sortOrder: 0,
  };
}

export default function EditDealPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const { updateDeal } = useAdminDeals();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDeal(params.id).then(setDeal).finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!deal) return <p className="text-brand-red">Deal not found.</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-brand-red">Edit {deal.name}</h1>
      <DealForm
        initial={toFormInput(deal)}
        submitLabel="Save changes"
        onSubmit={async (input) => {
          await updateDeal(deal.id, input);
          showToast("Deal updated", "success");
          router.push("/deals");
        }}
      />
    </div>
  );
}
