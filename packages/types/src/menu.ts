/** Fixed section display order, per the design handoff menu structure. */
export const SECTION_ORDER = [
  "Shawarma",
  "Paratha & Wrap",
  "Burgers",
  "Fries",
  "Pizza",
  "Side Order",
  "Drinks",
] as const;

export type SectionName = (typeof SECTION_ORDER)[number];

export interface MenuSection {
  id: string;
  name: SectionName;
  note: string;
  sortOrder: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemVariant {
  id: string;
  label: string;
  price: number;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  branchId: string;
  sectionId: string;
  section: SectionName;
  name: string;
  slug: string;
  tag: string | null;
  description: string;
  longDescription: string;
  imageUrl: string | null;
  /** Set when the item has size/bread variants instead of one fixed price. */
  hasVariants: boolean;
  /** Label shown above the variant picker, e.g. "Bread style" or "Size". */
  variantLabel: string | null;
  /** Present only when hasVariants is false. */
  basePrice: number | null;
  variants: MenuItemVariant[];
  addOns: AddOn[];
  isAvailable: boolean;
  sortOrder: number;
}

export interface Deal {
  id: string;
  branchId: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  wasPrice: number;
  imageUrl: string | null;
  isActive: boolean;
}

/** Renders as a price-list table instead of photo cards, per the handoff. */
export const LIST_STYLE_SECTIONS: readonly SectionName[] = ["Drinks"];
