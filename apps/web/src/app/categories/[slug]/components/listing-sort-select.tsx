"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import type { CategoryListingData } from "@xuanvu/shared/storefront/category-listing";
import { AppSelect } from "@/components/wrapper/select";

const OPTIONS: { value: CategoryListingData["sort"]; label: string }[] = [
  { value: "featured", label: "Nổi bật" },
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

export function ListingSortSelect({ categorySlug, sort }: { categorySlug: string; sort: CategoryListingData["sort"] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const basePath = `/categories/${categorySlug}`;

  const pushParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      mutate(p);
      const q = p.toString();
      router.push(q ? `${basePath}?${q}` : basePath);
    },
    [basePath, router, searchParams],
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="listing-sort" className="text-sm text-muted-foreground">
        Sắp xếp
      </label>
      <div className="min-w-52" data-testid="listing-sort">
        <AppSelect
          value={sort}
          onValueChange={(value) => {
            const next = value as CategoryListingData["sort"];
            pushParams((p) => {
              if (next === "featured") p.delete("sort");
              else p.set("sort", next);
            });
          }}
          options={OPTIONS}
        />
      </div>
    </div>
  );
}
