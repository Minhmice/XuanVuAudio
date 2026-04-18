import Link from "next/link";

import { getSpecAttributeById } from "@/app/actions/spec-attribute-definitions";
import { requireAdminRole } from "@xuanvu/shared/auth/role";

import { SpecAttributeDetailForm } from "./SpecAttributeDetailForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SpecAttributeDetailPage({ params }: PageProps) {
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
  const result = await getSpecAttributeById(id);

  if (!result.ok) {
    return (
      <main className="min-h-screen p-8">
        <section className="mx-auto w-full max-w-3xl">
          <div className="mb-6">
            <Link
              href="/admin/catalog/spec-attributes"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              ← Quay lại danh sách
            </Link>
          </div>
          <p className="text-sm text-destructive" data-testid="not-found-message">
            {result.error.code === "NOT_FOUND" ? result.error.message : "Không tải được thuộc tính."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <Link
            href="/admin/catalog/spec-attributes"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            ← Quay lại danh sách
          </Link>
        </div>

        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-card-foreground">Chi tiết thuộc tính spec</h1>

        <div className="rounded-lg border bg-card p-6 shadow-xs">
          <SpecAttributeDetailForm attribute={result.data} />
        </div>
      </section>
    </main>
  );
}
