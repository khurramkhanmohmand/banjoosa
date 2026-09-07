"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@banjoosa/ui";
import { CartItemType, SECTION_ORDER, type SectionName } from "@banjoosa/types";
import { useCatalog } from "@/context/CatalogContext";
import { useItemModal } from "@/context/ItemModalContext";
import { useCart } from "@/context/CartContext";
import { CategoryFilters, MENU_CATEGORIES, type MenuCategory } from "@/components/menu/CategoryFilters";
import { MenuSectionGroup } from "@/components/menu/MenuSectionGroup";
import { shapeDeal, shapeMenuItem } from "@/lib/menuCardAdapter";

function MenuPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [category, setCategory] = useState<MenuCategory>(
    (MENU_CATEGORIES as readonly string[]).includes(initialCategory ?? "") ? (initialCategory as MenuCategory) : "All"
  );

  const { sections, items, deals, loading, error } = useCatalog();
  const { openItem, handleCtaClick } = useItemModal();
  const { addLine, openCart } = useCart();

  const addDeal = (dealId: string) => {
    addLine(CartItemType.DEAL, dealId, null, [], 1);
    openCart();
  };

  const noteByName = useMemo(() => new Map(sections.map((s) => [s.name, s.note])), [sections]);

  const sectionOrder: string[] = category === "Deals" ? ["Deals"] : category === "All" ? [...SECTION_ORDER] : [category];

  return (
    <div className="max-w-page mx-auto px-6 py-11">
      <h1 className="font-display text-[40px] sm:text-[56px] text-brand-red">THE FULL MENU</h1>
      <p className="text-lg text-body mt-2 mb-6">
        {items.length} items across {SECTION_ORDER.length} sections. Tap a card to pick size, bread and add-ons.
      </p>

      <CategoryFilters active={category} onChange={setCategory} />

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <p className="text-center text-brand-red py-16">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col gap-11">
          {sectionOrder.map((name) => {
            if (name === "Deals") {
              const entries = deals.map((d) => shapeDeal(d, { addDeal }));
              return <MenuSectionGroup key={name} name="Deals" note="Meal bundles" entries={entries} isList={false} />;
            }
            const sectionItems = items.filter((i) => i.section === (name as SectionName));
            const entries = sectionItems.map((item) => shapeMenuItem(item, { openItem, handleCtaClick }));
            return (
              <MenuSectionGroup
                key={name}
                name={name}
                note={noteByName.get(name as SectionName) ?? ""}
                entries={entries}
                isList={name === "Drinks"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24"><Spinner /></div>}>
      <MenuPageContent />
    </Suspense>
  );
}
