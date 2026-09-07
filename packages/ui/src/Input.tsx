import { useId, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/** Shared text input — checkout form fields and admin CRUD forms both use it. */
export function Input({ label, error, id, className = "", ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="block font-ui font-bold uppercase tracking-wide text-sm text-meta mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "w-full font-body text-base px-3.5 py-3 border-[3px] border-ink rounded-card bg-cream",
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
