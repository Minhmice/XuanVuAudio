import "server-only";

import type { HomeProduct } from "./homepage";
import {
  availabilityLabelsOrNull,
  fetchStorefrontStockTotals,
} from "./availability";
import { createSupabaseServerClient } from "../supabase/server";

export type ProductDetailSpecRow = {
  groupName: string;
  label: string;
  valueDisplay: string;
};

export type ProductDetailPayload = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrls: string[];
  priceSellingVnd: number | null;
  priceCompareAtVnd: number | null;
  brandName: string | null;
  brandSlug: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  specs: ProductDetailSpecRow[];
  relatedProducts: HomeProduct[];
  /** Omitted when stock RPC fails (Phase 17 behavior). */
  availabilityLabelVi?: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_urls: string[] | null;
  price_selling_vnd: number | null;
  price_compare_at_vnd: number | null;
  category_id: string;
  brand_id: string;
  catalog_brands: { name: string; slug: string } | null;
  catalog_categories: { name: string; slug: string } | null;
};

type RelatedRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_urls: string[] | null;
  price_selling_vnd: number | null;
  price_compare_at_vnd: number | null;
  brand_id: string;
  catalog_brands: { name: string; slug: string } | null;
};

function mapRelatedToHomeProduct(row: RelatedRow): HomeProduct {
  const urls = row.image_urls;
  const first = Array.isArray(urls) && urls.length > 0 ? urls[0] : null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: first,
    priceSellingVnd: row.price_selling_vnd,
    priceCompareAtVnd: row.price_compare_at_vnd,
    brandName: row.catalog_brands?.name ?? null,
  };
}

/**
 * Loads PDP payload for a published storefront product. Returns null → 404.
 */
export async function fetchProductDetailBySlug(slug: string): Promise<ProductDetailPayload | null> {
  const supabase = await createSupabaseServerClient();

  const { data: prod, error } = await supabase
    .from("catalog_products")
    .select(
      "id, name, slug, description, image_urls, price_selling_vnd, price_compare_at_vnd, category_id, brand_id, catalog_brands(name, slug), catalog_categories(name, slug)",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("status", "active")
    .maybeSingle();

  if (error || !prod) {
    return null;
  }

  const row = prod as unknown as ProductRow;
  const productId = row.id;
  const categoryId = row.category_id;
  const brandId = row.brand_id;

  const [specRpc, relatedRes] = await Promise.all([
    supabase.rpc("storefront_product_spec_rows", { p_product_id: productId }),
    supabase
      .from("catalog_products")
      .select(
        "id, name, slug, description, image_urls, price_selling_vnd, price_compare_at_vnd, brand_id, catalog_brands(name, slug)",
      )
      .eq("is_published", true)
      .eq("status", "active")
      .eq("category_id", categoryId)
      .neq("id", productId)
      .order("updated_at", { ascending: false })
      .limit(48),
  ]);

  let specs: ProductDetailSpecRow[] = [];
  if (!specRpc.error && specRpc.data) {
    const raw = specRpc.data as {
      group_name: string;
      label_vi: string;
      sort_order: number;
      value_display: string;
    }[];
    specs = raw.map((r) => ({
      groupName: r.group_name,
      label: r.label_vi,
      valueDisplay: r.value_display,
    }));
  }

  let relatedProducts: HomeProduct[] = [];
  if (!relatedRes.error && relatedRes.data) {
    const rows = relatedRes.data as unknown as RelatedRow[];
    const sameBrand = rows.filter((r) => r.brand_id === brandId);
    const otherBrand = rows.filter((r) => r.brand_id !== brandId);
    const ordered = [...sameBrand, ...otherBrand];
    const seen = new Set<string>();
    const picked: RelatedRow[] = [];
    for (const r of ordered) {
      if (picked.length >= 8) break;
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      picked.push(r);
    }
    relatedProducts = picked.map(mapRelatedToHomeProduct);
  }

  const relatedIds = relatedProducts.map((p) => p.id);
  const stockIds = [productId, ...relatedIds];
  const stockFetch = await fetchStorefrontStockTotals(supabase, stockIds);
  const labelMap = availabilityLabelsOrNull(stockFetch, stockIds);

  if (labelMap) {
    relatedProducts = relatedProducts.map((p) => ({
      ...p,
      availabilityLabelVi: labelMap.get(p.id) ?? p.availabilityLabelVi,
    }));
  }

  const availabilityLabelVi = labelMap?.get(productId);

  const imageUrls = Array.isArray(row.image_urls) ? row.image_urls : [];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrls,
    priceSellingVnd: row.price_selling_vnd,
    priceCompareAtVnd: row.price_compare_at_vnd,
    brandName: row.catalog_brands?.name ?? null,
    brandSlug: row.catalog_brands?.slug ?? null,
    categoryName: row.catalog_categories?.name ?? null,
    categorySlug: row.catalog_categories?.slug ?? null,
    specs,
    relatedProducts,
    ...(availabilityLabelVi !== undefined ? { availabilityLabelVi } : {}),
  };
}
