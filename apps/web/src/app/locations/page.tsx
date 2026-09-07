"use client";

import { Spinner } from "@banjoosa/ui";
import { useCatalog } from "@/context/CatalogContext";
import { BranchCard } from "@/components/locations/BranchCard";
import { MapEmbed } from "@/components/locations/MapEmbed";

/**
 * Verified Google Business Profile listing for the branch ("Banjoosa DHA",
 * Plus Code F9JW+X4 Lahore) — searching the map/directions by this instead
 * of the raw street address pins the real listing (rating/photo/hours
 * card) rather than Google's best guess at geocoding the address text.
 */
const BRANCH_MAP_QUERY = "Banjoosa DHA, F9JW+X4 Lahore, Pakistan";

/**
 * Phase 1 runs exactly one branch, so this page reads the real Branch
 * record (via useCatalog) instead of maintaining a separate hardcoded
 * listing that could drift from the truth — update the address in one
 * place (apps/api/prisma/seed.ts) and it shows up here automatically.
 */
export default function LocationsPage() {
  const { branch, loading, error } = useCatalog();

  return (
    <div className="max-w-page mx-auto px-6 py-11">
      <h1 className="font-display text-[40px] sm:text-[56px] text-brand-red mb-2">FIND A BANJOOSA</h1>
      <p className="text-lg text-body mb-7">
        Dine in, take away or delivery. For order and delivery call {branch?.phone ?? "us"}.
      </p>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <p className="text-center text-brand-red py-16">{error}</p>}

      {!loading && !error && branch && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <BranchCard
            branch={{
              name: branch.name,
              addr: branch.address,
              hours: branch.hours,
              phone: branch.phone,
              mapQuery: BRANCH_MAP_QUERY,
            }}
          />
          <MapEmbed query={BRANCH_MAP_QUERY} />
        </div>
      )}
    </div>
  );
}
