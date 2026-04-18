import Link from "next/link";

import { listShowrooms } from "@/app/actions/showrooms";
import { requireStaffRole } from "@xuanvu/shared/auth/role";

export default async function AdminInventoryIndexPage() {
  const guard = await requireStaffRole();

  if (!guard.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <section className="w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-xs">
          <p className="text-sm text-destructive" data-testid="forbidden-message">
            Không có quyền truy cập.
          </p>
        </section>
      </main>
    );
  }

  const result = await listShowrooms();
  const showrooms = result.ok ? result.data : [];
  const hasError = !result.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">Tồn kho showroom</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chọn showroom để xem và cập nhật số lượng từng sản phẩm.
          </p>
        </div>

        {hasError && (
          <p className="mb-4 text-sm text-destructive">Lỗi tải danh sách showroom. Vui lòng thử lại.</p>
        )}

        {!hasError && showrooms.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground" data-testid="inventory-index-empty">
            Chưa có showroom nào. Tạo showroom trước khi nhập tồn.
          </p>
        )}

        {showrooms.length > 0 && (
          <div className="rounded-lg border bg-card shadow-xs">
            <table
              className="w-full"
              data-testid="inventory-showrooms-table"
              aria-label="Showroom và tồn kho"
            >
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tên showroom
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Địa chỉ
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tồn kho
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {showrooms.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 text-sm font-medium text-card-foreground">{s.name}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">{s.address}</td>
                    <td className="py-3">
                      <Link
                        href={`/admin/inventory/${s.id}`}
                        className="text-sm text-primary underline-offset-4 hover:underline"
                        data-testid="inventory-showroom-link"
                      >
                        Mở tồn kho
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
