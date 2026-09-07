import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { dealInputSchema } from "../../validation/deal.schema";
import { createDeal, deleteDeal, getDealById, listDealsForAdmin, updateDeal } from "../../services/deal.service";
import { getActiveBranch } from "../../services/branch.service";

export const listDealsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const deals = await listDealsForAdmin();
  res.json({ deals });
});

export const getDealAdmin = asyncHandler(async (req: Request, res: Response) => {
  const deal = await getDealById(req.params.id as string);
  res.json(deal);
});

export const postDeal = asyncHandler(async (req: Request, res: Response) => {
  const input = dealInputSchema.parse(req.body);
  const branch = await getActiveBranch();
  const deal = await createDeal(branch.id, input);
  res.status(201).json(deal);
});

export const putDeal = asyncHandler(async (req: Request, res: Response) => {
  const input = dealInputSchema.parse(req.body);
  const deal = await updateDeal(req.params.id as string, input);
  res.json(deal);
});

export const removeDeal = asyncHandler(async (req: Request, res: Response) => {
  await deleteDeal(req.params.id as string);
  res.status(204).send();
});
