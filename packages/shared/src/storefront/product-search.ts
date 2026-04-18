import "server-only";

import {
  availabilityLabelsOrNull,
  fetchStorefrontStockTotals,
} from "./availability";
import type { HomeProduct } from "./homepage";
import { createSupabaseServerClient } from "../supabase/server";
import { escapeIlikePattern } from "./search-utils";

/** Hard cap on search results per query (Phase 14). */
export const PRODUCT_SEARCH_RESULT_LIMIT = 48;

type ProductSearchRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_urls: string[] | null;
  price_selling_vnd: number | null;
  price_compare_at_vnd: number | null;
  merch_is_featured: boolean | null;
  updated_at: string;
  catalog_brands: { name: string; slug: string } | null;
};

function firstImageUrl(imageUrls: string[] | null): string | null {
  return Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : null;
}

function mapProduct(row: ProductSearchRow): HomeProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: firstImageUrl(row.image_urls),
    priceSellingVnd: row.price_selling_vnd,
    priceCompareAtVnd: row.price_compare_at_vnd,
    brandName: row.catalog_brands?.name ?? null,
  };
}

function sortSearchResults(rows: ProductSearchRow[]): ProductSearchRow[] {
  const out = rows.slice();
  out.sort((a, b) => {
    const fa = a.merch_is_featured === true ? 1 : 0;
    const fb = b.merch_is_featured === true ? 1 : 0;
    if (fb !== fa) return fb - fa;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
  return out;
}

export type PublishedProductSearchResult = {
  products: HomeProduct[];
  /** Normalized query used for matching (empty if no search was run). */
  normalizedQuery: string;
};

/**
 * Global keyword search over published products (ILIKE on name, slug, description; brand name via second query).
 */
export async function loadPublishedProductSearch(
  rawQuery: string | undefined,
): Promise<PublishedProductSearchResult> {
  const q = typeof rawQuery === "string" ? rawQuery : "";
  const normalizedQuery = escapeIlikePattern(q);
  if (normalizedQuery === "") {
    return { products: [], normalizedQuery: "" };
  }

  const pattern = `%${normalizedQuery}%`;
  const supabase = await createSupabaseServerClient();

  const select =
    "id, name, slug, image_urls, price_selling_vnd, price_compare_at_vnd, merch_is_featured, updated_at, brand_id, description, catalog_brands(name, slug)";

  const { data: byColumns, error: errCol } = await supabase
    .from("catalog_products")
    .select(select)
    .eq("is_published", true)
    .or(`name.ilike.${pattern},slug.ilike.${pattern},description.ilike.${pattern}`)
    .limit(PRODUCT_SEARCH_RESULT_LIMIT);

  if (errCol) {
    console.error("product search column match", errCol);
  }

  const { data: brandMatches, error: errBrand } = await supabase
    .from("catalog_brands")
    .select("id")
    .eq("is_published", true)
    .ilike("name", pattern);

  if (errBrand) {
    console.error("product search brand match", errBrand);
  }

  const brandIds = (brandMatches ?? []).map((b: { id: string }) => b.id);
  let byBrand: ProductSearchRow[] = [];
  if (brandIds.length > 0) {
    const { data: brandProducts, error: errBp } = await supabase
      .from("catalog_products")
      .select(select)
      .eq("is_published", true)
      .in("brand_id", brandIds)
      .limit(PRODUCT_SEARCH_RESULT_LIMIT);

    if (errBp) {
      console.error("product search by brand", errBp);
    } else {
      byBrand = (brandProducts ?? []) as unknown as ProductSearchRow[];
    }
  }

  const merged = new Map<string, ProductSearchRow>();
  for (const r of [...((byColumns ?? []) as unknown as ProductSearchRow[]), ...byBrand]) {
    merged.set(r.id, r);
  }

  const sorted = sortSearchResults([...merged.values()]);
  const sliced = sorted.slice(0, PRODUCT_SEARCH_RESULT_LIMIT);

  const searchIds = sliced.map((r) => r.id);
  const stockFetch = await fetchStorefrontStockTotals(supabase, searchIds);
  const labelMap = availabilityLabelsOrNull(stockFetch, searchIds);
  const products: HomeProduct[] = sliced.map((row) => {
    const base = mapProduct(row);
    if (!labelMap) return base;
    return { ...base, availabilityLabelVi: labelMap.get(row.id)! };
  });

  return {
    products,
    normalizedQuery,
  };
}
