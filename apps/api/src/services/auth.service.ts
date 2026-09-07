import bcrypt from "bcryptjs";
import type { AdminUser } from "@banjoosa/types";
import { prisma } from "../lib/prisma";
import { UnauthorizedError } from "../lib/errors";
import { signAdminToken } from "../lib/jwt";

export interface LoginResult {
  token: string;
  admin: AdminUser;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const record = await prisma.adminUser.findUnique({ where: { email } });
  if (!record) throw new UnauthorizedError("Invalid email or password");

  const passwordMatches = await bcrypt.compare(password, record.passwordHash);
  if (!passwordMatches) throw new UnauthorizedError("Invalid email or password");

  const token = signAdminToken({ adminId: record.id });
  return {
    token,
    admin: { id: record.id, email: record.email, name: record.name, role: record.role },
  };
}
