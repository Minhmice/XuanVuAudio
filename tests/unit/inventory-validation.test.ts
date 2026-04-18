import { describe, expect, it } from "vitest";

import { isUuidString, parseNonNegativeInt } from "@/app/lib/inventory/validation";

describe("isUuidString", () => {
  it("accepts lowercase UUID", () => {
    expect(isUuidString("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("rejects invalid", () => {
    expect(isUuidString("not-a-uuid")).toBe(false);
  });
});

describe("parseNonNegativeInt", () => {
  it("parses empty as 0", () => {
    expect(parseNonNegativeInt("")).toBe(0);
    expect(parseNonNegativeInt("   ")).toBe(0);
  });

  it("rejects negative and non-integers", () => {
    expect(parseNonNegativeInt("-1")).toBeNull();
    expect(parseNonNegativeInt("1.5")).toBeNull();
    expect(parseNonNegativeInt("x")).toBeNull();
  });

  it("accepts zero and positive", () => {
    expect(parseNonNegativeInt("0")).toBe(0);
    expect(parseNonNegativeInt("42")).toBe(42);
  });
});
