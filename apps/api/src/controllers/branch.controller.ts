import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { getActiveBranch } from "../services/branch.service";

export const getBranch = asyncHandler(async (_req: Request, res: Response) => {
  const branch = await getActiveBranch();
  res.json(branch);
});
