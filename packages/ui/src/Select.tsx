import { useId, type SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  options: SelectOption[];
}

/** Shared select input, used by admin forms (section picker, order status, etc). */
export function Select({ label, options, id, className = "", ...rest }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="block font-ui font-bold uppercase tracking-wide text-sm text-meta mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={[
          "w-full font-body text-base px-3.5 py-3 border-[3px] border-ink rounded-card bg-cream cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-brand-red",
          className,
        ].join(" ")}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
