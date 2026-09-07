import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin";
import { listOrders, patchOrderStatus } from "../controllers/admin/order.controller";
import {
  getAddOnsAdmin,
  getMenuItemAdmin,
  getSectionsAdmin,
  listMenuItemsAdmin,
  postAddOnAdmin,
  postMenuItem,
  putMenuItem,
  removeMenuItem,
} from "../controllers/admin/menuItem.controller";
import { getDealAdmin, listDealsAdmin, postDeal, putDeal, removeDeal } from "../controllers/admin/deal.controller";
import { getReports } from "../controllers/admin/report.controller";
import { putSiteSettings } from "../controllers/admin/settings.controller";
import { postUpload } from "../controllers/admin/upload.controller";
import { upload } from "../lib/uploads";

export const adminRouter = Router();
adminRouter.use(requireAdmin);

adminRouter.get("/orders", listOrders);
adminRouter.patch("/orders/:id/status", patchOrderStatus);

adminRouter.get("/menu-items", listMenuItemsAdmin);
adminRouter.get("/menu-items/:id", getMenuItemAdmin);
adminRouter.post("/menu-items", postMenuItem);
adminRouter.put("/menu-items/:id", putMenuItem);
adminRouter.delete("/menu-items/:id", removeMenuItem);

adminRouter.get("/sections", getSectionsAdmin);
adminRouter.get("/addons", getAddOnsAdmin);
adminRouter.post("/addons", postAddOnAdmin);

adminRouter.get("/deals", listDealsAdmin);
adminRouter.get("/deals/:id", getDealAdmin);
adminRouter.post("/deals", postDeal);
adminRouter.put("/deals/:id", putDeal);
adminRouter.delete("/deals/:id", removeDeal);

adminRouter.get("/reports", getReports);

adminRouter.put("/settings", putSiteSettings);
adminRouter.post("/uploads", upload.single("file"), postUpload);
