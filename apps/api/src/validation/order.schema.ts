import { z } from "zod";
import { CartItemType, DeliveryMode, PaymentMethod } from "@banjoosa/types";

const orderItemSchema = z.object({
  itemType: z.nativeEnum(CartItemType),
  itemId: z.string().min(1),
  variantId: z.string().min(1).nullable(),
  addOnIds: z.array(z.string().min(1)),
  qty: z.number().int().min(1).max(50),
});

export const createOrderSchema = z.object({
  branchId: z.string().min(1),
  customerName: z.string().trim().min(2, "Name is too short").max(120),
  customerPhone: z.string().trim().min(7, "Phone number is too short").max(30),
  deliveryMode: z.nativeEnum(DeliveryMode),
  address: z.string().trim().max(300).nullable(),
  deliveryNote: z.string().trim().max(300).nullable(),
  pickupTime: z.string().trim().max(120).nullable(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  items: z.array(orderItemSchema).min(1, "Cart is empty"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PLACED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"]),
});
