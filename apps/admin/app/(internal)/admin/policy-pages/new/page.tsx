import Link from "next/link";

import { requireAdminRole } from "@xuanvu/shared/auth/role";
import { CreatePolicyPageForm } from "./CreatePolicyPageForm";

export default async function NewPolicyPagePage() {
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

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
              Tạo trang chính sách
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Quản lý nội dung policy pages để hiển thị trên storefront.
            </p>
          </div>
          <Link
            href="/admin/policy-pages"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Quay lại
          </Link>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-xs">
          <CreatePolicyPageForm />
        </div>
      </section>
    </main>
  );
}

