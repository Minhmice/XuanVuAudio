import Link from "next/link";

import { requireAdminRole } from "@xuanvu/shared/auth/role";
import { listSpecAttributeDefinitions } from "@/app/actions/spec-attribute-definitions";
import type { SpecAttributeSummary } from "@/app/actions/spec-attribute-definitions";

function ActiveBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
        Đang dùng
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      Tắt
    </span>
  );
}

function ValueTypeLabel({ valueType }: { valueType: SpecAttributeSummary["valueType"] }) {
  const label =
    valueType === "text" ? "Văn bản" : valueType === "number" ? "Số" : "Đúng/sai";
  return <span className="text-sm text-muted-foreground">{label}</span>;
}

function SpecAttributeRow({ row }: { row: SpecAttributeSummary }) {
  return (
    <tr className="border-b border-border last:border-0" data-testid="spec-attribute-row">
      <td className="py-3 pr-4 text-sm font-medium text-card-foreground">{row.labelVi}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{row.slug}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{row.groupName}</td>
      <td className="py-3 pr-4">
        <ValueTypeLabel valueType={row.valueType} />
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{row.sortOrder}</td>
      <td className="py-3 pr-4">
        <ActiveBadge isActive={row.isActive} />
      </td>
      <td className="py-3">
        <Link
          href={`/admin/catalog/spec-attributes/${row.id}`}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}

export default async function AdminSpecAttributesPage() {
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

  const result = await listSpecAttributeDefinitions();
  const rows = result.ok ? result.data : [];
  const hasError = !result.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
              Định nghĩa thông số sản phẩm
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Quản trị viên: tạo và chỉnh sửa thuộc tính dùng trên sản phẩm.
            </p>
          </div>
          <Link
            href="/admin/catalog/spec-attributes/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            data-testid="create-spec-attribute-link"
          >
            Tạo thuộc tính
          </Link>
        </div>

        {hasError && (
          <p className="mb-4 text-sm text-destructive" data-testid="spec-attributes-load-error">
            Lỗi tải danh sách. Vui lòng thử lại.
          </p>
        )}

        {!hasError && rows.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground" data-testid="empty-state">
            Chưa có thuộc tính nào.
          </p>
        )}

        {rows.length > 0 && (
          <div className="rounded-lg border bg-card shadow-xs">
            <table
              className="w-full"
              data-testid="spec-attributes-table"
              aria-label="Danh sách định nghĩa thông số"
            >
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Nhãn
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Slug
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Nhóm
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Kiểu
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Thứ tự
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
                {rows.map((row) => (
                  <SpecAttributeRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
