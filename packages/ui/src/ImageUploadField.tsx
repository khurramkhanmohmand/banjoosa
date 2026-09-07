"use client";

import { useId, useRef, useState } from "react";

export interface ImageUploadFieldProps {
  label?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  /** Actual upload API call, injected by the caller — this component never calls fetch itself. */
  onUploadFile: (file: File) => Promise<string>;
}

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp";

/**
 * File picker + preview for admin-managed photos (hero image, menu item /
 * deal photos). Presentational: the actual upload request is injected via
 * `onUploadFile` so this component stays fetch-free, per the project's
 * "no component calls fetch directly" rule.
 */
export function ImageUploadField({ label, value, onChange, onUploadFile }: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const url = await onUploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block font-ui font-bold uppercase tracking-wide text-sm text-meta mb-1.5">
          {label}
        </label>
      )}

      <div className="flex items-center gap-4">
        <div className="w-28 h-28 shrink-0 border-[3px] border-ink rounded-card bg-cream overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-meta text-xs text-center px-1">No image</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={ACCEPTED_TYPES}
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFileSelected(file);
            }}
            className="text-sm file:mr-3 file:font-ui file:font-bold file:uppercase file:tracking-wide file:text-sm file:bg-brand-yellow file:border-[3px] file:border-ink file:rounded-full file:px-4 file:py-1.5 file:cursor-pointer cursor-pointer"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={uploading}
              className="font-ui font-bold uppercase tracking-wide text-xs text-brand-red text-left cursor-pointer w-fit"
            >
              Remove image
            </button>
          )}
          {uploading && <p className="text-sm text-meta m-0">Uploading…</p>}
          {error && <p className="text-sm text-brand-red m-0">{error}</p>}
        </div>
      </div>
    </div>
  );
}
