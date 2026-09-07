import { MenuItemCard, SectionHeading } from "@banjoosa/ui";
import type { MenuCardEntry } from "@/lib/menuCardAdapter";
import { DrinksListSection } from "./DrinksListSection";

interface MenuSectionGroupProps {
  name: string;
  note: string;
  entries: MenuCardEntry[];
  isList: boolean;
}

export function MenuSectionGroup({ name, note, entries, isList }: MenuSectionGroupProps) {
  if (entries.length === 0) return null;

  return (
    <div>
      <SectionHeading name={name} note={note} />
      {isList ? (
        <DrinksListSection entries={entries} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <MenuItemCard
              key={entry.id}
              imageUrl={entry.imageUrl}
              imageAlt={entry.name}
              tag={entry.tag}
              name={entry.name}
              description={entry.description}
              priceLabel={entry.priceNode}
              ctaLabel={entry.ctaLabel}
              onOpen={entry.onOpen}
              onCtaClick={entry.onCtaClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
