const GALLERY_IMAGES = [
  "/menu/pulled-burger.png",
  "/menu/pizza.png",
  "/menu/wraps.png",
  "/menu/crispy-burger.png",
  "/menu/loaded-fries.png",
  "/menu/cheeseburger.png",
];

export function GalleryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-9">
      {GALLERY_IMAGES.map((src, i) => (
        <div key={i} className="aspect-square border-4 border-ink rounded-card overflow-hidden bg-card relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Banjoosa kitchen" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}
