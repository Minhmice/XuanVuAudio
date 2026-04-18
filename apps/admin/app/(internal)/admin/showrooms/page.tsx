import Link from "next/link";

import { requireStaffRole } from "@xuanvu/shared/auth/role";
import { listShowrooms } from "@/app/actions/showrooms";
import type { ShowroomRecord } from "@/app/actions/showrooms";
import { deleteShowroomAction } from "./actions";

function ShowroomRow({ showroom }: { showroom: ShowroomRecord }) {
  return (
    <tr className="border-b border-border last:border-0" data-testid="showroom-row">
      <td className="py-3 pr-4 text-sm font-medium text-card-foreground">
        {showroom.name}
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{showroom.address}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{showroom.phone}</td>
      <td className="py-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/admin/showrooms/${showroom.id}`}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Chi tiết
          </Link>
          <form action={deleteShowroomAction}>
            <input type="hidden" name="id" value={showroom.id} />
            <button
              type="submit"
              className="text-sm text-destructive underline-offset-4 hover:underline"
              data-testid="delete-showroom-button"
            >
              Xóa
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}

export default async function AdminShowroomsPage() {
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

  const result = await listShowrooms();
  const showrooms = result.ok ? result.data : [];
  const hasError = !result.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Danh sách showroom
          </h1>
          <Link
            href="/admin/showrooms/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            data-testid="create-showroom-link"
          >
            Tạo showroom mới
          </Link>
        </div>

        {hasError && (
          <p className="mb-4 text-sm text-destructive">
            Lỗi tải danh sách showroom. Vui lòng thử lại.
          </p>
        )}

        {!hasError && showrooms.length === 0 && (
          <p
            className="py-8 text-center text-sm text-muted-foreground"
            data-testid="empty-state"
          >
            Chưa có showroom nào.
          </p>
        )}

        {showrooms.length > 0 && (
          <div className="rounded-lg border bg-card shadow-xs">
            <table
              className="w-full"
              data-testid="showrooms-table"
              aria-label="Danh sách showroom"
            >
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tên
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Địa chỉ
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Số điện thoại
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border px-4">
                {showrooms.map((showroom) => (
                  <ShowroomRow key={showroom.id} showroom={showroom} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

