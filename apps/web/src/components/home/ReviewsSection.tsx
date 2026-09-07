import { Carousel, ReviewCard } from "@banjoosa/ui";

/** Real 5-star Google reviews for the DHA branch, provided by the client — the 1-star review from that listing was intentionally excluded. */
const REVIEWS = [
  {
    name: "Muhammad Aman Khan",
    meta: "Google review",
    text: "This place is absolutely amazing! Their shawarma is incredibly juicy and flavorful, the spices are perfectly balanced making every bite a delight. And the pizza? Simply topnotch! With a crispy crust, fresh cheese, and quality toppings, it tastes just as good as it looks. If you're ever in DHA especially around H Block, make sure to give this spot a try — you won't be disappointed!",
  },
  {
    name: "Muhammad Ali",
    meta: "Google review",
    text: "Best wrap and shawarma in town. Always hot and fresh. Wings are superb.",
  },
  {
    name: "Ambreen Akram",
    meta: "Google review",
    text: "Great experience.. very good taste. Food is really worth it.",
  },
  {
    name: "Saood Ahmed Jatoi",
    meta: "Google review",
    text: "Great taste and services. Really good option in this area.",
  },
];

export function ReviewsSection() {
  return (
    <div className="bg-brand-red py-14 px-6">
      <div className="max-w-page mx-auto">
        <h2 className="font-display text-4xl text-brand-yellow mb-6" style={{ textShadow: "4px 4px 0 #1a1512" }}>
          WHAT PEOPLE SAY
        </h2>
        <Carousel>
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} name={r.name} meta={r.meta} text={r.text} />
          ))}
        </Carousel>
      </div>
    </div>
  );
}
