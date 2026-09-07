import { z } from "zod";

const variantInputSchema = z.object({
  label: z.string().trim().min(1),
  price: z.number().int().min(0),
});

export const menuItemInputSchema = z
  .object({
    sectionId: z.string().min(1),
    name: z.string().trim().min(2).max(120),
    tag: z.string().trim().max(40).nullable().optional(),
    description: z.string().trim().min(1).max(200),
    longDescription: z.string().trim().min(1).max(600),
    imageUrl: z.string().trim().max(300).nullable().optional(),
    variantLabel: z.string().trim().max(40).nullable().optional(),
    basePrice: z.number().int().min(0).nullable().optional(),
    variants: z.array(variantInputSchema).optional(),
    addOnIds: z.array(z.string().min(1)).optional(),
    isAvailable: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  })
  .refine((data) => (data.variants && data.variants.length > 0) || data.basePrice !== undefined && data.basePrice !== null, {
    message: "Provide either a basePrice or at least one variant",
    path: ["basePrice"],
  });

export type MenuItemInput = z.infer<typeof menuItemInputSchema>;
