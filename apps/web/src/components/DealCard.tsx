import { Button, formatPrice } from "@banjoosa/ui";
import type { Deal } from "@banjoosa/types";

export function DealCard({ deal, onAdd }: { deal: Deal; onAdd: () => void }) {
  return (
    <div className="border-4 border-ink rounded-card overflow-hidden bg-brand-red shadow-sticker-lg flex flex-col">
      <div className="h-[200px] border-b-4 border-ink bg-card relative">
        {deal.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={deal.imageUrl} alt={deal.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-meta font-ui uppercase text-sm">
            Photo coming soon
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col gap-2.5 flex-1">
        <div className="font-display text-2xl text-brand-yellow">{deal.name}</div>
        <p className="text-[15px] leading-relaxed text-cream m-0 flex-1">{deal.description}</p>
        <div className="flex items-center gap-3">
          <span className="font-display text-[28px] text-cream">{formatPrice(deal.price)}</span>
          <span className="font-ui text-lg text-brand-yellow line-through">{formatPrice(deal.wasPrice)}</span>
        </div>
        <Button variant="primary" fullWidth onClick={onAdd}>
          Add deal to cart
        </Button>
      </div>
    </div>
  );
}
