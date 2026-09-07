import { Card } from "@banjoosa/ui";

const REVIEWS = [
  {
    name: "Leslie Alexander",
    meta: "Gulberg III",
    text: "Platter shawarma with paratha is the best value on this street. Fries actually hand-cut.",
  },
  {
    name: "Esther Howard",
    meta: "DHA Phase 5",
    text: "Delivery came in 22 minutes and the crown crust was still hot. Zinger is consistent every time.",
  },
  {
    name: "Darlene Robertson",
    meta: "Johar Town",
    text: "Ordered the family pizza deal for six people and it worked out cheaper than anywhere nearby.",
  },
];

export function ReviewsSection() {
  return (
    <div className="bg-brand-red py-14 px-6">
      <div className="max-w-page mx-auto">
        <h2 className="font-display text-4xl text-brand-yellow mb-6" style={{ textShadow: "4px 4px 0 #1a1512" }}>
          WHAT PEOPLE SAY
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <Card key={r.name} shadow="none" className="p-6">
              <div className="font-display text-xl text-brand-red">★★★★★</div>
              <p className="text-base leading-relaxed my-2.5">{r.text}</p>
              <div className="font-ui font-bold uppercase tracking-wide text-lg">{r.name}</div>
              <div className="text-sm text-meta">{r.meta}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
