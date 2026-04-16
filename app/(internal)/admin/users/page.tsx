import Link from "next/link";

import { requireAdminRole } from "@/app/lib/auth/role";
import { listInternalUsers } from "@/app/actions/admin";
import type { InternalUserSummary } from "@/app/actions/admin";

const ROLE_LABELS: Record<string, string> = {
  admin: "Quản trị viên",
  staff: "Nhân viên",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      data-testid="role-badge"
      className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
    >
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

function StatusBadge({ isDeactivated }: { isDeactivated: boolean }) {
  if (isDeactivated) {
    return (
      <span
        data-testid="status-badge-deactivated"
        className="inline-flex items-center rounded-md bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive"
      >
        Vô hiệu hóa
      </span>
    );
  }
  return (
    <span
      data-testid="status-badge-active"
      className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
    >
      Hoạt động
    </span>
  );
}

function UserRow({ user }: { user: InternalUserSummary }) {
  return (
    <tr className="border-b border-border last:border-0" data-testid="user-row">
      <td className="py-3 pr-4 text-sm font-medium text-card-foreground">
        {user.username}
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{user.email}</td>
      <td className="py-3 pr-4">
        <RoleBadge role={user.role} />
      </td>
      <td className="py-3 pr-4">
        <StatusBadge isDeactivated={user.isDeactivated} />
      </td>
      <td className="py-3">
        <Link
          href={`/admin/users/${user.userId}`}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}

export default async function AdminUsersPage() {
  const guard = await requireAdminRole();

  if (!guard.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <section className="w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <p
            className="text-sm text-destructive"
            data-testid="forbidden-message"
          >
            Không có quyền truy cập.
          </p>
        </section>
      </main>
    );
  }

  const result = await listInternalUsers();

  const users = result.ok ? result.data : [];
  const hasError = !result.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Quản lý người dùng
          </h1>
          <Link
            href="/admin/users/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            data-testid="create-user-link"
          >
            Tạo người dùng mới
          </Link>
        </div>

        {hasError && (
          <p className="mb-4 text-sm text-destructive">
            Lỗi tải danh sách người dùng. Vui lòng thử lại.
          </p>
        )}

        {!hasError && users.length === 0 && (
          <p
            className="py-8 text-center text-sm text-muted-foreground"
            data-testid="empty-state"
          >
            Chưa có người dùng nào.
          </p>
        )}

        {users.length > 0 && (
          <div className="rounded-lg border bg-card shadow-sm">
            <table
              className="w-full"
              data-testid="users-table"
              aria-label="Danh sách người dùng nội bộ"
            >
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tên đăng nhập
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Vai trò
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
                {users.map((user) => (
                  <UserRow key={user.userId} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
