import type { OrderInventoryShowroomRow } from "@xuanvu/shared/inventory/types";

export type OrderInventorySnapshotProps = {
  rows: OrderInventoryShowroomRow[];
  /** Lines on the order (ids + labels) — used for “no ledger” hints. */
  orderLines: { productId: string; name: string }[];
};

export function OrderInventorySnapshot({ rows, orderLines }: OrderInventorySnapshotProps) {
  const withRow = new Set(rows.map((r) => r.productId));
  const missingLedger = orderLines.filter((l) => !withRow.has(l.productId));

  return (
    <section
      className="mt-8 rounded-lg border bg-card p-4 text-card-foreground shadow-xs"
      data-testid="order-inventory-snapshot"
    >
      <h2 className="text-lg font-semibold tracking-tight">Tồn kho theo showroom</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Chỉ hiển thị các cặp sản phẩm–showroom đã có bản ghi tồn kho (đọc-only).
      </p>

      {orderLines.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Không có sản phẩm trên đơn.</p>
      ) : null}

      {missingLedger.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          {missingLedger.map((l) => (
            <li key={`missing-${l.productId}`}>
              <span className="font-medium text-foreground">{l.name}</span>
              {": "}
              <span className="text-amber-700 dark:text-amber-500">Chưa có bản ghi tồn kho.</span>
            </li>
          ))}
        </ul>
      ) : null}

      {rows.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Sản phẩm</th>
                <th className="py-2 pr-3 font-medium">Showroom</th>
                <th className="py-2 font-medium">Tồn</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.productId}-${r.showroomId}`} className="border-b border-border/60">
                  <td className="py-2 pr-3">
                    <span className="font-medium text-foreground">{r.productName}</span>
                  </td>
                  <td className="py-2 pr-3">{r.showroomName}</td>
                  <td className="py-2 tabular-nums">{r.quantityOnHand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
