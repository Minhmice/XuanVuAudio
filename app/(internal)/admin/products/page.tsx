import Link from "next/link";

import { requireAdminRole } from "@/app/lib/auth/role";
import { listProducts } from "@/app/actions/products";
import type { ProductSummary } from "@/app/actions/products";

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

function StatusBadge({ status }: { status: ProductSummary["status"] }) {
  const label =
    status === "active" ? "Đang bán" : status === "inactive" ? "Tạm ngừng" : "Ngừng kinh doanh";
  const className =
    status === "active"
      ? "bg-secondary text-secondary-foreground"
      : status === "inactive"
        ? "bg-muted text-muted-foreground"
        : "bg-destructive/10 text-destructive";

  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

function ProductRow({ product }: { product: ProductSummary }) {
  return (
    <tr className="border-b border-border last:border-0" data-testid="product-row">
      <td className="py-3 pr-4 text-sm font-medium text-card-foreground">{product.name}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{product.slug}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{product.brandName}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{product.categoryName}</td>
      <td className="py-3 pr-4">
        <StatusBadge status={product.status} />
      </td>
      <td className="py-3 pr-4">
        <PublishBadge isPublished={product.isPublished} />
      </td>
      <td className="py-3">
        <Link
          href={`/admin/products/${product.id}`}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}

export default async function AdminProductsPage() {
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

  const result = await listProducts();
  const products = result.ok ? result.data : [];
  const hasError = !result.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Quản lý sản phẩm
          </h1>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            data-testid="create-product-link"
          >
            Tạo sản phẩm mới
          </Link>
        </div>

        {hasError && (
          <p className="mb-4 text-sm text-destructive">
            Lỗi tải danh sách sản phẩm. Vui lòng thử lại.
          </p>
        )}

        {!hasError && products.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground" data-testid="empty-state">
            Chưa có sản phẩm nào.
          </p>
        )}

        {products.length > 0 && (
          <div className="rounded-lg border bg-card shadow-sm">
            <table
              className="w-full"
              data-testid="products-table"
              aria-label="Danh sách sản phẩm"
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
                    Thương hiệu
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Danh mục
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Trạng thái
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Hiển thị
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border px-4">
                {products.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

