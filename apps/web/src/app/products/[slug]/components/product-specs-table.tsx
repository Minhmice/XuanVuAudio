import type { ProductDetailPayload } from "@xuanvu/shared/storefront/product-detail";

export function ProductSpecsTable({ specs }: { specs: ProductDetailPayload["specs"] }) {
  if (specs.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có thông số kỹ thuật cho sản phẩm này.</p>;
  }

  const groups = new Map<string, ProductDetailPayload["specs"]>();
  for (const row of specs) {
    const group = row.groupName || "Khác";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(row);
  }

  return (
    <div className="space-y-6">
      {[...groups.entries()].map(([groupName, rows]) => (
        <div key={groupName}>
          <h3 className="mb-2 text-sm font-semibold text-foreground">{groupName}</h3>
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.label}-${index}`} className="border-b border-border/60 last:border-0">
                  <th scope="row" className="w-2/5 py-2 pr-4 text-left font-normal text-muted-foreground">
                    {row.label}
                  </th>
                  <td className="py-2 text-foreground">{row.valueDisplay || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
