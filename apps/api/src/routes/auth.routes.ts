import { Router } from "express";
import { getMe, getSocketToken, postLogin, postLogout } from "../controllers/auth.controller";
import { requireAdmin } from "../middleware/requireAdmin";

export const authRouter = Router();
authRouter.post("/auth/login", postLogin);
authRouter.post("/auth/logout", postLogout);
authRouter.get("/auth/me", requireAdmin, getMe);
authRouter.get("/auth/socket-token", requireAdmin, getSocketToken);
