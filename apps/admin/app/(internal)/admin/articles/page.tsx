import Link from "next/link";

import { requireStaffRole } from "@xuanvu/shared/auth/role";
import { listArticles } from "@/app/actions/articles";
import type { ArticleSummary } from "@/app/actions/articles";

function StatusBadge({ status }: { status: ArticleSummary["status"] }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-700">
        Đã xuất bản
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      Bản nháp
    </span>
  );
}

function ArticleRow({ article }: { article: ArticleSummary }) {
  return (
    <tr className="border-b border-border last:border-0" data-testid="article-row">
      <td className="py-3 pr-4 text-sm font-medium text-card-foreground">
        <span className="block max-w-104 truncate">{article.title}</span>
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{article.slug}</td>
      <td className="py-3 pr-4">
        <StatusBadge status={article.status} />
      </td>
      <td className="py-3">
        <Link
          href={`/admin/articles/${article.id}`}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}

export default async function AdminArticlesPage() {
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

  const result = await listArticles();
  const articles = result.ok ? result.data : [];
  const hasError = !result.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Bài viết
          </h1>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            data-testid="create-article-link"
          >
            Tạo bài viết
          </Link>
        </div>

        {hasError && (
          <p className="mb-4 text-sm text-destructive">
            Lỗi tải danh sách bài viết. Vui lòng thử lại.
          </p>
        )}

        {!hasError && articles.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground" data-testid="empty-state">
            Chưa có bài viết nào.
          </p>
        )}

        {articles.length > 0 && (
          <div className="rounded-lg border bg-card shadow-xs">
            <table className="w-full" data-testid="articles-table" aria-label="Danh sách bài viết">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tiêu đề
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
                {articles.map((article) => (
                  <ArticleRow key={article.id} article={article} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

