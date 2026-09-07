import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import multer from "multer";
import { ValidationError } from "./errors";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = ALLOWED_MIME_TYPES[file.mimetype] ?? path.extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

/** Admin image uploads (hero photo, menu item/deal photos) — local disk for Phase 1's single server, see ARCHITECTURE.md. */
export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES[file.mimetype]) {
      cb(new ValidationError("Only JPEG, PNG or WebP images are allowed"));
      return;
    }
    cb(null, true);
  },
});

export function publicUploadUrl(req: { protocol: string; get: (name: string) => string | undefined }, filename: string): string {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
}
