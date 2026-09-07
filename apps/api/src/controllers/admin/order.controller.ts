import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { updateOrderStatusSchema } from "../../validation/order.schema";
import { listOrdersForBranch, updateOrderStatus, type ListOrdersFilter } from "../../services/order.service";
import { getActiveBranch } from "../../services/branch.service";
import { emitOrderStatusChanged } from "../../lib/socket";
import type { OrderStatus } from "@banjoosa/types";

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const branch = await getActiveBranch();
  const filter: ListOrdersFilter = {};
  if (typeof req.query.status === "string") {
    filter.status = req.query.status as OrderStatus;
  }
  const orders = await listOrdersForBranch(branch.id, filter);
  res.json({ orders });
});

export const patchOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = updateOrderStatusSchema.parse(req.body);
  const order = await updateOrderStatus(req.params.id as string, status);
  emitOrderStatusChanged(order.branchId, { orderId: order.id, status: order.status, updatedAt: order.updatedAt });
  res.json(order);
});
