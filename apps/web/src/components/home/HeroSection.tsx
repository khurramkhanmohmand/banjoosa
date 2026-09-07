import Link from "next/link";
import { Button } from "@banjoosa/ui";

export function HeroSection() {
  return (
    <div className="bg-brand-red">
      <div className="max-w-page mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="font-ui font-bold text-lg tracking-[0.2em] uppercase text-brand-yellow">
            Open till 2am · delivery in 25 min
          </div>
          <h1
            className="font-display leading-[0.95] text-[44px] sm:text-[60px] lg:text-[72px] text-brand-yellow mt-4"
            style={{ textShadow: "5px 5px 0 #1a1512" }}
          >
            OUR MENU HAS
            <br />
            <span className="text-cream">SOMETHING FOR
              <br />
              EVERYONE!
            </span>
          </h1>
          <p className="text-lg leading-relaxed text-cream max-w-[460px] mt-5 mb-7">
            Shawarma, burgers, paratha rolls, pizza and loaded fries. Made to order, out the window hot, every single
            day.
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <Link href="/menu">
              <Button variant="primary" size="lg">
                See the menu
              </Button>
            </Link>
            <Link href="/locations">
              <Button variant="secondary" size="lg">
                Find a store
              </Button>
            </Link>
          </div>
        </div>
        <div className="justify-self-center w-full max-w-[380px] aspect-square border-4 border-ink rounded-full overflow-hidden bg-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/menu/pulled-burger.png" alt="Banjoosa hero dish" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
