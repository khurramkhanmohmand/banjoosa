import Link from "next/link";
import type { Deal } from "@banjoosa/types";
import { Button, formatPrice } from "@banjoosa/ui";

interface DealTableProps {
  deals: Deal[];
  onDelete: (id: string) => void;
}

export function DealTable({ deals, onDelete }: DealTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left border-b-[3px] border-ink">
            <th className="py-2 pr-3 font-ui uppercase tracking-wide text-xs text-meta">Name</th>
            <th className="py-2 pr-3 font-ui uppercase tracking-wide text-xs text-meta">Price</th>
            <th className="py-2 pr-3 font-ui uppercase tracking-wide text-xs text-meta">Was</th>
            <th className="py-2 pr-3 font-ui uppercase tracking-wide text-xs text-meta">Active</th>
            <th className="py-2 pr-3" />
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id} className="border-b-2 border-ink/10">
              <td className="py-3 pr-3 font-semibold">{deal.name}</td>
              <td className="py-3 pr-3">{formatPrice(deal.price)}</td>
              <td className="py-3 pr-3">{formatPrice(deal.wasPrice)}</td>
              <td className="py-3 pr-3">{deal.isActive ? "Yes" : "No"}</td>
              <td className="py-3 pr-3">
                <div className="flex gap-2">
                  <Link href={`/deals/${deal.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => onDelete(deal.id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
