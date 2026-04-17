import Link from "next/link";

import { requireStaffRole } from "@/app/lib/auth/role";
import { listArticleCategories } from "@/app/actions/article-categories";
import type { ArticleCategorySummary } from "@/app/actions/article-categories";

function CategoryRow({ category }: { category: ArticleCategorySummary }) {
  return (
    <tr
      className="border-b border-border last:border-0"
      data-testid="article-category-row"
    >
      <td className="py-3 pr-4 text-sm font-medium text-card-foreground">
        {category.name}
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{category.slug}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">
        <span className="block max-w-[28rem] truncate">
          {category.description ?? "—"}
        </span>
      </td>
      <td className="py-3">
        <Link
          href={`/admin/article-categories/${category.id}`}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}

export default async function AdminArticleCategoriesPage() {
  const guard = await requireStaffRole();

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

  const result = await listArticleCategories();
  const categories = result.ok ? result.data : [];
  const hasError = !result.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Danh mục bài viết
          </h1>
          <Link
            href="/admin/article-categories/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            data-testid="create-article-category-link"
          >
            Tạo danh mục
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
            Chưa có danh mục bài viết nào.
          </p>
        )}

        {categories.length > 0 && (
          <div className="rounded-lg border bg-card shadow-sm">
            <table
              className="w-full"
              data-testid="article-categories-table"
              aria-label="Danh sách danh mục bài viết"
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
                    Mô tả
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

