import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { updateSettingsSchema } from "../../validation/settings.schema";
import { updateSettings } from "../../services/settings.service";

export const putSiteSettings = asyncHandler(async (req: Request, res: Response) => {
  const input = updateSettingsSchema.parse(req.body);
  const settings = await updateSettings(input);
  res.json(settings);
});
