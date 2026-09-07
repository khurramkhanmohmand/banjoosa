import { z } from "zod";

export const updateSettingsSchema = z.object({
  heroImageUrl: z.string().trim().max(500).nullable(),
  tickerText: z.string().trim().min(1).max(400),
});
