import { BranchCard, type LocationListing } from "@/components/locations/BranchCard";

/**
 * Static listing copy from the design handoff. Phase 1 operates a single
 * branch end-to-end (menu/orders/admin all point at one Branch row) — these
 * four cards are address-book content, not a branch picker, matching the
 * source prototype where every "Order here" button leads to the same menu.
 */
const LOCATIONS: LocationListing[] = [
  { name: "Gulberg III", addr: "12-C Main Boulevard, near Liberty roundabout", hours: "11:00 am – 2:00 am", phone: "042-34551755" },
  { name: "DHA Phase 5", addr: "Shop 4, Broadway Commercial, Phase 5", hours: "11:00 am – 1:00 am", phone: "0319-6990909" },
  { name: "Johar Town", addr: "Block G1, Khayaban-e-Firdousi", hours: "12:00 pm – 2:00 am", phone: "042-34551755" },
  { name: "Bahria Town", addr: "Sector C, Talwar Chowk food street", hours: "12:00 pm – 12:00 am", phone: "0319-6990909" },
];

export default function LocationsPage() {
  return (
    <div className="max-w-page mx-auto px-6 py-11">
      <h1 className="font-display text-[40px] sm:text-[56px] text-brand-red mb-2">FIND A BANJOOSA</h1>
      <p className="text-lg text-body mb-7">
        Dine in, take away or delivery. For order and delivery call 042-34551755 or 0319-6990909.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {LOCATIONS.map((branch) => (
          <BranchCard key={branch.name} branch={branch} />
        ))}
      </div>
    </div>
  );
}
