"use client";

import { Spinner } from "@banjoosa/ui";
import { CartItemType } from "@banjoosa/types";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";
import { DealCard } from "@/components/DealCard";

export default function DealsPage() {
  const { deals, loading, error } = useCatalog();
  const { addLine, openCart } = useCart();

  return (
    <div className="max-w-page mx-auto px-6 py-11">
      <h1 className="font-display text-[40px] sm:text-[56px] text-brand-red mb-2">DEALS & MEALS</h1>
      <p className="text-lg text-body mb-7">
        Make any burger a meal for Rs 260 — fries and a drink. Or take one of the bundles below.
      </p>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <p className="text-center text-brand-red py-16">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onAdd={() => {
                addLine(CartItemType.DEAL, deal.id, null, [], 1);
                openCart();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
