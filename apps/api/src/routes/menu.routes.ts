import { Router } from "express";
import { getDeals, getMenu } from "../controllers/menu.controller";

export const menuRouter = Router();
menuRouter.get("/menu", getMenu);
menuRouter.get("/deals", getDeals);
