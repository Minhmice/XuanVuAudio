import Link from "next/link";

import { requireStaffRole } from "@/app/lib/auth/role";
import { CreateShowroomForm } from "./CreateShowroomForm";

export default async function NewShowroomPage() {
  const guard = await requireStaffRole();

  if (!guard.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <section className="w-full max-w-xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <p className="text-sm text-destructive" data-testid="forbidden-message">
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
          <h1 className="text-xl font-semibold tracking-tight">Tạo showroom mới</h1>
          <Link
            href="/admin/showrooms"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Hủy
          </Link>
        </div>
        <CreateShowroomForm />
      </section>
    </main>
  );
}

