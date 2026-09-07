export interface SectionHeadingProps {
  name: string;
  note?: string;
}

/** Dark label tag + rule line + note used to head each menu section group. */
export function SectionHeading({ name, note }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-3.5 mb-5">
      <div className="font-ui font-bold uppercase tracking-[0.14em] text-lg bg-ink text-cream px-5 py-1.5">{name}</div>
      <div className="flex-1 h-1 bg-ink" />
      {note && <div className="text-sm text-meta whitespace-nowrap">{note}</div>}
    </div>
  );
}
