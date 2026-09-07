import type { NextFunction, Request, Response } from "express";
import type { ApiErrorResponse } from "@banjoosa/types";
import { AppError } from "../lib/errors";
import { ZodError } from "zod";

/**
 * Single consistent error-response shape for the whole API: every failure
 * (validation, auth, not-found, or an unexpected exception) resolves to
 * `{ error: { message, code, details? } }` so both frontends can handle
 * errors with one code path instead of guessing the shape per endpoint.
 */
export function errorHandler(err: unknown, req: Request, res: Response<ApiErrorResponse>, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { message: err.message, code: err.code, details: err.details } });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: { message: "Invalid request body", code: "VALIDATION_ERROR", details: err.flatten() },
    });
    return;
  }

  console.error(`Unhandled error on ${req.method} ${req.path}:`, err);
  res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
}

export function notFoundHandler(req: Request, res: Response<ApiErrorResponse>): void {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.path}`, code: "ROUTE_NOT_FOUND" } });
}
