"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner, useToast } from "@banjoosa/ui";
import type { MenuItem } from "@banjoosa/types";
import { fetchAdminMenuItem, useAdminMenuItems, type MenuItemFormInput } from "@/hooks/useAdminMenuItems";
import { MenuItemForm } from "@/components/menu/MenuItemForm";

function toFormInput(item: MenuItem): MenuItemFormInput {
  return {
    sectionId: item.sectionId,
    name: item.name,
    tag: item.tag,
    description: item.description,
    longDescription: item.longDescription,
    imageUrl: item.imageUrl,
    variantLabel: item.variantLabel,
    basePrice: item.basePrice,
    variants: item.variants.map((v) => ({ label: v.label, price: v.price })),
    addOnIds: item.addOns.map((a) => a.id),
    isAvailable: item.isAvailable,
    sortOrder: item.sortOrder,
  };
}

export default function EditMenuItemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const { updateItem } = useAdminMenuItems();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminMenuItem(params.id).then(setItem).finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!item) return <p className="text-brand-red">Menu item not found.</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-brand-red">Edit {item.name}</h1>
      <MenuItemForm
        initial={toFormInput(item)}
        submitLabel="Save changes"
        onSubmit={async (input) => {
          await updateItem(item.id, input);
          showToast("Menu item updated", "success");
          router.push("/menu");
        }}
      />
    </div>
  );
}
