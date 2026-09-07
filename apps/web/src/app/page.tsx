"use client";

import { RevealOnScroll, Spinner } from "@banjoosa/ui";
import { useCatalog } from "@/context/CatalogContext";
import { HeroSection } from "@/components/home/HeroSection";
import { PromoTicker } from "@/components/home/PromoTicker";
import { BrowseBySection } from "@/components/home/BrowseBySection";
import { FanFavourites } from "@/components/home/FanFavourites";
import { StatsBand } from "@/components/home/StatsBand";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ReviewsSection } from "@/components/home/ReviewsSection";

export default function HomePage() {
  const { items, settings, loading, error } = useCatalog();

  return (
    <div>
      <HeroSection heroImageUrl={settings?.heroImageUrl ?? null} />
      <PromoTicker text={settings?.tickerText} />

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <p className="text-center text-brand-red py-16">{error}</p>}

      {!loading && !error && (
        <>
          <RevealOnScroll>
            <BrowseBySection items={items} />
          </RevealOnScroll>
          <RevealOnScroll delay={0.05}>
            <FanFavourites items={items} />
          </RevealOnScroll>
        </>
      )}

      <StatsBand />
      <RevealOnScroll>
        <HowItWorks />
      </RevealOnScroll>
      <RevealOnScroll>
        <ReviewsSection />
      </RevealOnScroll>
    </div>
  );
}
