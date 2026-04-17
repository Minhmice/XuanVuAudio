import Link from "next/link";

import { requireAdminRole } from "@/app/lib/auth/role";
import { CreateBrandForm } from "./CreateBrandForm";

export default async function AdminNewBrandPage() {
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

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tạo thương hiệu</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tạo thương hiệu mới (mặc định ở trạng thái ẩn).
            </p>
          </div>
          <Link
            href="/admin/brands"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Quay lại
          </Link>
        </div>

        <CreateBrandForm />
      </section>
    </main>
  );
}

