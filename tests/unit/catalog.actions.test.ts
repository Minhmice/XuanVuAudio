import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdminRole } from "@/app/lib/auth/role";
import {
  createBrand,
  createCategory,
  getBrandById,
  getCategoryById,
  listBrands,
  listCategories,
  setBrandPublished,
  setCategoryPublished,
  updateBrand,
  updateCategory,
} from "@/app/actions/catalog";

vi.mock("@/app/lib/auth/role", () => ({
  requireAdminRole: vi.fn(),
}));

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockMaybeSingle = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/app/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

const BRAND_ROW = {
  id: "brand-1",
  name: "Sennheiser",
  slug: "sennheiser",
  logo_url: "https://example.com/logo.png",
  is_published: false,
  created_at: "2026-01-01T00:00:00Z",
};

const CATEGORY_ROW = {
  id: "cat-1",
  name: "Tai nghe",
  slug: "tai-nghe",
  description: "Danh mục tai nghe",
  is_published: true,
  created_at: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();

  mockOrder.mockResolvedValue({ data: [BRAND_ROW], error: null });
  mockMaybeSingle.mockResolvedValue({ data: BRAND_ROW, error: null });

  mockEq.mockReturnValue({
    order: mockOrder,
    maybeSingle: mockMaybeSingle,
    select: vi.fn(() => ({ maybeSingle: mockMaybeSingle })),
  });

  mockSelect.mockReturnValue({ order: mockOrder, eq: mockEq, maybeSingle: mockMaybeSingle });
  mockInsert.mockReturnValue({ select: vi.fn(() => ({ maybeSingle: mockMaybeSingle })) });
  mockUpdate.mockReturnValue({ eq: mockEq });

  mockFrom.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
  });
});

describe("listBrands", () => {
  it("returns UNAUTHENTICATED when caller is not authenticated", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await listBrands();

    expect(result).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED" } });
  });

  it("returns typed brand summaries for authorized admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await listBrands();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0]).toMatchObject({
        id: "brand-1",
        name: "Sennheiser",
        slug: "sennheiser",
        logoUrl: "https://example.com/logo.png",
        isPublished: false,
      });
    }
  });
});

describe("getBrandById", () => {
  it("returns NOT_FOUND when row is missing", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await getBrandById("missing");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("createBrand", () => {
  it("returns CONFLICT when slug already exists", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { code: "23505", message: "unique violation" },
    });

    const result = await createBrand({ name: "X", slug: "dup", logoUrl: null });

    expect(result).toMatchObject({ ok: false, error: { code: "CONFLICT" } });
  });
});

describe("updateBrand", () => {
  it("returns NOT_FOUND when update returns no row", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await updateBrand("missing", { name: "X", slug: "x", logoUrl: null });

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("setBrandPublished", () => {
  it("returns ok for authorized admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({ data: { id: "brand-1" }, error: null });

    const result = await setBrandPublished("brand-1", true);

    expect(result).toEqual({ ok: true, data: null });
  });
});

describe("listCategories", () => {
  it("returns typed categories for authorized admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockOrder.mockResolvedValue({ data: [CATEGORY_ROW], error: null });

    const result = await listCategories();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0]).toMatchObject({
        id: "cat-1",
        name: "Tai nghe",
        slug: "tai-nghe",
        description: "Danh mục tai nghe",
        isPublished: true,
      });
    }
  });
});

describe("getCategoryById", () => {
  it("returns NOT_FOUND when row is missing", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await getCategoryById("missing");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("createCategory", () => {
  it("returns CONFLICT when slug already exists", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { code: "23505", message: "unique violation" },
    });

    const result = await createCategory({ name: "X", slug: "dup", description: null });

    expect(result).toMatchObject({ ok: false, error: { code: "CONFLICT" } });
  });
});

describe("updateCategory", () => {
  it("returns NOT_FOUND when update returns no row", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await updateCategory("missing", { name: "X", slug: "x", description: null });

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("setCategoryPublished", () => {
  it("returns ok for authorized admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({ data: { id: "cat-1" }, error: null });

    const result = await setCategoryPublished("cat-1", false);

    expect(result).toEqual({ ok: true, data: null });
  });
});

