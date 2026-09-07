import { GalleryGrid } from "@/components/about/GalleryGrid";

const INFO_BLOCKS = [
  { title: "Order and delivery", body: "042-34551755\n0319-6990909\nGulberg III, Lahore" },
  { title: "Franchise", body: "Territories open across Punjab. Send a note and the team replies inside two working days." },
  { title: "Careers", body: "Kitchen, counter and rider roles at every branch. Walk in with an ID card any weekday before 5 pm." },
];

export default function AboutPage() {
  return (
    <div className="max-w-page mx-auto px-6 py-11">
      <h1 className="font-display text-[40px] sm:text-[56px] text-brand-red mb-2">SINCE 1993</h1>
      <p className="text-lg leading-relaxed text-body max-w-[720px] mb-8">
        Banjoosa started as a single counter selling one shawarma roll and one burger. The method has not changed:
        bread warmed to order, chicken marinated overnight, sauces mixed in house. The menu grew to shawarma, paratha
        rolls, burgers, fries and pizza, and the queue is still the only review that matters.
      </p>

      <GalleryGrid />

      <div className="border-4 border-ink rounded-card bg-ink text-cream p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {INFO_BLOCKS.map((block) => (
          <div key={block.title}>
            <div className="font-display text-2xl text-brand-yellow mb-2">{block.title}</div>
            <div className="text-base leading-relaxed whitespace-pre-line">{block.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
