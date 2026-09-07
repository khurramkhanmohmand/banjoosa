"use client";

import { useRouter } from "next/navigation";
import { Card, Pill } from "@banjoosa/ui";

export interface LocationListing {
  name: string;
  addr: string;
  hours: string;
  phone: string;
}

export function BranchCard({ branch }: { branch: LocationListing }) {
  const router = useRouter();
  return (
    <Card shadow="sticker-soft-lg" className="p-6 flex flex-col gap-2">
      <div className="font-display text-2xl">{branch.name}</div>
      <div className="text-[15px] leading-relaxed text-body">{branch.addr}</div>
      <div className="font-ui font-bold uppercase tracking-wide text-lg text-brand-red">{branch.hours}</div>
      <div className="text-[15px] text-meta">{branch.phone}</div>
      <div className="flex gap-2.5 mt-1.5 flex-wrap">
        <Pill tone="filter">Directions</Pill>
        <Pill tone="filter" onClick={() => router.push("/menu")}>
          Order here
        </Pill>
      </div>
    </Card>
  );
}
