import Link from "next/link";
import type { MenuItem } from "@banjoosa/types";
import { MenuItemCard, priceLabel } from "@banjoosa/ui";
import { useItemModal } from "@/context/ItemModalContext";

/** Curated in the design handoff: Zinger Burger, Chicken Platter Shawarma, Chicken Supreme. */
const FEATURED_ITEM_IDS = ["b1", "sh3", "p4"];

export function FanFavourites({ items }: { items: MenuItem[] }) {
  const { openItem, handleCtaClick } = useItemModal();
  const featured = FEATURED_ITEM_IDS.map((id) => items.find((i) => i.id === id)).filter(
    (i): i is MenuItem => !!i
  );

  if (featured.length === 0) return null;

  return (
    <div className="max-w-page mx-auto px-6 pt-9 pb-14">
      <div className="flex items-end justify-between gap-5 flex-wrap mb-7">
        <h2 className="font-display text-[44px] text-brand-red">FAN FAVOURITES</h2>
        <Link href="/menu" className="font-ui font-bold uppercase tracking-[0.12em] text-lg text-ink">
          All {items.length} items →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((item) => (
          <MenuItemCard
            key={item.id}
            size="featured"
            imageUrl={item.imageUrl}
            imageAlt={item.name}
            tag={item.tag}
            name={item.name}
            description={item.description}
            priceLabel={
              <span className="font-display text-2xl text-brand-red">
                {priceLabel(item.hasVariants ? item.variants.map((v) => v.price) : [item.basePrice ?? 0])}
              </span>
            }
            ctaLabel={item.hasVariants || item.addOns.length > 0 ? "Choose" : "Add"}
            onOpen={() => openItem(item.id)}
            onCtaClick={() => handleCtaClick(item)}
          />
        ))}
      </div>
    </div>
  );
}
