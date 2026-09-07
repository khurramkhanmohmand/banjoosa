import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { createOrderSchema } from "../validation/order.schema";
import { createOrder, getOrderById } from "../services/order.service";
import { emitOrderCreated } from "../lib/socket";

export const postOrder = asyncHandler(async (req: Request, res: Response) => {
  const input = createOrderSchema.parse(req.body);
  const order = await createOrder(input);
  emitOrderCreated(order);
  res.status(201).json(order);
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await getOrderById(req.params.id as string);
  res.json(order);
});
