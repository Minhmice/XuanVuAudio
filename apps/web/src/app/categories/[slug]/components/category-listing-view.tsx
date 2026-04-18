import { Suspense } from "react";

import type { CategoryListingData } from "@xuanvu/shared/storefront/category-listing";
import { EmptyState } from "@/components/wrapper/empty-state";
import { PageShell } from "@/components/wrapper/page-shell";
import { StorefrontProductCard } from "@/components/storefront/StorefrontProductCard";

import { ListingFiltersPanel } from "./listing-filters-panel";
import { ListingPageHeader } from "./listing-page-header";
import { ListingSortSelect } from "./listing-sort-select";

export function CategoryListingView({ data }: { data: CategoryListingData }) {
  return (
    <PageShell>
      <div className="space-y-8">
        <ListingPageHeader title={data.category.name} />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <Suspense fallback={<p className="text-sm text-muted-foreground lg:w-72">Đang tải bộ lọc…</p>}>
            <ListingFiltersPanel
              categorySlug={data.category.slug}
              brandFacets={data.brandFacets}
              priceExtent={data.priceExtent}
              connectionFacets={data.connectionFacets}
              physicalFacets={data.physicalFacets}
              featureFacets={data.featureFacets}
            />
          </Suspense>

          <div className="min-w-0 flex-1 space-y-4">
            <Suspense fallback={<p className="text-sm text-muted-foreground">Đang tải…</p>}>
              <ListingSortSelect categorySlug={data.category.slug} sort={data.sort} />
            </Suspense>
            {data.products.length === 0 ? (
              <EmptyState data-testid="listing-empty">Không có sản phẩm phù hợp. Thử bỏ bớt bộ lọc.</EmptyState>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" data-testid="listing-grid">
                {data.products.map((p) => (
                  <li key={p.id}>
                    <StorefrontProductCard product={p} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
