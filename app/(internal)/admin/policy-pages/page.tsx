import Link from "next/link";

import { requireAdminRole } from "@/app/lib/auth/role";
import { listPolicyPages } from "@/app/actions/policy-pages";
import type { PolicyPageSummary } from "@/app/actions/policy-pages";

function PolicyPageRow({ page }: { page: PolicyPageSummary }) {
  return (
    <tr className="border-b border-border last:border-0" data-testid="policy-page-row">
      <td className="py-3 pr-4 text-sm font-medium text-card-foreground">{page.title}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{page.key}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{page.slug}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">
        {page.isPublished ? "Đã xuất bản" : "Nháp"}
      </td>
      <td className="py-3">
        <Link
          href={`/admin/policy-pages/${page.id}`}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}

export default async function AdminPolicyPagesPage() {
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

  const result = await listPolicyPages();
  const pages = result.ok ? result.data : [];
  const hasError = !result.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Trang chính sách
          </h1>
          <Link
            href="/admin/policy-pages/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            data-testid="create-policy-page-link"
          >
            Tạo trang
          </Link>
        </div>

        {hasError && (
          <p className="mb-4 text-sm text-destructive">
            Lỗi tải danh sách trang chính sách. Vui lòng thử lại.
          </p>
        )}

        {!hasError && pages.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground" data-testid="empty-state">
            Chưa có trang chính sách nào.
          </p>
        )}

        {pages.length > 0 && (
          <div className="rounded-lg border bg-card shadow-sm">
            <table className="w-full" data-testid="policy-pages-table" aria-label="Danh sách trang chính sách">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tiêu đề
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Key
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
                {pages.map((page) => (
                  <PolicyPageRow key={page.id} page={page} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

