import { describe, expect, it } from "vitest";

import { isProductInNewWindow, MERCH_NEW_WINDOW_DAYS } from "@/app/lib/merch/product-new";

describe("isProductInNewWindow", () => {
  it("returns false when firstPublishedAt is null", () => {
    expect(isProductInNewWindow(null, new Date("2026-06-01T12:00:00Z"))).toBe(false);
  });

  it("returns true on first day", () => {
    const first = "2026-04-01T10:00:00Z";
    expect(isProductInNewWindow(first, new Date("2026-04-01T15:00:00Z"))).toBe(true);
  });

  it("returns true just before window end", () => {
    const first = "2026-04-01T00:00:00Z";
    const end = new Date("2026-04-01T00:00:00Z");
    end.setUTCDate(end.getUTCDate() + MERCH_NEW_WINDOW_DAYS);
    const almostEnd = new Date(end.getTime() - 1000);
    expect(isProductInNewWindow(first, almostEnd)).toBe(true);
  });

  it("returns false at window end boundary", () => {
    const first = "2026-04-01T00:00:00Z";
    const end = new Date("2026-04-01T00:00:00Z");
    end.setUTCDate(end.getUTCDate() + MERCH_NEW_WINDOW_DAYS);
    expect(isProductInNewWindow(first, end)).toBe(false);
  });

  it("returns false for invalid date string", () => {
    expect(isProductInNewWindow("not-a-date", new Date())).toBe(false);
  });
});
