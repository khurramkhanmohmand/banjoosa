import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { ValidationError } from "../../lib/errors";
import { publicUploadUrl } from "../../lib/uploads";

/** Runs after the `upload.single("file")` multer middleware in the route — see routes/admin.routes.ts. */
export const postUpload = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ValidationError("No file was uploaded");
  res.status(201).json({ url: publicUploadUrl(req, req.file.filename) });
});
