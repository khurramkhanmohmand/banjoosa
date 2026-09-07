import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

/**
 * A single shared PrismaClient instance. Re-creating clients per-request
 * exhausts Postgres connections; a dev-time hot-reload guard isn't needed
 * here since tsx watch restarts the whole process rather than re-evaluating
 * modules in place.
 */
export const prisma = new PrismaClient({
  log: env.nodeEnv === "development" ? ["warn", "error"] : ["error"],
});
