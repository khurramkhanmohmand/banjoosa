import { Router } from "express";
import { getBranch } from "../controllers/branch.controller";

export const branchRouter = Router();
branchRouter.get("/branch", getBranch);
