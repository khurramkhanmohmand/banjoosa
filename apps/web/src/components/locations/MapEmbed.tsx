/**
 * Free, keyless Google Maps embed — no API key/billing account needed,
 * unlike the official Maps Embed API. `query` should be the verified
 * Google Business Profile name (+ Plus Code, if you have one) rather than
 * just the raw street address — searching by name pins the exact business
 * listing (with its rating/photo/hours card) instead of Google's best
 * guess at geocoding the address text, which can land a block or two off.
 */
export function MapEmbed({ query }: { query: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <div className="border-4 border-ink rounded-card overflow-hidden shadow-sticker-soft-lg h-[360px]">
      <iframe
        src={src}
        title="Banjoosa location map"
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
