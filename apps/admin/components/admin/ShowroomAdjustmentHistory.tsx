import type { InventoryAdjustmentListItem } from "@xuanvu/shared/inventory/types";

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function ShowroomAdjustmentHistory({ items }: { items: InventoryAdjustmentListItem[] }) {
  if (items.length === 0) {
    return (
      <section className="mt-12 space-y-3" data-testid="adjustment-history-empty">
        <h2 className="text-lg font-semibold tracking-tight">Lịch sử điều chỉnh</h2>
        <p className="rounded-md border border-dashed bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
          Chưa có lịch sử điều chỉnh.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-12 space-y-4" data-testid="adjustment-history">
      <h2 className="text-lg font-semibold tracking-tight">Lịch sử điều chỉnh</h2>
      <div className="overflow-x-auto rounded-lg border bg-card shadow-xs">
        <table className="w-full min-w-[640px]" aria-label="Lịch sử điều chỉnh tồn kho">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Thời gian
              </th>
              <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sản phẩm
              </th>
              <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Thay đổi
              </th>
              <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Người thao tác
              </th>
              <th className="py-3 px-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Ghi chú
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((row) => (
              <tr key={row.id} className="text-sm">
                <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{formatWhen(row.createdAt)}</td>
                <td className="px-3 py-3">
                  <span className="font-medium text-card-foreground">{row.productName}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{row.productSlug}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums">
                  {row.quantityBefore} → {row.quantityAfter}
                </td>
                <td className="px-3 py-3">{row.actorLabel}</td>
                <td className="max-w-xs px-3 py-3 text-muted-foreground">{row.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
