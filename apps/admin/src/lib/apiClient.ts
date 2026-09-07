import type { ApiErrorResponse } from "@banjoosa/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Thrown by apiFetch so callers can show `err.message` directly to the user. */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

/**
 * Thin fetch wrapper shared in spirit with apps/web's — every non-2xx
 * response becomes a thrown ApiError using the API's single consistent
 * error shape. `credentials: "include"` is what lets the browser attach
 * the admin's httpOnly session cookie to these cross-origin requests.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your connection and try again.", "NETWORK_ERROR", 0);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const errorBody = body as ApiErrorResponse | null;
    throw new ApiError(
      errorBody?.error?.message ?? "Something went wrong",
      errorBody?.error?.code ?? "UNKNOWN_ERROR",
      res.status
    );
  }

  return body as T;
}

export const API_BASE_URL = API_URL;
