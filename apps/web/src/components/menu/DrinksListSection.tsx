import { Card } from "@banjoosa/ui";
import type { MenuCardEntry } from "@/lib/menuCardAdapter";

/** Drinks render as a price-list table rather than photo cards, per the handoff. */
export function DrinksListSection({ entries }: { entries: MenuCardEntry[] }) {
  return (
    <Card className="px-5 py-2">
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          className={[
            "flex items-center justify-between gap-4 py-3.5",
            i < entries.length - 1 ? "border-b-2 border-ink/10" : "",
          ].join(" ")}
        >
          <div className="font-ui font-semibold uppercase tracking-wide text-xl">{entry.name}</div>
          <div className="flex items-center gap-4">
            {entry.priceNode}
            <button
              type="button"
              onClick={entry.onCtaClick}
              className="font-ui font-bold uppercase tracking-wide text-base bg-brand-yellow border-[3px] border-ink rounded-full px-3.5 py-1 cursor-pointer"
            >
              {entry.ctaLabel}
            </button>
          </div>
        </div>
      ))}
    </Card>
  );
}
