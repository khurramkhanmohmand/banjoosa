import { Router } from "express";
import { getOrder, postOrder } from "../controllers/order.controller";

export const orderRouter = Router();
orderRouter.post("/orders", postOrder);
orderRouter.get("/orders/:id", getOrder);
