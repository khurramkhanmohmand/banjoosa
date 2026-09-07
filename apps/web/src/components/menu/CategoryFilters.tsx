import { Pill } from "@banjoosa/ui";
import { SECTION_ORDER } from "@banjoosa/types";

export const MENU_CATEGORIES = ["All", ...SECTION_ORDER, "Deals"] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

interface CategoryFiltersProps {
  active: MenuCategory;
  onChange: (category: MenuCategory) => void;
}

export function CategoryFilters({ active, onChange }: CategoryFiltersProps) {
  return (
    <div className="flex gap-2.5 flex-wrap mb-8">
      {MENU_CATEGORIES.map((cat) => (
        <Pill key={cat} active={active === cat} onClick={() => onChange(cat)}>
          {cat}
        </Pill>
      ))}
    </div>
  );
}
