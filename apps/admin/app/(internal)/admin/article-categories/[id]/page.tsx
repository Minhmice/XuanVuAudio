import Link from "next/link";

import { requireStaffRole } from "@xuanvu/shared/auth/role";
import { getArticleCategoryById } from "@/app/actions/article-categories";
import { ArticleCategoryDetailForm } from "./ArticleCategoryDetailForm";

export default async function AdminArticleCategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  const { id } = await params;
  const result = await getArticleCategoryById(id);

  if (!result.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <section className="w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-xs">
          <p className="text-sm text-destructive" data-testid="not-found-message">
            {result.error.message}
          </p>
          <div className="mt-4">
            <Link
              href="/admin/article-categories"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Quay lại danh sách
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const category = result.data;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-xs">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Chi tiết danh mục</h1>
            <p className="mt-1 text-sm text-muted-foreground">{category.id}</p>
          </div>
          <Link
            href="/admin/article-categories"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Quay lại
          </Link>
        </div>

        <ArticleCategoryDetailForm
          id={category.id}
          name={category.name}
          slug={category.slug}
          description={category.description}
        />
      </section>
    </main>
  );
}

