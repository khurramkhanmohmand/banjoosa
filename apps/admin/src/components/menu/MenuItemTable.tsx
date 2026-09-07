import Link from "next/link";
import type { MenuItem } from "@banjoosa/types";
import { Button, priceLabel } from "@banjoosa/ui";

interface MenuItemTableProps {
  items: MenuItem[];
  onDelete: (id: string) => void;
}

export function MenuItemTable({ items, onDelete }: MenuItemTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left border-b-[3px] border-ink">
            <th className="py-2 pr-3 font-ui uppercase tracking-wide text-xs text-meta">Name</th>
            <th className="py-2 pr-3 font-ui uppercase tracking-wide text-xs text-meta">Section</th>
            <th className="py-2 pr-3 font-ui uppercase tracking-wide text-xs text-meta">Price</th>
            <th className="py-2 pr-3 font-ui uppercase tracking-wide text-xs text-meta">Available</th>
            <th className="py-2 pr-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b-2 border-ink/10">
              <td className="py-3 pr-3 font-semibold">{item.name}</td>
              <td className="py-3 pr-3">{item.section}</td>
              <td className="py-3 pr-3">
                {priceLabel(item.hasVariants ? item.variants.map((v) => v.price) : [item.basePrice ?? 0])}
              </td>
              <td className="py-3 pr-3">{item.isAvailable ? "Yes" : "No"}</td>
              <td className="py-3 pr-3">
                <div className="flex gap-2">
                  <Link href={`/menu/${item.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => onDelete(item.id)}>
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
