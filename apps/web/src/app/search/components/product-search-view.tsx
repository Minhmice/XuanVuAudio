import type { HomeProduct } from "@xuanvu/shared/storefront/homepage";
import { EmptyState } from "@/components/wrapper/empty-state";
import { PageShell } from "@/components/wrapper/page-shell";
import { StorefrontProductCard } from "@/components/storefront/StorefrontProductCard";

export function ProductSearchView({
  products,
  normalizedQuery,
}: {
  products: HomeProduct[];
  normalizedQuery: string;
}) {
  const showHint = normalizedQuery === "";

  return (
    <PageShell>
      <h1 className="text-2xl font-semibold tracking-tight">Tìm kiếm sản phẩm</h1>

      {showHint ? (
        <EmptyState className="mt-6" data-testid="search-hint">
          Nhập từ khóa vào ô tìm kiếm phía trên rồi nhấn Tìm để xem sản phẩm.
        </EmptyState>
      ) : products.length === 0 ? (
        <EmptyState className="mt-6" data-testid="search-empty">
          Không tìm thấy sản phẩm phù hợp. Thử từ khóa ngắn hơn hoặc khác.
        </EmptyState>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" data-testid="search-grid">
          {products.map((p) => (
            <li key={p.id}>
              <StorefrontProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
