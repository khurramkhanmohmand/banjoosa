import type { Branch as BranchDTO } from "@banjoosa/types";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../lib/errors";

/**
 * Phase 1 runs exactly one branch. This still goes through the Branch
 * table (rather than an env var) so Phase 2 can add branch switching by
 * changing this query, not the schema.
 */
export async function getActiveBranch(): Promise<BranchDTO> {
  const branch = await prisma.branch.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" } });
  if (!branch) throw new NotFoundError("Active branch");
  return {
    id: branch.id,
    name: branch.name,
    address: branch.address,
    phone: branch.phone,
    hours: branch.hours,
    isActive: branch.isActive,
  };
}
