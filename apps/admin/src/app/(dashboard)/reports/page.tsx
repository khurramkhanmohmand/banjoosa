"use client";

import { useState } from "react";
import { Card, Pill, Spinner, formatPrice } from "@banjoosa/ui";
import { useReports, type ReportRange } from "@/hooks/useReports";

const RANGES: { label: string; value: ReportRange }[] = [
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "week" },
  { label: "Last 30 days", value: "month" },
];

export default function ReportsPage() {
  const [range, setRange] = useState<ReportRange>("today");
  const { summary, loading, error } = useReports(range);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-brand-red">Reports</h1>

      <div className="flex gap-2">
        {RANGES.map((r) => (
          <Pill key={r.value} active={range === r.value} onClick={() => setRange(r.value)}>
            {r.label}
          </Pill>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <p className="text-brand-red">{error}</p>}

      {!loading && summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card shadow="sticker-soft" className="p-5">
              <div className="text-sm text-meta uppercase font-ui font-bold tracking-wide">Orders</div>
              <div className="font-display text-3xl mt-1">{summary.orderCount}</div>
            </Card>
            <Card shadow="sticker-soft" className="p-5">
              <div className="text-sm text-meta uppercase font-ui font-bold tracking-wide">Revenue</div>
              <div className="font-display text-3xl mt-1">{formatPrice(summary.totalRevenue)}</div>
            </Card>
            <Card shadow="sticker-soft" className="p-5">
              <div className="text-sm text-meta uppercase font-ui font-bold tracking-wide">Avg order value</div>
              <div className="font-display text-3xl mt-1">{formatPrice(summary.avgOrderValue)}</div>
            </Card>
          </div>

          <Card shadow="sticker-soft" className="p-6">
            <div className="font-display text-xl mb-3">Top items</div>
            {summary.topItems.length === 0 ? (
              <p className="text-meta text-sm">No orders in this range yet.</p>
            ) : (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left border-b-[3px] border-ink">
                    <th className="py-2 pr-3 font-ui uppercase tracking-wide text-xs text-meta">Item</th>
                    <th className="py-2 pr-3 font-ui uppercase tracking-wide text-xs text-meta">Qty sold</th>
                    <th className="py-2 pr-3 font-ui uppercase tracking-wide text-xs text-meta">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.topItems.map((item) => (
                    <tr key={item.name} className="border-b-2 border-ink/10">
                      <td className="py-2.5 pr-3">{item.name}</td>
                      <td className="py-2.5 pr-3">{item.qty}</td>
                      <td className="py-2.5 pr-3">{formatPrice(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
