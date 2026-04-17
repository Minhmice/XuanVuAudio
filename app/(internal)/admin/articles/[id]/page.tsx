import Link from "next/link";

import { requireStaffRole } from "@/app/lib/auth/role";
import { getArticleById } from "@/app/actions/articles";
import { listArticleCategories } from "@/app/actions/article-categories";
import { ArticleDetailForm } from "./ArticleDetailForm";

export default async function AdminArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  const { id } = await params;
  const result = await getArticleById(id);

  if (!result.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <section className="w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <p className="text-sm text-destructive" data-testid="not-found-message">
            {result.error.message}
          </p>
          <div className="mt-4">
            <Link
              href="/admin/articles"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Quay lại danh sách
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const categoriesResult = await listArticleCategories();
  const categories = categoriesResult.ok ? categoriesResult.data : [];

  const article = result.data;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Chi tiết bài viết</h1>
            <p className="mt-1 text-sm text-muted-foreground">{article.id}</p>
          </div>
          <Link
            href="/admin/articles"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Quay lại
          </Link>
        </div>

        <ArticleDetailForm article={article} categories={categories} />
      </section>
    </main>
  );
}

