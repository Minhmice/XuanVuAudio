import Link from "next/link";

import { requireAdminRole } from "@/app/lib/auth/role";
import { listBrands, listCategories } from "@/app/actions/catalog";
import { getProductById } from "@/app/actions/products";
import { ProductDetailForm } from "./ProductDetailForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({ params }: PageProps) {
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

  const { id } = await params;

  const [productResult, brandsResult, categoriesResult] = await Promise.all([
    getProductById(id),
    listBrands(),
    listCategories(),
  ]);

  if (!productResult.ok) {
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
          <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
            <p className="text-sm text-destructive" data-testid="not-found-message">
              {productResult.error.message}
            </p>
          </div>
        </section>
      </main>
    );
  }

  const brands = brandsResult.ok ? brandsResult.data.map((b) => ({ id: b.id, name: b.name })) : [];
  const categories = categoriesResult.ok
    ? categoriesResult.data.map((c) => ({ id: c.id, name: c.name }))
    : [];

  const product = productResult.data;
  const hasLookupError = !brandsResult.ok || !categoriesResult.ok;

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/products"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>

        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-card-foreground">
          Chi tiết sản phẩm
        </h1>

        {hasLookupError && (
          <p className="mb-4 text-sm text-destructive">
            Lỗi tải dữ liệu thương hiệu/danh mục. Vui lòng thử lại.
          </p>
        )}

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <ProductDetailForm
            id={product.id}
            name={product.name}
            slug={product.slug}
            brandId={product.brandId}
            categoryId={product.categoryId}
            description={product.description}
            status={product.status}
            imageUrls={product.imageUrls}
            isPublished={product.isPublished}
            brands={brands}
            categories={categories}
          />
        </div>
      </section>
    </main>
  );
}

