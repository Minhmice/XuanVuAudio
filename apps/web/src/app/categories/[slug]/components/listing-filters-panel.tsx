"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import type { CategoryListingData } from "@xuanvu/shared/storefront/category-listing";
import { AppButton } from "@/components/wrapper/button";
import { AppInput } from "@/components/wrapper/input";
import { FacetOptionButton } from "./facet-option-button";

export function ListingFiltersPanel({
  categorySlug,
  brandFacets,
  priceExtent,
  connectionFacets,
  physicalFacets,
  featureFacets,
}: {
  categorySlug: string;
  brandFacets: CategoryListingData["brandFacets"];
  priceExtent: CategoryListingData["priceExtent"];
  connectionFacets: CategoryListingData["connectionFacets"];
  physicalFacets: CategoryListingData["physicalFacets"];
  featureFacets: CategoryListingData["featureFacets"];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const basePath = `/categories/${categorySlug}`;

  const [minInput, setMinInput] = useState(() => searchParams.get("minPrice") ?? "");
  const [maxInput, setMaxInput] = useState(() => searchParams.get("maxPrice") ?? "");

  useEffect(() => {
    setMinInput(searchParams.get("minPrice") ?? "");
    setMaxInput(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  const pushParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      mutate(p);
      const q = p.toString();
      router.push(q ? `${basePath}?${q}` : basePath);
    },
    [basePath, router, searchParams],
  );

  const toggleBrand = (slug: string) => {
    pushParams((p) => {
      const all = p.getAll("brand");
      p.delete("brand");
      const next = all.includes(slug) ? all.filter((s) => s !== slug) : [...all, slug];
      next.forEach((s) => p.append("brand", s));
    });
  };

  const toggleSpec = (attrSlug: string, valueKey: string) => {
    const key = `spec_${attrSlug}`;
    pushParams((p) => {
      if (p.get(key) === valueKey) p.delete(key);
      else p.set(key, valueKey);
    });
  };

  const applyPrice = () => {
    pushParams((p) => {
      const minV = minInput.trim();
      const maxV = maxInput.trim();
      if (minV === "") p.delete("minPrice");
      else p.set("minPrice", minV);
      if (maxV === "") p.delete("maxPrice");
      else p.set("maxPrice", maxV);
    });
  };

  const selectedBrands = new Set(searchParams.getAll("brand"));

  const renderSpecGroup = (title: string, groups: CategoryListingData["connectionFacets"]) => {
    if (groups.length === 0) return null;
    return (
      <div className="space-y-3" data-testid={`facet-${title}`}>
        <h3 className="text-sm font-semibold">{title}</h3>
        {groups.map((g) => (
          <div key={g.attributeSlug} className="space-y-2">
            <p className="text-xs text-muted-foreground">{g.labelVi}</p>
            <ul className="space-y-1">
              {g.options.map((o) => {
                const key = `spec_${g.attributeSlug}`;
                const active = searchParams.get(key) === o.valueKey;
                return (
                  <li key={`${g.attributeSlug}-${o.valueKey}`}>
                    <FacetOptionButton
                      active={active}
                      label={o.label}
                      count={o.count}
                      onClick={() => toggleSpec(g.attributeSlug, o.valueKey)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <aside className="w-full shrink-0 space-y-8 lg:w-72" data-testid="category-filters">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Bộ lọc</h2>
        <button type="button" onClick={() => router.push(basePath)} className="text-xs text-primary underline-offset-4 hover:underline">
          Xóa bộ lọc
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Thương hiệu</h3>
        {brandFacets.length === 0 ? (
          <p className="text-xs text-muted-foreground">Không có dữ liệu.</p>
        ) : (
          <ul className="space-y-1">
            {brandFacets.map((b) => (
              <li key={b.slug}>
                <FacetOptionButton
                  active={selectedBrands.has(b.slug)}
                  label={b.name}
                  count={b.count}
                  onClick={() => toggleBrand(b.slug)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Giá (VND)</h3>
        {priceExtent.min != null && priceExtent.max != null ? (
          <p className="text-xs text-muted-foreground">
            Trong danh mục: {priceExtent.min.toLocaleString("vi-VN")} – {priceExtent.max.toLocaleString("vi-VN")}
          </p>
        ) : null}
        <div className="flex gap-2">
          <AppInput type="number" name="minPrice" placeholder="Từ" value={minInput} onChange={(e) => setMinInput(e.target.value)} min={0} className="h-9" />
          <AppInput type="number" name="maxPrice" placeholder="Đến" value={maxInput} onChange={(e) => setMaxInput(e.target.value)} min={0} className="h-9" />
        </div>
        <AppButton type="button" onClick={applyPrice} className="w-full normal-case tracking-normal font-medium">
          Áp dụng giá
        </AppButton>
      </div>

      {renderSpecGroup("Kết nối", connectionFacets)}
      {renderSpecGroup("Vật lý & form", physicalFacets)}
      {renderSpecGroup("Tính năng", featureFacets)}
    </aside>
  );
}
