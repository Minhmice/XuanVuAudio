import Link from "next/link";
import { requireAdminRole } from "@/app/lib/auth/role";
import { CreateUserForm } from "./CreateUserForm";

export default async function NewUserPage() {
  const guard = await requireAdminRole();

  if (!guard.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <section className="w-full max-w-xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
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

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <section className="w-full max-w-xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            Tạo người dùng mới
          </h1>
          <Link
            href="/admin/users"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Hủy
          </Link>
        </div>
        <CreateUserForm />
      </section>
    </main>
  );
}
