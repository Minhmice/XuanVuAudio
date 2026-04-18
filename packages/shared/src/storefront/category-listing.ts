import "server-only";

import {
  availabilityLabelsOrNull,
  fetchStorefrontStockTotals,
} from "./availability";
import {
  parseCategoryListingSort,
  sortFilteredCategoryRows,
  type CategoryListingSort,
  type CategoryListingSortableRow,
} from "./category-listing-sort";
import type { HomeProduct } from "./homepage";
import { createSupabaseServerClient } from "../supabase/server";

export type { CategoryListingSort } from "./category-listing-sort";

const FACET_GROUPS = {
  connection: "Kết nối",
  physical: "Vật lý",
  features: "Tính năng",
} as const;

export type CategoryListingFilters = {
  brandSlugs: string[];
  minPrice: number | null;
  maxPrice: number | null;
  /** attribute slug -> serialized value (matches specValueToKey) */
  spec: Record<string, string>;
};

export type BrandFacetOption = {
  slug: string;
  name: string;
  count: number;
};

export type SpecFacetOption = {
  valueKey: string;
  label: string;
  count: number;
};

export type SpecFacetGroup = {
  attributeSlug: string;
  labelVi: string;
  valueType: "text" | "number" | "boolean";
  groupName: string;
  options: SpecFacetOption[];
};

export type CategoryListingData = {
  category: { id: string; name: string; slug: string };
  products: HomeProduct[];
  brandFacets: BrandFacetOption[];
  priceExtent: { min: number | null; max: number | null };
  connectionFacets: SpecFacetGroup[];
  physicalFacets: SpecFacetGroup[];
  featureFacets: SpecFacetGroup[];
  filters: CategoryListingFilters;
  sort: CategoryListingSort;
};

export type CategoryListingResult =
  | { ok: true; data: CategoryListingData }
  | { ok: false; error: "not_found" };

type ProductRow = CategoryListingSortableRow;

type SpecValueRow = {
  product_id: string;
  attribute_id: string;
  value_text: string | null;
  value_number: number | null;
  value_boolean: boolean | null;
  catalog_spec_attributes: {
    slug: string;
    value_type: string;
    group_name: string;
    label_vi: string;
  } | null;
};

type AttrRow = {
  id: string;
  slug: string;
  label_vi: string;
  group_name: string;
  value_type: string;
};

export function parseCategoryListingFilters(
  searchParams: Record<string, string | string[] | undefined>,
): CategoryListingFilters {
  const brandRaw = searchParams.brand;
  const brandSlugs = (
    brandRaw == null ? [] : Array.isArray(brandRaw) ? brandRaw : [brandRaw]
  )
    .map((s) => s.trim())
    .filter(Boolean);

  const minP = searchParams.minPrice;
  const maxP = searchParams.maxPrice;
  const minPrice =
    typeof minP === "string" && minP.trim() !== "" ? Number.parseInt(minP, 10) : null;
  const maxPrice =
    typeof maxP === "string" && maxP.trim() !== "" ? Number.parseInt(maxP, 10) : null;

  const spec: Record<string, string> = {};
  for (const [key, val] of Object.entries(searchParams)) {
    if (!key.startsWith("spec_")) continue;
    const attrSlug = key.slice("spec_".length);
    if (!attrSlug) continue;
    const v = Array.isArray(val) ? val[0] : val;
    if (v != null && String(v).trim() !== "") {
      spec[attrSlug] = String(v).trim();
    }
  }

  return {
    brandSlugs,
    minPrice: Number.isFinite(minPrice as number) ? minPrice : null,
    maxPrice: Number.isFinite(maxPrice as number) ? maxPrice : null,
    spec,
  };
}

function firstImageUrl(imageUrls: string[] | null): string | null {
  const urls = imageUrls;
  return Array.isArray(urls) && urls.length > 0 ? urls[0] : null;
}

