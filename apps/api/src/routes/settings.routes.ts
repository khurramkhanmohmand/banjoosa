import { Router } from "express";
import { getSiteSettings } from "../controllers/settings.controller";

export const settingsRouter = Router();
settingsRouter.get("/settings", getSiteSettings);
