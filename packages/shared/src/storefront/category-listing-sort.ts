/**
 * Pure sort + query parsing for category listing (testable without Supabase).
 */

export type CategoryListingSort = "featured" | "newest" | "price-asc" | "price-desc";

/** Row fields required for sorting (subset of catalog product + brand join). */
export type CategoryListingSortableRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_urls: string[] | null;
  price_selling_vnd: number | null;
  price_compare_at_vnd: number | null;
  merch_is_featured: boolean | null;
  first_published_at: string | null;
  updated_at: string;
  catalog_brands: { name: string; slug: string } | null;
};

const SORT_VALUES: readonly CategoryListingSort[] = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
];

export function parseCategoryListingSort(
  searchParams: Record<string, string | string[] | undefined>,
): CategoryListingSort {
  const raw = searchParams.sort;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (typeof v !== "string" || v.trim() === "") return "featured";
  const key = v.trim() as CategoryListingSort;
  return SORT_VALUES.includes(key) ? key : "featured";
}

function sortFeatured(a: CategoryListingSortableRow, b: CategoryListingSortableRow): number {
  const fa = a.merch_is_featured === true ? 1 : 0;
  const fb = b.merch_is_featured === true ? 1 : 0;
  if (fb !== fa) return fb - fa;
  return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
}

function comparePriceWithNullsLast(a: number | null, b: number | null, ascending: boolean): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return ascending ? a - b : b - a;
}

export function sortFilteredCategoryRows(
  rows: CategoryListingSortableRow[],
  sort: CategoryListingSort,
): CategoryListingSortableRow[] {
  const out = rows.slice();
  switch (sort) {
    case "featured":
      out.sort(sortFeatured);
      break;
    case "newest":
      out.sort((a, b) => {
        const ta = a.first_published_at ? new Date(a.first_published_at).getTime() : null;
        const tb = b.first_published_at ? new Date(b.first_published_at).getTime() : null;
        if (ta !== tb) {
          if (ta == null) return 1;
          if (tb == null) return -1;
          return tb - ta;
        }
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
      break;
    case "price-asc":
      out.sort((a, b) => comparePriceWithNullsLast(a.price_selling_vnd, b.price_selling_vnd, true));
      break;
    case "price-desc":
      out.sort((a, b) => comparePriceWithNullsLast(a.price_selling_vnd, b.price_selling_vnd, false));
      break;
  }
  return out;
}
