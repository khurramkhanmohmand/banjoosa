"use client";

import { useRouter } from "next/navigation";
import { Card, Pill } from "@banjoosa/ui";

export interface LocationListing {
  name: string;
  addr: string;
  hours: string;
  phone: string;
  /** Verified Google Business Profile name/Plus Code, when available — pins the real listing instead of a geocoded guess at `addr`. */
  mapQuery?: string;
}

export function BranchCard({ branch }: { branch: LocationListing }) {
  const router = useRouter();

  const openDirections = () => {
    const destination = branch.mapQuery ?? branch.addr;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card shadow="sticker-soft-lg" className="p-6 flex flex-col gap-2">
      <div className="font-display text-2xl">{branch.name}</div>
      <div className="text-[15px] leading-relaxed text-body">{branch.addr}</div>
      <div className="font-ui font-bold uppercase tracking-wide text-lg text-brand-red">{branch.hours}</div>
      <div className="text-[15px] text-meta">{branch.phone}</div>
      <div className="flex gap-2.5 mt-1.5 flex-wrap">
        <Pill tone="filter" onClick={openDirections}>
          Directions
        </Pill>
        <Pill tone="filter" onClick={() => router.push("/menu")}>
          Order here
        </Pill>
      </div>
    </Card>
  );
}
