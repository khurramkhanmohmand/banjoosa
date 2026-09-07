import type { NextFunction, Request, Response } from "express";
import { ADMIN_COOKIE_NAME } from "../config/constants";
import { verifyAdminToken } from "../lib/jwt";
import { UnauthorizedError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/asyncHandler";

/** Protects every /api/admin/* route — Phase 1 has one role (Super Admin), so this is a plain auth check, not a permission check. */
export const requireAdmin = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.[ADMIN_COOKIE_NAME];
  if (!token) {
    throw new UnauthorizedError();
  }

  let payload;
  try {
    payload = verifyAdminToken(token);
  } catch {
    throw new UnauthorizedError("Session expired, please log in again");
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: payload.adminId } });
  if (!admin) {
    throw new UnauthorizedError();
  }

  req.admin = { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
  next();
});
