import { getCurrentUserRole } from "@/app/lib/auth/role";

const ROLE_LABELS: Record<string, string> = {
  admin: "Quản trị viên",
  staff: "Nhân viên",
};

export default async function DashboardPage() {
  const roleResult = await getCurrentUserRole();
  const roleLabel =
    "role" in roleResult ? (ROLE_LABELS[roleResult.role] ?? roleResult.role) : null;

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <section className="w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Bảng điều khiển nội bộ</h1>
          {roleLabel !== null && (
            <span
              data-testid="role-badge"
              className="inline-flex shrink-0 items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {roleLabel}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Bạn đã đăng nhập thành công. Đây là điểm vào mặc định cho hệ thống nội bộ.
        </p>
      </section>
    </main>
  );
}
