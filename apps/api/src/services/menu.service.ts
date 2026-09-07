import type { Prisma } from "@prisma/client";
import type { MenuItem as MenuItemDTO, MenuSection as MenuSectionDTO, SectionName } from "@banjoosa/types";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../lib/errors";
import type { MenuItemInput } from "../validation/menuItem.schema";

const menuItemInclude = {
  section: true,
  variants: { orderBy: { sortOrder: "asc" as const } },
  addOns: { include: { addOn: true } },
} satisfies Prisma.MenuItemInclude;

type PrismaMenuItemWithRelations = Prisma.MenuItemGetPayload<{ include: typeof menuItemInclude }>;

function toMenuItemDTO(item: PrismaMenuItemWithRelations): MenuItemDTO {
  return {
    id: item.id,
    branchId: item.branchId,
    sectionId: item.sectionId,
    section: item.section.name as SectionName,
    name: item.name,
    slug: item.slug,
    tag: item.tag,
    description: item.description,
    longDescription: item.longDescription,
    imageUrl: item.imageUrl,
    hasVariants: item.hasVariants,
    variantLabel: item.variantLabel,
    basePrice: item.basePrice,
    variants: item.variants.map((v) => ({ id: v.id, label: v.label, price: v.price, sortOrder: v.sortOrder })),
    addOns: item.addOns.map((a) => ({ id: a.addOn.id, name: a.addOn.name, price: a.addOn.price })),
    isAvailable: item.isAvailable,
    sortOrder: item.sortOrder,
  };
}

export async function listSections(): Promise<MenuSectionDTO[]> {
  const sections = await prisma.menuSection.findMany({ orderBy: { sortOrder: "asc" } });
  return sections.map((s) => ({ id: s.id, name: s.name as SectionName, note: s.note, sortOrder: s.sortOrder }));
}

/** Full catalog (available items only) for the customer-facing menu — filtering by section/category happens client-side, matching the design's shared-state category filter. */
export async function listMenuItems(): Promise<MenuItemDTO[]> {
  const items = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    include: menuItemInclude,
    orderBy: [{ section: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });
  return items.map(toMenuItemDTO);
}

/** Includes unavailable items — the admin menu list needs to manage everything, not just what customers can currently order. */
export async function listMenuItemsForAdmin(): Promise<MenuItemDTO[]> {
  const items = await prisma.menuItem.findMany({
    include: menuItemInclude,
    orderBy: [{ section: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });
  return items.map(toMenuItemDTO);
}

export async function getMenuItemById(id: string): Promise<MenuItemDTO> {
  const item = await prisma.menuItem.findUnique({ where: { id }, include: menuItemInclude });
  if (!item) throw new NotFoundError("Menu item");
  return toMenuItemDTO(item);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createMenuItem(branchId: string, input: MenuItemInput): Promise<MenuItemDTO> {
  const created = await prisma.menuItem.create({
    data: {
      branchId,
      sectionId: input.sectionId,
      name: input.name,
      slug: `${slugify(input.name)}-${Date.now().toString(36)}`,
      tag: input.tag ?? null,
      description: input.description,
      longDescription: input.longDescription,
      imageUrl: input.imageUrl ?? null,
      hasVariants: !!input.variants?.length,
      variantLabel: input.variantLabel ?? null,
      basePrice: input.variants?.length ? null : input.basePrice ?? null,
      isAvailable: input.isAvailable ?? true,
      sortOrder: input.sortOrder ?? 0,
      variants: input.variants?.length
        ? { create: input.variants.map((v, i) => ({ label: v.label, price: v.price, sortOrder: i })) }
        : undefined,
      addOns: input.addOnIds?.length ? { create: input.addOnIds.map((addOnId) => ({ addOnId })) } : undefined,
    },
    include: menuItemInclude,
  });
  return toMenuItemDTO(created);
}

export async function updateMenuItem(id: string, input: MenuItemInput): Promise<MenuItemDTO> {
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Menu item");

  await prisma.$transaction([
    prisma.menuItemVariant.deleteMany({ where: { menuItemId: id } }),
    prisma.menuItemAddOn.deleteMany({ where: { menuItemId: id } }),
  ]);

  const updated = await prisma.menuItem.update({
    where: { id },
    data: {
      sectionId: input.sectionId,
      name: input.name,
      tag: input.tag ?? null,
      description: input.description,
      longDescription: input.longDescription,
      imageUrl: input.imageUrl ?? null,
      hasVariants: !!input.variants?.length,
      variantLabel: input.variantLabel ?? null,
      basePrice: input.variants?.length ? null : input.basePrice ?? null,
      isAvailable: input.isAvailable ?? true,
      sortOrder: input.sortOrder ?? 0,
      variants: input.variants?.length
        ? { create: input.variants.map((v, i) => ({ label: v.label, price: v.price, sortOrder: i })) }
        : undefined,
      addOns: input.addOnIds?.length ? { create: input.addOnIds.map((addOnId) => ({ addOnId })) } : undefined,
    },
    include: menuItemInclude,
  });
  return toMenuItemDTO(updated);
}

export async function deleteMenuItem(id: string): Promise<void> {
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Menu item");
  await prisma.menuItem.delete({ where: { id } });
}

export async function listAddOns() {
  return prisma.addOn.findMany({ orderBy: { name: "asc" } });
}

export async function createAddOn(name: string, price: number) {
  return prisma.addOn.create({ data: { name, price } });
}
