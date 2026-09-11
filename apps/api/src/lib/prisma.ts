import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

/**
 * When the API is esbuild-bundled into a single dist/server.js (for hosts
 * that don't ship node_modules to the running app — see apps/api/README or
 * the build script), the Prisma query engine binary can't be bundled and is
 * copied next to the bundle instead (scripts/copy-prisma-engine.js). Prisma
 * Client's own engine search doesn't reliably find it there, so point it at
 * the binary explicitly via __dirname, which esbuild preserves as the
 * bundle's actual runtime location. A no-op when running unbundled (tsx),
 * since PRISMA_QUERY_ENGINE_LIBRARY is only set if a matching file exists.
 */
if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  const engineFile = fs
    .readdirSync(__dirname)
    .find((file) => file.startsWith("libquery_engine-") && file.endsWith(".node"));
  if (engineFile) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(__dirname, engineFile);
  }
}

/**
 * A single shared PrismaClient instance. Re-creating clients per-request
 * exhausts Postgres connections; a dev-time hot-reload guard isn't needed
 * here since tsx watch restarts the whole process rather than re-evaluating
 * modules in place.
 */
export const prisma = new PrismaClient({
  log: env.nodeEnv === "development" ? ["warn", "error"] : ["error"],
});
