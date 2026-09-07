import { useId, type TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

/** Shared multi-line input for admin menu/deal description fields. */
export function Textarea({ label, error, id, className = "", ...rest }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  return (
    <div>
      {label && (
        <label htmlFor={textareaId} className="block font-ui font-bold uppercase tracking-wide text-sm text-meta mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={[
          "w-full font-body text-base px-3.5 py-3 border-[3px] border-ink rounded-card bg-cream min-h-[100px]",
          "focus:outline-none focus:ring-2 focus:ring-brand-red",
          error ? "border-brand-red" : "",
          className,
        ].join(" ")}
        {...rest}
      />
      {error && <p className="text-brand-red text-sm mt-1">{error}</p>}
    </div>
  );
}
