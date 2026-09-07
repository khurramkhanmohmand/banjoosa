import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { listMenuItems, listSections } from "../services/menu.service";
import { listDeals } from "../services/deal.service";

export const getMenu = asyncHandler(async (_req: Request, res: Response) => {
  const [sections, items] = await Promise.all([listSections(), listMenuItems()]);
  res.json({ sections, items });
});

export const getDeals = asyncHandler(async (_req: Request, res: Response) => {
  const deals = await listDeals();
  res.json({ deals });
});
