import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { getSettings } from "../services/settings.service";

export const getSiteSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getSettings();
  res.json(settings);
});
