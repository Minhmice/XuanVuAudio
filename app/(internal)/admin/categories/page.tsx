import Link from "next/link";

import { requireAdminRole } from "@/app/lib/auth/role";
import { listCategories } from "@/app/actions/catalog";
import type { CategorySummary } from "@/app/actions/catalog";

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

function CategoryRow({ category }: { category: CategorySummary }) {
  return (
    <tr className="border-b border-border last:border-0" data-testid="category-row">
      <td className="py-3 pr-4 text-sm font-medium text-card-foreground">
        {category.name}
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{category.slug}</td>
      <td className="py-3 pr-4">
        <PublishBadge isPublished={category.isPublished} />
      </td>
      <td className="py-3">
        <Link
          href={`/admin/categories/${category.id}`}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}

export default async function AdminCategoriesPage() {
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

  const result = await listCategories();
  const categories = result.ok ? result.data : [];
  const hasError = !result.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Quản lý danh mục
          </h1>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            data-testid="create-category-link"
          >
            Tạo danh mục mới
          </Link>
        </div>

        {hasError && (
          <p className="mb-4 text-sm text-destructive">
            Lỗi tải danh sách danh mục. Vui lòng thử lại.
          </p>
        )}

        {!hasError && categories.length === 0 && (
          <p
            className="py-8 text-center text-sm text-muted-foreground"
            data-testid="empty-state"
          >
            Chưa có danh mục nào.
          </p>
        )}

        {categories.length > 0 && (
          <div className="rounded-lg border bg-card shadow-sm">
            <table
              className="w-full"
              data-testid="categories-table"
              aria-label="Danh sách danh mục"
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
                {categories.map((category) => (
                  <CategoryRow key={category.id} category={category} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

