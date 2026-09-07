const STATS = [
  { n: "36", l: "Menu items" },
  { n: "25 min", l: "Avg delivery" },
  { n: "1993", l: "Serving since" },
];

export function StatsBand() {
  return (
    <div className="bg-ink py-12 px-6">
      <div className="max-w-page mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {STATS.map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display text-[46px] text-brand-yellow leading-none">{s.n}</div>
            <div className="font-ui uppercase tracking-[0.14em] text-lg text-cream mt-1.5">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
