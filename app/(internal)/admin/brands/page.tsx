import Link from "next/link";

import { requireAdminRole } from "@/app/lib/auth/role";
import { listBrands } from "@/app/actions/catalog";
import type { BrandSummary } from "@/app/actions/catalog";

function PublishBadge({ isPublished }: { isPublished: boolean }) {
  if (isPublished) {
    return (
      <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
        Đang hiển thị
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      Ẩn
    </span>
  );
}

function BrandRow({ brand }: { brand: BrandSummary }) {
  return (
    <tr className="border-b border-border last:border-0" data-testid="brand-row">
      <td className="py-3 pr-4 text-sm font-medium text-card-foreground">
        {brand.name}
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{brand.slug}</td>
      <td className="py-3 pr-4">
        <PublishBadge isPublished={brand.isPublished} />
      </td>
      <td className="py-3">
        <Link
          href={`/admin/brands/${brand.id}`}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}

export default async function AdminBrandsPage() {
  const guard = await requireAdminRole();

  if (!guard.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <section className="w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <p className="text-sm text-destructive" data-testid="forbidden-message">
            Không có quyền truy cập.
          </p>
        </section>
      </main>
    );
  }

  const result = await listBrands();
  const brands = result.ok ? result.data : [];
  const hasError = !result.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Quản lý thương hiệu
          </h1>
          <Link
            href="/admin/brands/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            data-testid="create-brand-link"
          >
            Tạo thương hiệu mới
          </Link>
        </div>

        {hasError && (
          <p className="mb-4 text-sm text-destructive">
            Lỗi tải danh sách thương hiệu. Vui lòng thử lại.
          </p>
        )}

        {!hasError && brands.length === 0 && (
          <p
            className="py-8 text-center text-sm text-muted-foreground"
            data-testid="empty-state"
          >
            Chưa có thương hiệu nào.
          </p>
        )}

        {brands.length > 0 && (
          <div className="rounded-lg border bg-card shadow-sm">
            <table
              className="w-full"
              data-testid="brands-table"
              aria-label="Danh sách thương hiệu"
            >
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tên
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Slug
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Trạng thái
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border px-4">
                {brands.map((brand) => (
                  <BrandRow key={brand.id} brand={brand} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

