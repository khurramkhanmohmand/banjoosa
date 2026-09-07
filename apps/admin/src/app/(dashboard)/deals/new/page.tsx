"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@banjoosa/ui";
import { useAdminDeals, type DealFormInput } from "@/hooks/useAdminDeals";
import { DealForm } from "@/components/deals/DealForm";

const BLANK: DealFormInput = {
  name: "",
  description: "",
  longDescription: "",
  price: 0,
  wasPrice: 0,
  imageUrl: null,
  isActive: true,
  sortOrder: 0,
};

export default function NewDealPage() {
  const { createDeal } = useAdminDeals();
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-brand-red">Add deal</h1>
      <DealForm
        initial={BLANK}
        submitLabel="Create deal"
        onSubmit={async (input) => {
          await createDeal(input);
          showToast("Deal created", "success");
          router.push("/deals");
        }}
      />
    </div>
  );
}
