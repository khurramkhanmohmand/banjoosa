import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { menuItemInputSchema } from "../../validation/menuItem.schema";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemById,
  listAddOns,
  createAddOn,
  listMenuItemsForAdmin,
  listSections,
  updateMenuItem,
} from "../../services/menu.service";
import { getActiveBranch } from "../../services/branch.service";
import { z } from "zod";

export const listMenuItemsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const items = await listMenuItemsForAdmin();
  res.json({ items });
});

export const getMenuItemAdmin = asyncHandler(async (req: Request, res: Response) => {
  const item = await getMenuItemById(req.params.id as string);
  res.json(item);
});

export const postMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const input = menuItemInputSchema.parse(req.body);
  const branch = await getActiveBranch();
  const item = await createMenuItem(branch.id, input);
  res.status(201).json(item);
});

export const putMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const input = menuItemInputSchema.parse(req.body);
  const item = await updateMenuItem(req.params.id as string, input);
  res.json(item);
});

export const removeMenuItem = asyncHandler(async (req: Request, res: Response) => {
  await deleteMenuItem(req.params.id as string);
  res.status(204).send();
});

export const getSectionsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const sections = await listSections();
  res.json({ sections });
});

export const getAddOnsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const addOns = await listAddOns();
  res.json({ addOns });
});

const addOnInputSchema = z.object({ name: z.string().trim().min(1).max(60), price: z.number().int().min(0) });

export const postAddOnAdmin = asyncHandler(async (req: Request, res: Response) => {
  const input = addOnInputSchema.parse(req.body);
  const addOn = await createAddOn(input.name, input.price);
  res.status(201).json(addOn);
});
