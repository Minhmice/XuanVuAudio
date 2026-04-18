import Link from "next/link";

import { requireStaffRole } from "@xuanvu/shared/auth/role";
import { CreateArticleCategoryForm } from "./CreateArticleCategoryForm";

export default async function NewArticleCategoryPage() {
  const guard = await requireStaffRole();

  if (!guard.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <section className="w-full max-w-xl rounded-lg border bg-card p-8 text-card-foreground shadow-xs">
          <p className="text-sm text-destructive" data-testid="forbidden-message">
            Không có quyền truy cập.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <section className="w-full max-w-xl rounded-lg border bg-card p-8 text-card-foreground shadow-xs">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold tracking-tight">Tạo danh mục bài viết</h1>
          <Link
            href="/admin/article-categories"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Hủy
          </Link>
        </div>
        <CreateArticleCategoryForm />
      </section>
    </main>
  );
}

