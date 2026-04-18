import Link from "next/link";

import { listInventoryByProductsForOrderOps } from "@/app/actions/inventory";
import { requireStaffRole } from "@xuanvu/shared/auth/role";
import { createSupabaseAdminClient } from "@xuanvu/shared/supabase/admin";
import { OrderInventorySnapshot } from "@/components/admin/OrderInventorySnapshot";

const DEMO_LINE_LIMIT = 3;
const DEMO_QTY_ORDERED = 1;

export default async function AdminOrderDemoPage() {
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

  const admin = createSupabaseAdminClient();
  const { data: products, error: prodErr } = await admin
    .from("catalog_products")
    .select("id, name, slug")
    .eq("is_published", true)
    .order("updated_at", { ascending: false })
    .limit(DEMO_LINE_LIMIT);

  if (prodErr) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-sm text-destructive">Không tải được sản phẩm demo.</p>
      </main>
    );
  }

  const lines = (products ?? []) as { id: string; name: string; slug: string }[];
  const productIds = lines.map((p) => p.id);
  const orderLines = lines.map((p) => ({ productId: p.id, name: p.name }));

  const invResult = await listInventoryByProductsForOrderOps(productIds);
  const invRows = invResult.ok ? invResult.data : [];

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-5xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/admin/inventory" className="hover:text-foreground">
            Tồn kho showroom
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Đơn hàng demo</span>
        </nav>

        <h1 className="text-2xl font-semibold tracking-tight text-card-foreground" data-testid="order-demo-title">
          Đơn hàng demo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Luồng nội bộ tạm thời (Phase 18). Khi có module đơn thật, tái sử dụng khối tồn kho bên dưới.
        </p>

        <div className="mt-8 rounded-lg border bg-card p-4 shadow-xs">
          <h2 className="text-lg font-semibold">Dòng đặt hàng (giả lập)</h2>
          {lines.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Chưa có sản phẩm published nào — thêm sản phẩm trong catalog để xem demo.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[400px] border-collapse text-sm" data-testid="order-demo-lines">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Sản phẩm</th>
                    <th className="py-2 font-medium">SL đặt</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((p) => (
                    <tr key={p.id} className="border-b border-border/60">
                      <td className="py-2 pr-3">{p.name}</td>
                      <td className="py-2 tabular-nums">{DEMO_QTY_ORDERED}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!invResult.ok ? (
          <p className="mt-6 text-sm text-destructive">Không tải được tồn kho theo showroom.</p>
        ) : (
          <OrderInventorySnapshot rows={invRows} orderLines={orderLines} />
        )}
      </section>
    </main>
  );
}
