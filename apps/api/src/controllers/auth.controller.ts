import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { loginSchema } from "../validation/auth.schema";
import { login } from "../services/auth.service";
import { ADMIN_COOKIE_NAME } from "../config/constants";
import { env } from "../config/env";
import { signAdminToken } from "../lib/jwt";
import { UnauthorizedError } from "../lib/errors";

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const postLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  const { token, admin } = await login(email, password);

  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_MS,
  });
  res.json({ token, admin });
});

export const postLogout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(ADMIN_COOKIE_NAME);
  res.status(204).send();
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.json(req.admin ?? null);
});

/**
 * Issues a short-lived JWT the browser can hand to Socket.io's
 * branch:subscribe handshake. The session cookie itself is httpOnly (so JS
 * can't read it) — this endpoint re-mints an equivalent token for the one
 * place that genuinely needs it in JS, without weakening the cookie.
 */
export const getSocketToken = asyncHandler(async (req: Request, res: Response) => {
  if (!req.admin) throw new UnauthorizedError();
  const token = signAdminToken({ adminId: req.admin.id });
  res.json({ token });
});
