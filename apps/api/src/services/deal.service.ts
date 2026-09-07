import type { Deal as DealDTO } from "@banjoosa/types";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../lib/errors";
import type { DealInput } from "../validation/deal.schema";

function toDealDTO(deal: {
  id: string;
  branchId: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  wasPrice: number;
  imageUrl: string | null;
  isActive: boolean;
}): DealDTO {
  return {
    id: deal.id,
    branchId: deal.branchId,
    name: deal.name,
    description: deal.description,
    longDescription: deal.longDescription,
    price: deal.price,
    wasPrice: deal.wasPrice,
    imageUrl: deal.imageUrl,
    isActive: deal.isActive,
  };
}

export async function listDeals(): Promise<DealDTO[]> {
  const deals = await prisma.deal.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return deals.map(toDealDTO);
}

export async function listDealsForAdmin(): Promise<DealDTO[]> {
  const deals = await prisma.deal.findMany({ orderBy: { sortOrder: "asc" } });
  return deals.map(toDealDTO);
}

export async function getDealById(id: string): Promise<DealDTO> {
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) throw new NotFoundError("Deal");
  return toDealDTO(deal);
}

export async function createDeal(branchId: string, input: DealInput): Promise<DealDTO> {
  const created = await prisma.deal.create({
    data: {
      branchId,
      name: input.name,
      description: input.description,
      longDescription: input.longDescription,
      price: input.price,
      wasPrice: input.wasPrice,
      imageUrl: input.imageUrl ?? null,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
    },
  });
  return toDealDTO(created);
}

export async function updateDeal(id: string, input: DealInput): Promise<DealDTO> {
  const existing = await prisma.deal.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Deal");
  const updated = await prisma.deal.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      longDescription: input.longDescription,
      price: input.price,
      wasPrice: input.wasPrice,
      imageUrl: input.imageUrl ?? null,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
    },
  });
  return toDealDTO(updated);
}

export async function deleteDeal(id: string): Promise<void> {
  const existing = await prisma.deal.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Deal");
  await prisma.deal.delete({ where: { id } });
}
