import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireStaffRole } from "@/app/lib/auth/role";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  listArticles,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from "@/app/actions/articles";

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

const ARTICLE_ROW = {
  id: "art-1",
  title: "Bài viết",
  slug: "bai-viet",
  excerpt: "Tóm tắt",
  cover_image_url: null,
  author_name: "Xuan Vu Audio",
  category_id: "cat-1",
  content: "Nội dung",
  is_published: false,
  published_at: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();

  mockOrder.mockResolvedValue({ data: [ARTICLE_ROW], error: null });
  mockMaybeSingle.mockResolvedValue({ data: ARTICLE_ROW, error: null });

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

describe("listArticles", () => {
  it("returns UNAUTHENTICATED when caller is not authenticated", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await listArticles();

    expect(result).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED" } });
  });

  it("returns summaries when caller is authorized", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });

    const result = await listArticles();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0]).toMatchObject({
        id: "art-1",
        title: "Bài viết",
        slug: "bai-viet",
        status: "draft",
      });
    }
  });
});

describe("getArticleById", () => {
  it("returns NOT_FOUND when id is empty", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });

    const result = await getArticleById("");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("createArticle", () => {
  it("returns CONFLICT when unique constraint fails", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    const insertSelect = vi.fn(() => ({
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: { code: "23505", message: "unique violation" },
      }),
    }));
    mockInsert.mockReturnValue({ select: insertSelect });

    const result = await createArticle({ title: "Bài viết", slug: "bai-viet" });

    expect(result).toMatchObject({ ok: false, error: { code: "CONFLICT" } });
  });
});

describe("updateArticle", () => {
  it("returns NOT_FOUND when record does not exist", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    const innerMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    mockUpdate.mockReturnValue({
      eq: vi.fn(() => ({ select: vi.fn(() => ({ maybeSingle: innerMaybeSingle })) })),
    });

    const result = await updateArticle("missing", {
      title: "A",
      slug: "a",
      content: "",
    });

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("publish/unpublish/delete", () => {
  it("publishes article", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    mockUpdate.mockReturnValue({
      eq: vi.fn(() => ({ select: vi.fn(() => ({ maybeSingle: mockMaybeSingle })) })),
    });

    const result = await publishArticle("art-1");

    expect(result).toMatchObject({ ok: true });
  });

  it("unpublishes article", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    mockUpdate.mockReturnValue({
      eq: vi.fn(() => ({ select: vi.fn(() => ({ maybeSingle: mockMaybeSingle })) })),
    });

    const result = await unpublishArticle("art-1");

    expect(result).toMatchObject({ ok: true });
  });

  it("deletes article", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    const innerMaybeSingle = vi.fn().mockResolvedValue({ data: { id: "art-1" }, error: null });
    mockDelete.mockReturnValue({
      eq: vi.fn(() => ({ select: vi.fn(() => ({ maybeSingle: innerMaybeSingle })) })),
    });

    const result = await deleteArticle("art-1");

    expect(result).toMatchObject({ ok: true });
  });
});

