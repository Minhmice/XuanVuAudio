import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdminRole, requireStaffRole } from "@/app/lib/auth/role";
import {
  setProductPublished,
  updateProductPricing,
} from "@/app/actions/products";

vi.mock("@/app/lib/auth/role", () => ({
  requireStaffRole: vi.fn(),
  requireAdminRole: vi.fn(),
}));

const mockFrom = vi.fn();
const mockMaybeSingle = vi.fn();

vi.mock("@/app/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockMaybeSingle.mockResolvedValue({ data: { id: "p1" }, error: null });
});

describe("updateProductPricing", () => {
  it("returns VALIDATION_ERROR when compare price is below selling price", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });

    const result = await updateProductPricing("p1", {
      priceSellingVnd: 100,
      priceCompareAtVnd: 50,
    });

    expect(result).toMatchObject({ ok: false, error: { code: "VALIDATION_ERROR" } });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("returns VALIDATION_ERROR when compare set without selling", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });

    const result = await updateProductPricing("p1", {
      priceSellingVnd: null,
      priceCompareAtVnd: 200,
    });

    expect(result).toMatchObject({ ok: false, error: { code: "VALIDATION_ERROR" } });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("persists when prices are valid", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    mockFrom.mockReturnValue({
      update: () => ({
        eq: () => ({
          select: () => ({
            maybeSingle: mockMaybeSingle,
          }),
        }),
      }),
    });

    const result = await updateProductPricing("p1", {
      priceSellingVnd: 1_990_000,
      priceCompareAtVnd: 2_490_000,
    });

    expect(result.ok).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("catalog_products");
  });
});

describe("setProductPublished", () => {
  it("returns VALIDATION_ERROR when publishing without selling price", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: () =>
            Promise.resolve({
              data: {
                id: "p1",
                is_published: false,
                price_selling_vnd: null,
                first_published_at: null,
              },
              error: null,
            }),
        }),
      }),
    });

    const result = await setProductPublished("p1", true);

    expect(result).toMatchObject({ ok: false, error: { code: "VALIDATION_ERROR" } });
  });

  it("publishes when selling price is set", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const selectMs = vi
      .fn()
      .mockResolvedValueOnce({
        data: {
          id: "p1",
          is_published: false,
          price_selling_vnd: 1000,
          first_published_at: null,
        },
        error: null,
      });

    const updateMs = vi.fn().mockResolvedValue({ data: { id: "p1" }, error: null });

    mockFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          maybeSingle: selectMs,
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            maybeSingle: updateMs,
          }),
        }),
      }),
    });

    const result = await setProductPublished("p1", true);

    expect(result.ok).toBe(true);
    expect(updateMs).toHaveBeenCalled();
  });
});
