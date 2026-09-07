"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@banjoosa/ui";
import { useAdminMenuItems, type MenuItemFormInput } from "@/hooks/useAdminMenuItems";
import { MenuItemForm } from "@/components/menu/MenuItemForm";

const BLANK: MenuItemFormInput = {
  sectionId: "",
  name: "",
  tag: null,
  description: "",
  longDescription: "",
  imageUrl: null,
  variantLabel: null,
  basePrice: 0,
  variants: [],
  addOnIds: [],
  isAvailable: true,
  sortOrder: 0,
};

export default function NewMenuItemPage() {
  const { createItem } = useAdminMenuItems();
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-brand-red">Add menu item</h1>
      <MenuItemForm
        initial={BLANK}
        submitLabel="Create item"
        onSubmit={async (input) => {
          await createItem(input);
          showToast("Menu item created", "success");
          router.push("/menu");
        }}
      />
    </div>
  );
}
