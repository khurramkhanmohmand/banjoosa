import Link from "next/link";
import type { MenuItem, SectionName } from "@banjoosa/types";
import { Card } from "@banjoosa/ui";

/** Representative cover photo per section — decorative only, not modeled in the DB (Drinks intentionally has none). */
const SECTION_COVER: Partial<Record<SectionName, string>> = {
  Shawarma: "/menu/wraps.png",
  "Paratha & Wrap": "/menu/wraps.png",
  Burgers: "/menu/cheeseburger.png",
  Fries: "/menu/loaded-fries.png",
  Pizza: "/menu/pizza.png",
  "Side Order": "/menu/crispy-burger.png",
};

const SECTIONS: SectionName[] = ["Shawarma", "Paratha & Wrap", "Burgers", "Fries", "Pizza", "Side Order", "Drinks"];

export function BrowseBySection({ items }: { items: MenuItem[] }) {
  return (
    <div className="max-w-page mx-auto px-6 pt-14 pb-5">
      <h2 className="font-display text-4xl text-brand-red mb-5">BROWSE BY SECTION</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {SECTIONS.map((section) => {
          const count = items.filter((i) => i.section === section).length;
          const cover = SECTION_COVER[section];
          return (
            <Link key={section} href={`/menu?category=${encodeURIComponent(section)}`}>
              <Card shadow="sticker-soft" interactive className="cursor-pointer h-full">
                <div className="h-[110px] border-b-4 border-ink bg-card relative">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={section} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-meta text-xs font-ui uppercase">
                      Drinks
                    </div>
                  )}
                </div>
                <div className="px-3.5 py-3">
                  <div className="font-ui font-bold uppercase tracking-wide text-lg leading-tight">{section}</div>
                  <div className="text-sm text-meta mt-0.5">{count} items</div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
