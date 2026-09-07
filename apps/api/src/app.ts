import path from "path";
import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { menuRouter } from "./routes/menu.routes";
import { branchRouter } from "./routes/branch.routes";
import { settingsRouter } from "./routes/settings.routes";
import { orderRouter } from "./routes/order.routes";
import { authRouter } from "./routes/auth.routes";
import { adminRouter } from "./routes/admin.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.corsOrigins, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  // Serves admin-uploaded images (hero photo, menu/deal photos) back out at /uploads/<file>.
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api", menuRouter);
  app.use("/api", branchRouter);
  app.use("/api", settingsRouter);
  app.use("/api", orderRouter);
  app.use("/api", authRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
