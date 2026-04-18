import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type AvailabilityKind = "in_stock" | "out_of_stock";

export const AVAILABILITY_LABEL_VI: Record<AvailabilityKind, string> = {
  in_stock: "Còn hàng",
  out_of_stock: "Hết hàng",
};

export function totalOnHandToAvailabilityKind(total: bigint | number): AvailabilityKind {
  if (typeof total === "number") {
    return total > 0 ? "in_stock" : "out_of_stock";
  }
  return total > 0n ? "in_stock" : "out_of_stock";
}

export type StockTotalRow = {
  product_id: string;
  total_on_hand: number | string;
};

/**
 * One Vietnamese label per product id. Missing RPC row counts as total 0 → Hết hàng.
 */
export function buildProductAvailabilityLabelMap(
  rows: StockTotalRow[],
  allProductIds: string[],
): Map<string, string> {
  const byId = new Map<string, number>();
  for (const r of rows) {
    const raw = r.total_on_hand;
    const n =
      typeof raw === "number"
        ? Math.trunc(raw)
        : typeof raw === "bigint"
          ? Number(raw)
          : Number.parseInt(String(raw), 10);
    byId.set(r.product_id, Number.isFinite(n) ? n : 0);
  }
  const out = new Map<string, string>();
  for (const id of allProductIds) {
    const t = byId.get(id) ?? 0;
    const kind = totalOnHandToAvailabilityKind(t);
    out.set(id, AVAILABILITY_LABEL_VI[kind]);
  }
  return out;
}

export type StorefrontStockFetchResult =
  | { ok: true; rows: StockTotalRow[] }
  | { ok: false };

/**
 * Loads summed on-hand per product for storefront (anon-safe RPC).
 * On RPC failure returns `{ ok: false }` — callers should omit availability badges.
 */
export async function fetchStorefrontStockTotals(
  supabase: SupabaseClient,
  productIds: string[],
): Promise<StorefrontStockFetchResult> {
  if (productIds.length === 0) {
    return { ok: true, rows: [] };
  }

  const { data, error } = await supabase.rpc("storefront_product_stock_totals", {
    p_product_ids: productIds,
  });

  if (error) {
    console.error("storefront_product_stock_totals", error);
    return { ok: false };
  }

  const raw = (data ?? []) as { product_id: string; total_on_hand: number | string }[];
  return {
    ok: true,
    rows: raw.map((r) => ({
      product_id: r.product_id,
      total_on_hand: r.total_on_hand,
    })),
  };
}

/**
 * Builds label map, or `null` if stock fetch failed (do not show badges).
 */
export function availabilityLabelsOrNull(
  fetchResult: StorefrontStockFetchResult,
  allProductIds: string[],
): Map<string, string> | null {
  if (!fetchResult.ok) return null;
  return buildProductAvailabilityLabelMap(fetchResult.rows, allProductIds);
}
