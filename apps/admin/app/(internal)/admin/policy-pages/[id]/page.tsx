import Link from "next/link";

import { requireAdminRole } from "@xuanvu/shared/auth/role";
import { getPolicyPageById } from "@/app/actions/policy-pages";
import { PolicyPageDetailForm } from "./PolicyPageDetailForm";

export default async function AdminPolicyPageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const guard = await requireAdminRole();

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
  const result = await getPolicyPageById(id);

  if (!result.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <section className="w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-xs">
          <p className="text-sm text-destructive" data-testid="not-found-message">
            {result.error.message}
          </p>
          <div className="mt-4">
            <Link
              href="/admin/policy-pages"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Quay lại danh sách
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const page = result.data;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-xs">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Chi tiết trang chính sách</h1>
            <p className="mt-1 text-sm text-muted-foreground">{page.id}</p>
          </div>
          <Link
            href="/admin/policy-pages"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Quay lại
          </Link>
        </div>

        <PolicyPageDetailForm
          id={page.id}
          keyValue={page.key}
          title={page.title}
          slug={page.slug}
          excerpt={page.excerpt}
          contentMarkdown={page.contentMarkdown}
          isPublished={page.isPublished}
        />
      </section>
    </main>
  );
}

