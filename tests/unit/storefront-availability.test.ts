import { describe, expect, it } from "vitest";

import {
  AVAILABILITY_LABEL_VI,
  buildProductAvailabilityLabelMap,
  totalOnHandToAvailabilityKind,
} from "@/app/lib/storefront/availability";

describe("totalOnHandToAvailabilityKind", () => {
  it("in_stock when positive", () => {
    expect(totalOnHandToAvailabilityKind(1)).toBe("in_stock");
    expect(totalOnHandToAvailabilityKind(99)).toBe("in_stock");
  });

  it("out_of_stock when zero or negative", () => {
    expect(totalOnHandToAvailabilityKind(0)).toBe("out_of_stock");
    expect(totalOnHandToAvailabilityKind(-1)).toBe("out_of_stock");
  });

  it("handles bigint", () => {
    expect(totalOnHandToAvailabilityKind(3n)).toBe("in_stock");
    expect(totalOnHandToAvailabilityKind(0n)).toBe("out_of_stock");
  });
});

describe("buildProductAvailabilityLabelMap", () => {
  it("maps missing row to Hết hàng", () => {
    const m = buildProductAvailabilityLabelMap([], ["a"]);
    expect(m.get("a")).toBe(AVAILABILITY_LABEL_VI.out_of_stock);
  });

  it("maps zero total to Hết hàng", () => {
    const m = buildProductAvailabilityLabelMap([], ["x"]);
    expect(m.get("x")).toBe("Hết hàng");
  });

  it("maps positive total to Còn hàng", () => {
    const m = buildProductAvailabilityLabelMap(
      [{ product_id: "p1", total_on_hand: 2 }],
      ["p1"],
    );
    expect(m.get("p1")).toBe(AVAILABILITY_LABEL_VI.in_stock);
  });
});
