import { Card } from "@banjoosa/ui";

const STEPS = [
  { n: "01", t: "Pick a section", d: "Shawarma, burgers, paratha rolls, pizza, fries." },
  { n: "02", t: "Choose size & add-ons", d: "Bread style, pizza size, cheese, jalapeño, make it a meal." },
  { n: "03", t: "Pay & track", d: "Card, cash on delivery or wallet. Live rider updates." },
];

export function HowItWorks() {
  return (
    <div className="max-w-page mx-auto px-6 py-14">
      <h2 className="font-display text-4xl text-brand-red mb-6">HOW ORDERING WORKS</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STEPS.map((s) => (
          <Card key={s.n} shadow="sticker-soft-lg" className="p-6">
            <div className="font-display text-[34px] text-brand-yellow" style={{ WebkitTextStroke: "2px #1a1512" }}>
              {s.n}
            </div>
            <div className="font-ui font-bold uppercase tracking-wide text-2xl mt-2">{s.t}</div>
            <p className="text-[15px] leading-relaxed text-body mt-1.5 mb-0">{s.d}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