function mapProduct(row: ProductRow): HomeProduct {
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

function specValueKey(row: SpecValueRow): string {
  const t = row.catalog_spec_attributes?.value_type;
  if (t === "boolean") {
    return row.value_boolean === true ? "true" : "false";
  }
  if (t === "number") {
    return row.value_number != null ? String(row.value_number) : "";
  }
  return (row.value_text ?? "").trim();
}

function labelForOption(valueKey: string, valueType: string, labelVi: string): string {
  if (valueType === "boolean") {
    return valueKey === "true" ? `${labelVi}: Có` : `${labelVi}: Không`;
  }
  return valueKey === "" ? `(Trống — ${labelVi})` : valueKey;
}

function productMatchesSpecFilters(
  productId: string,
  filters: CategoryListingFilters,
  specByProduct: Map<string, Map<string, string>>,
): boolean {
  for (const [attrSlug, wanted] of Object.entries(filters.spec)) {
    const got = specByProduct.get(productId)?.get(attrSlug);
    if (got === undefined) return false;
    if (got !== wanted) return false;
  }
  return true;
}

function buildSpecFacetGroups(
  attrs: AttrRow[],
  specValues: SpecValueRow[],
  productIdsInCategory: Set<string>,
  groupName: string,
): SpecFacetGroup[] {
  const attrsInGroup = attrs.filter((a) => a.group_name === groupName);
  const result: SpecFacetGroup[] = [];

  for (const attr of attrsInGroup) {
    const counts = new Map<string, number>();
    for (const row of specValues) {
      if (row.catalog_spec_attributes?.slug !== attr.slug) continue;
      if (!productIdsInCategory.has(row.product_id)) continue;
      const key = specValueKey(row);
      if (key === "" && attr.value_type !== "boolean") continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const options: SpecFacetOption[] = [];
    for (const [valueKey, count] of counts) {
      options.push({
        valueKey,
        label: labelForOption(valueKey, attr.value_type, attr.label_vi),
        count,
      });
    }
    options.sort((a, b) => a.label.localeCompare(b.label, "vi"));

    if (options.length > 0) {
      result.push({
        attributeSlug: attr.slug,
        labelVi: attr.label_vi,
        valueType: attr.value_type as "text" | "number" | "boolean",
        groupName,
        options,
      });
    }
  }

  result.sort((a, b) => a.labelVi.localeCompare(b.labelVi, "vi"));
  return result;
}

export async function loadCategoryListing(
  categorySlug: string,
  searchParams: Record<string, string | string[] | undefined>,
): Promise<CategoryListingResult> {
  const filters = parseCategoryListingFilters(searchParams);
  const sort = parseCategoryListingSort(searchParams);
  const supabase = await createSupabaseServerClient();

  const { data: cat, error: catErr } = await supabase
    .from("catalog_categories")
    .select("id, name, slug")
    .eq("slug", categorySlug.trim())
    .eq("is_published", true)
    .maybeSingle<{ id: string; name: string; slug: string }>();

  if (catErr || !cat) {
    return { ok: false, error: "not_found" };
  }

  const { data: productRows, error: prodErr } = await supabase
    .from("catalog_products")
    .select(
      "id, name, slug, description, image_urls, price_selling_vnd, price_compare_at_vnd, merch_is_featured, first_published_at, updated_at, category_id, catalog_brands(name, slug)",
    )
    .eq("category_id", cat.id)
    .eq("is_published", true);

  if (prodErr || !productRows) {
    return {
      ok: true,
      data: {
        category: cat,
        products: [],
        brandFacets: [],
        priceExtent: { min: null, max: null },
        connectionFacets: [],
        physicalFacets: [],
        featureFacets: [],
        filters,
        sort,
      },
    };
  }

  const rows = productRows as unknown as ProductRow[];

  const productIds = rows.map((r) => r.id);
  const productIdSet = new Set(productIds);

  const prices = rows
    .map((r) => r.price_selling_vnd)
    .filter((n): n is number => n != null && Number.isFinite(n));
  const priceExtent = {
    min: prices.length ? Math.min(...prices) : null,
    max: prices.length ? Math.max(...prices) : null,
  };

  const brandCounts = new Map<string, { name: string; count: number }>();
  for (const r of rows) {
    const slug = r.catalog_brands?.slug;
    const name = r.catalog_brands?.name;
    if (!slug || !name) continue;
    const prev = brandCounts.get(slug);
    if (prev) prev.count += 1;
    else brandCounts.set(slug, { name, count: 1 });
  }
  const brandFacets: BrandFacetOption[] = [...brandCounts.entries()]
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));

  const { data: attrRows } = await supabase
    .from("catalog_spec_attributes")
    .select("id, slug, label_vi, group_name, value_type")
    .eq("is_active", true)
    .in("group_name", [FACET_GROUPS.connection, FACET_GROUPS.physical, FACET_GROUPS.features]);

  const attrs = (attrRows ?? []) as AttrRow[];

  let specValues: SpecValueRow[] = [];
  if (productIds.length > 0) {
    const { data: sv } = await supabase
      .from("catalog_product_spec_values")
      .select(
        "product_id, attribute_id, value_text, value_number, value_boolean, catalog_spec_attributes(slug, value_type, group_name, label_vi)",
      )
      .in("product_id", productIds);
    specValues = (sv ?? []) as unknown as SpecValueRow[];
  }

  const connectionFacets = buildSpecFacetGroups(attrs, specValues, productIdSet, FACET_GROUPS.connection);
  const physicalFacets = buildSpecFacetGroups(attrs, specValues, productIdSet, FACET_GROUPS.physical);
  const featureFacets = buildSpecFacetGroups(attrs, specValues, productIdSet, FACET_GROUPS.features);

  const specByProduct = new Map<string, Map<string, string>>();
  for (const row of specValues) {
    const slug = row.catalog_spec_attributes?.slug;
    if (!slug) continue;
    const key = specValueKey(row);
    if (!specByProduct.has(row.product_id)) {
      specByProduct.set(row.product_id, new Map());
    }
    specByProduct.get(row.product_id)!.set(slug, key);
  }

  let filtered = rows.slice();

  if (filters.brandSlugs.length > 0) {
    const set = new Set(filters.brandSlugs);
    filtered = filtered.filter((r) => r.catalog_brands?.slug && set.has(r.catalog_brands.slug));
  }

  if (filters.minPrice != null || filters.maxPrice != null) {
    filtered = filtered.filter((r) => {
      const p = r.price_selling_vnd;
      if (p == null) return false;
      if (filters.minPrice != null && p < filters.minPrice) return false;
      if (filters.maxPrice != null && p > filters.maxPrice) return false;
      return true;
    });
  }

  filtered = filtered.filter((r) => productMatchesSpecFilters(r.id, filters, specByProduct));

  const sorted = sortFilteredCategoryRows(filtered, sort);
  const listingIds = sorted.map((r) => r.id);
  const stockFetch = await fetchStorefrontStockTotals(supabase, listingIds);
  const labelMap = availabilityLabelsOrNull(stockFetch, listingIds);
  const products: HomeProduct[] = sorted.map((row) => {
    const base = mapProduct(row);
    if (!labelMap) return base;
    return { ...base, availabilityLabelVi: labelMap.get(row.id)! };
  });

  return {
    ok: true,
    data: {
      category: cat,
      products,
      brandFacets,
      priceExtent,
      connectionFacets,
      physicalFacets,
      featureFacets,
      filters,
      sort,
    },
  };
}
