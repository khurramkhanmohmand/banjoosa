import type { ReportSummary, ReportTopItem } from "@banjoosa/types";
import { OrderStatus } from "@banjoosa/types";
import { prisma } from "../lib/prisma";

export type ReportRange = "today" | "week" | "month";

function rangeStart(range: ReportRange): Date {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (range === "week") start.setDate(start.getDate() - 6);
  if (range === "month") start.setDate(start.getDate() - 29);
  return start;
}

export async function getReportSummary(branchId: string, range: ReportRange): Promise<ReportSummary> {
  const start = rangeStart(range);
  const end = new Date();

  const orders = await prisma.order.findMany({
    where: {
      branchId,
      createdAt: { gte: start, lte: end },
      status: { not: OrderStatus.CANCELLED },
    },
    include: { items: true },
  });

  const orderCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

  const itemTotals = new Map<string, { qty: number; revenue: number }>();
  for (const order of orders) {
    for (const line of order.items) {
      const current = itemTotals.get(line.name) ?? { qty: 0, revenue: 0 };
      current.qty += line.qty;
      current.revenue += line.lineTotal;
      itemTotals.set(line.name, current);
    }
  }

  const topItems: ReportTopItem[] = Array.from(itemTotals.entries())
    .map(([name, totals]) => ({ name, qty: totals.qty, revenue: totals.revenue }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 8);

  return {
    rangeStart: start.toISOString(),
    rangeEnd: end.toISOString(),
    orderCount,
    totalRevenue,
    avgOrderValue,
    topItems,
  };
}
