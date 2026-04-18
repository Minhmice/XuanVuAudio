import Link from "next/link";

import { requireAdminRole } from "@xuanvu/shared/auth/role";
import { listBrands, listCategories } from "@/app/actions/catalog";
import { CreateProductForm } from "./CreateProductForm";

export default async function AdminCreateProductPage() {
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

  const [brandsResult, categoriesResult] = await Promise.all([listBrands(), listCategories()]);
  const brands = brandsResult.ok ? brandsResult.data.map((b) => ({ id: b.id, name: b.name })) : [];
  const categories = categoriesResult.ok
    ? categoriesResult.data.map((c) => ({ id: c.id, name: c.name }))
    : [];

  const hasError = !brandsResult.ok || !categoriesResult.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>

        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-card-foreground">
          Tạo sản phẩm mới
        </h1>

        {hasError && (
          <p className="mb-4 text-sm text-destructive">
            Lỗi tải dữ liệu thương hiệu/danh mục. Vui lòng thử lại.
          </p>
        )}

        {!hasError && brands.length === 0 && (
          <p className="mb-4 text-sm text-muted-foreground">
            Bạn cần tạo ít nhất 1 thương hiệu trước.
          </p>
        )}

        {!hasError && categories.length === 0 && (
          <p className="mb-4 text-sm text-muted-foreground">
            Bạn cần tạo ít nhất 1 danh mục trước.
          </p>
        )}

        <div className="rounded-lg border bg-card p-6 shadow-xs">
          <CreateProductForm brands={brands} categories={categories} />
        </div>
      </section>
    </main>
  );
}

