import type { AdminUser } from "@banjoosa/types";

declare global {
  namespace Express {
    interface Request {
      admin?: AdminUser;
    }
  }
}

export {};
