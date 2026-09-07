import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Shared empty-state block — empty cart, empty order list, no menu items in a filter, etc. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-2 py-10 px-4">
      <p className="font-ui font-bold uppercase tracking-wide text-lg text-ink m-0">{title}</p>
      {description && <p className="text-meta text-[15px] m-0 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
