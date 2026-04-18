import { describe, expect, it } from "vitest";

import {
  parseCategoryListingSort,
  sortFilteredCategoryRows,
  type CategoryListingSortableRow,
} from "@/app/lib/storefront/category-listing-sort";

type Row = CategoryListingSortableRow;

function row(p: Partial<Row> & Pick<Row, "id">): Row {
  return {
    name: "",
    slug: "",
    description: null,
    image_urls: null,
    price_selling_vnd: null,
    price_compare_at_vnd: null,
    merch_is_featured: null,
    first_published_at: null,
    updated_at: "2020-01-01T00:00:00.000Z",
    catalog_brands: null,
    ...p,
  };
}

describe("parseCategoryListingSort", () => {
  it("defaults to featured", () => {
    expect(parseCategoryListingSort({})).toBe("featured");
    expect(parseCategoryListingSort({ sort: "" })).toBe("featured");
    expect(parseCategoryListingSort({ sort: "nope" })).toBe("featured");
  });

  it("parses allowed values", () => {
    expect(parseCategoryListingSort({ sort: "newest" })).toBe("newest");
    expect(parseCategoryListingSort({ sort: "price-asc" })).toBe("price-asc");
    expect(parseCategoryListingSort({ sort: "price-desc" })).toBe("price-desc");
  });
});

describe("sortFilteredCategoryRows", () => {
  it("orders by featured then updated_at", () => {
    const a = row({
      id: "a",
      merch_is_featured: false,
      updated_at: "2020-01-01T00:00:00.000Z",
    });
    const b = row({
      id: "b",
      merch_is_featured: true,
      updated_at: "2019-01-01T00:00:00.000Z",
    });
    const out = sortFilteredCategoryRows([a, b], "featured");
    expect(out.map((r) => r.id)).toEqual(["b", "a"]);
  });

  it("puts null prices last for price-asc", () => {
    const a = row({ id: "a", price_selling_vnd: 100 });
    const b = row({ id: "b", price_selling_vnd: null });
    const out = sortFilteredCategoryRows([b, a], "price-asc");
    expect(out.map((r) => r.id)).toEqual(["a", "b"]);
  });

  it("orders newest by first_published_at", () => {
    const old = row({
      id: "old",
      first_published_at: "2019-01-01T00:00:00.000Z",
      updated_at: "2020-01-01T00:00:00.000Z",
    });
    const neu = row({
      id: "new",
      first_published_at: "2021-01-01T00:00:00.000Z",
      updated_at: "2018-01-01T00:00:00.000Z",
    });
    const out = sortFilteredCategoryRows([old, neu], "newest");
    expect(out.map((r) => r.id)).toEqual(["new", "old"]);
  });
});
