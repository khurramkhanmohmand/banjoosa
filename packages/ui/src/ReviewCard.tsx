import { Card } from "./Card";

export interface ReviewCardProps {
  name: string;
  meta: string;
  text: string;
  rating?: number;
}

/** A single testimonial card — used inside the Home page's reviews Carousel. */
export function ReviewCard({ name, meta, text, rating = 5 }: ReviewCardProps) {
  return (
    <Card shadow="none" className="p-6 h-full flex flex-col">
      <div className="font-display text-xl text-brand-red">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</div>
      <p className="text-base leading-relaxed my-2.5 flex-1">{text}</p>
      <div className="font-ui font-bold uppercase tracking-wide text-lg">{name}</div>
      <div className="text-sm text-meta">{meta}</div>
    </Card>
  );
}
