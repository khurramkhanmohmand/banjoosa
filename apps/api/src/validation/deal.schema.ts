import { z } from "zod";

export const dealInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(1).max(200),
  longDescription: z.string().trim().min(1).max(600),
  price: z.number().int().min(0),
  wasPrice: z.number().int().min(0),
  imageUrl: z.string().trim().max(300).nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export type DealInput = z.infer<typeof dealInputSchema>;
