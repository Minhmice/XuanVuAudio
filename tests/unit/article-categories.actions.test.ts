import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireStaffRole } from "@/app/lib/auth/role";
import {
  createArticleCategory,
  deleteArticleCategory,
  getArticleCategoryById,
  listArticleCategories,
  updateArticleCategory,
} from "@/app/actions/article-categories";

vi.mock("@/app/lib/auth/role", () => ({
  requireStaffRole: vi.fn(),
}));

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockMaybeSingle = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock("@/app/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

const CATEGORY_ROW = {
  id: "cat-1",
  name: "Tin tức",
  slug: "tin-tuc",
  description: "Mô tả",
  created_at: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();

  mockOrder.mockResolvedValue({ data: [CATEGORY_ROW], error: null });
  mockMaybeSingle.mockResolvedValue({ data: CATEGORY_ROW, error: null });

  mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });
  mockSelect.mockReturnValue({ order: mockOrder, eq: mockEq, maybeSingle: mockMaybeSingle });

  mockInsert.mockReturnValue({ select: vi.fn(() => ({ maybeSingle: mockMaybeSingle })) });
  mockUpdate.mockReturnValue({
    eq: vi.fn(() => ({ select: vi.fn(() => ({ maybeSingle: mockMaybeSingle })) })),
  });
  mockDelete.mockReturnValue({
    eq: vi.fn(() => ({ select: vi.fn(() => ({ maybeSingle: mockMaybeSingle })) })),
  });

  mockFrom.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  });
});

describe("listArticleCategories", () => {
  it("returns UNAUTHENTICATED when caller is not authenticated", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await listArticleCategories();

    expect(result).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED" } });
  });

  it("returns FORBIDDEN when caller is forbidden", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: false, reason: "forbidden" });

    const result = await listArticleCategories();

    expect(result).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
  });

  it("returns summaries when caller is authorized", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });

    const result = await listArticleCategories();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0]).toMatchObject({
        id: "cat-1",
        name: "Tin tức",
        slug: "tin-tuc",
        description: "Mô tả",
      });
    }
  });
});

describe("getArticleCategoryById", () => {
  it("returns NOT_FOUND when id is empty", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });

    const result = await getArticleCategoryById("");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });

  it("returns category when found", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });

    const result = await getArticleCategoryById("cat-1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.slug).toBe("tin-tuc");
    }
  });
});

describe("createArticleCategory", () => {
  it("returns CONFLICT when unique constraint fails", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    const insertSelect = vi.fn(() => ({
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: { code: "23505", message: "unique violation" },
      }),
    }));
    mockInsert.mockReturnValue({ select: insertSelect });

    const result = await createArticleCategory({ name: "Tin tức", slug: "tin-tuc" });

    expect(result).toMatchObject({ ok: false, error: { code: "CONFLICT" } });
  });
});

describe("updateArticleCategory", () => {
  it("returns NOT_FOUND when record does not exist", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    const innerMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    mockUpdate.mockReturnValue({
      eq: vi.fn(() => ({ select: vi.fn(() => ({ maybeSingle: innerMaybeSingle })) })),
    });

    const result = await updateArticleCategory("missing", {
      name: "A",
      slug: "a",
      description: null,
    });

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("deleteArticleCategory", () => {
  it("returns NOT_FOUND when record does not exist", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    const innerMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    mockDelete.mockReturnValue({
      eq: vi.fn(() => ({ select: vi.fn(() => ({ maybeSingle: innerMaybeSingle })) })),
    });

    const result = await deleteArticleCategory("missing");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

