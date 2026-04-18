import { describe, expect, it } from "vitest";

import { escapeIlikePattern } from "@/app/lib/storefront/search-utils";

describe("escapeIlikePattern", () => {
  it("trims and strips LIKE metacharacters and comma", () => {
    expect(escapeIlikePattern("  a%b_c\\d,e  ")).toBe("abcde");
  });

  it("returns empty for only wildcards", () => {
    expect(escapeIlikePattern("%%%")).toBe("");
  });
});
