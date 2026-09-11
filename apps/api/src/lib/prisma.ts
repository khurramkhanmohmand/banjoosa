import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

/**
 * Prisma 5.x's driver adapters (preview) route actual database I/O through
 * `pg` instead of the Rust engine's own tokio-postgres client — that's the
 * piece that panicked ("PANIC: timer has gone away") under Hostinger's
 * shared hosting, which throttles/suspends idle processes in a way the
 * engine's async runtime doesn't tolerate. The Rust engine itself is still
 * loaded in-process for query planning in this Prisma version, so it still
 * needs its binary on disk; when esbuild-bundled into a single dist/server.js
 * (see apps/api's build script), that binary is copied next to the bundle by
 * scripts/copy-prisma-engine.js, and this points Prisma at it explicitly via
 * __dirname (which esbuild preserves as the bundle's real runtime location)
 * since Prisma's own search doesn't reliably find it there. No-op when
 * running unbundled (tsx), since the env var is only set if a matching file
 * exists.
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
 * Supabase's Postgres requires SSL. `pg` doesn't reliably enable it from a
 * `?sslmode=require` query param alone, so set it explicitly (Supabase's own
 * connection certs aren't in Node's default CA bundle, hence
 * rejectUnauthorized: false — this is Supabase's documented setup for `pg`).
 * connectionTimeoutMillis keeps a bad connection failing fast instead of
 * hanging until the host's gateway kills the request.
 */
const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10_000,
});
const adapter = new PrismaPg(pool);

/**
 * A single shared PrismaClient instance. Re-creating clients per-request
 * exhausts Postgres connections; a dev-time hot-reload guard isn't needed
 * here since tsx watch restarts the whole process rather than re-evaluating
 * modules in place.
 */
export const prisma = new PrismaClient({
  adapter,
  log: env.nodeEnv === "development" ? ["warn", "error"] : ["error"],
});
