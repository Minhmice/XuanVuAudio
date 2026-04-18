"use client";

import { useMemo, useState } from "react";

import { upsertShowroomInventoryLineFormAction } from "@/app/actions/inventory";
import type { ShowroomInventoryLine } from "@xuanvu/shared/inventory/types";

export function ShowroomInventoryTable({
  showroomId,
  lines,
}: {
  showroomId: string;
  lines: ShowroomInventoryLine[];
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return lines;
    return lines.filter((l) => l.name.toLowerCase().includes(t));
  }, [lines, q]);

  if (lines.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground" data-testid="inventory-empty-products">
        Chưa có sản phẩm active/inactive để nhập tồn.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <label className="flex max-w-md flex-col gap-1 text-sm">
        <span className="text-muted-foreground">Lọc theo tên</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Gõ để lọc…"
          className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          data-testid="inventory-filter"
        />
      </label>

      <div className="rounded-lg border bg-card shadow-xs">
        <table className="w-full" data-testid="inventory-table" aria-label="Tồn kho theo sản phẩm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sản phẩm
              </th>
              <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Slug
              </th>
              <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Cập nhật tồn
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((line) => (
              <tr key={line.productId} className="border-b border-border last:border-0">
                <td className="py-3 pr-4 text-sm font-medium text-card-foreground">{line.name}</td>
                <td className="py-3 pr-4 text-sm text-muted-foreground">{line.slug}</td>
                <td className="py-3">
                  <form
                    action={async (formData) => {
                      await upsertShowroomInventoryLineFormAction(formData);
                    }}
                    className="flex max-w-md flex-col gap-2"
                  >
                    <input type="hidden" name="showroomId" value={showroomId} />
                    <input type="hidden" name="productId" value={line.productId} />
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        name="quantityOnHand"
                        min={0}
                        step={1}
                        defaultValue={line.quantityOnHand}
                        className="border-input bg-background h-9 w-24 rounded-md border px-2 text-sm"
                        aria-label={`Số lượng ${line.name}`}
                      />
                      <button
                        type="submit"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-3 text-sm font-medium"
                      >
                        Lưu
                      </button>
                    </div>
                    <input
                      type="text"
                      name="note"
                      placeholder="Ghi chú (tuỳ chọn)"
                      defaultValue=""
                      className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
                      aria-label={`Ghi chú điều chỉnh ${line.name}`}
                    />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && lines.length > 0 && (
        <p className="text-sm text-muted-foreground">Không có sản phẩm khớp bộ lọc.</p>
      )}
    </div>
  );
}
