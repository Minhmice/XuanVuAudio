import { describe, expect, it } from "vitest";

import { inventoryQuantityChanged } from "@/app/lib/inventory/adjustment-logic";

describe("inventoryQuantityChanged", () => {
  it("is false when equal", () => {
    expect(inventoryQuantityChanged(0, 0)).toBe(false);
    expect(inventoryQuantityChanged(5, 5)).toBe(false);
  });

  it("is true when different", () => {
    expect(inventoryQuantityChanged(0, 1)).toBe(true);
    expect(inventoryQuantityChanged(3, 2)).toBe(true);
  });
});
