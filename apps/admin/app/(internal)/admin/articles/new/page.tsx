import Link from "next/link";

import { requireStaffRole } from "@xuanvu/shared/auth/role";
import { listArticleCategories } from "@/app/actions/article-categories";
import { CreateArticleForm } from "./CreateArticleForm";

export default async function AdminNewArticlePage() {
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

  const categoriesResult = await listArticleCategories();
  const categories = categoriesResult.ok ? categoriesResult.data : [];

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-xs">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tạo bài viết</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tạo bài viết mới (mặc định ở trạng thái bản nháp).
            </p>
          </div>
          <Link
            href="/admin/articles"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Quay lại
          </Link>
        </div>

        <CreateArticleForm categories={categories} />
      </section>
    </main>
  );
}

