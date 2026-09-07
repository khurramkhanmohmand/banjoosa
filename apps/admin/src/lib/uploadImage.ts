import type { UploadResponse } from "@banjoosa/types";
import { API_BASE_URL, ApiError } from "./apiClient";

/**
 * Separate from apiFetch because a multipart upload must NOT set a JSON
 * Content-Type header — the browser needs to set its own with the
 * multipart boundary — while apiFetch always forces application/json.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/admin/uploads`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your connection and try again.", "NETWORK_ERROR", 0);
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(body?.error?.message ?? "Upload failed", body?.error?.code ?? "UNKNOWN_ERROR", res.status);
  }

  return (body as UploadResponse).url;
}
