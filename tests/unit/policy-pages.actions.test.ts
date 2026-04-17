import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdminRole } from "@/app/lib/auth/role";
import {
  createPolicyPage,
  deletePolicyPage,
  getPolicyPageById,
  getPublishedPolicyPageBySlug,
  listPolicyPages,
  updatePolicyPage,
} from "@/app/actions/policy-pages";

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
const mockDelete = vi.fn();

vi.mock("@/app/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

const mockServerFrom = vi.fn();
const mockServerSelect = vi.fn();
const mockServerEq = vi.fn();
const mockServerMaybeSingle = vi.fn();

vi.mock("@/app/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    from: mockServerFrom,
  })),
}));

const PAGE_ROW = {
  id: "page-1",
  key: "delivery",
  title: "Chính sách giao hàng",
  slug: "chinh-sach-giao-hang",
  excerpt: "Tóm tắt",
  content_markdown: "## Nội dung",
  is_published: true,
  published_at: "2026-01-02T00:00:00Z",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-03T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();

  mockOrder.mockResolvedValue({ data: [PAGE_ROW], error: null });
  mockMaybeSingle.mockResolvedValue({ data: PAGE_ROW, error: null });

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

  mockServerMaybeSingle.mockResolvedValue({
    data: { ...PAGE_ROW, is_published: true },
    error: null,
  });
  mockServerEq.mockReturnValue({ eq: mockServerEq, maybeSingle: mockServerMaybeSingle });
  mockServerSelect.mockReturnValue({ eq: mockServerEq, maybeSingle: mockServerMaybeSingle });
  mockServerFrom.mockReturnValue({ select: mockServerSelect });
});

describe("listPolicyPages", () => {
  it("returns UNAUTHENTICATED when caller is not authenticated", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await listPolicyPages();

    expect(result).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED" } });
  });

  it("returns summaries when caller is authorized", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await listPolicyPages();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0]).toMatchObject({
        id: "page-1",
        key: "delivery",
        slug: "chinh-sach-giao-hang",
        isPublished: true,
      });
    }
  });
});

describe("getPolicyPageById", () => {
  it("returns NOT_FOUND when id is empty", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await getPolicyPageById("");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("createPolicyPage", () => {
  it("returns CONFLICT when unique constraint fails", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    const insertSelect = vi.fn(() => ({
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: { code: "23505", message: "unique violation" },
      }),
    }));
    mockInsert.mockReturnValue({ select: insertSelect });

    const result = await createPolicyPage({
      key: "delivery",
      title: "A",
      slug: "a",
      contentMarkdown: "x",
    });

    expect(result).toMatchObject({ ok: false, error: { code: "CONFLICT" } });
  });
});

describe("updatePolicyPage", () => {
  it("returns NOT_FOUND when record does not exist", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    const innerMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    mockUpdate.mockReturnValue({
      eq: vi.fn(() => ({ select: vi.fn(() => ({ maybeSingle: innerMaybeSingle })) })),
    });

    const result = await updatePolicyPage("missing", {
      key: "delivery",
      title: "A",
      slug: "a",
      contentMarkdown: "x",
      isPublished: false,
    });

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("deletePolicyPage", () => {
  it("returns NOT_FOUND when record does not exist", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    const innerMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    mockDelete.mockReturnValue({
      eq: vi.fn(() => ({ select: vi.fn(() => ({ maybeSingle: innerMaybeSingle })) })),
    });

    const result = await deletePolicyPage("missing");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("getPublishedPolicyPageBySlug", () => {
  it("returns NOT_FOUND when slug is empty", async () => {
    const result = await getPublishedPolicyPageBySlug("");
    expect(result).toEqual({ ok: false, error: "NOT_FOUND" });
  });

  it("returns page when found", async () => {
    const result = await getPublishedPolicyPageBySlug("chinh-sach-giao-hang");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.title).toBe("Chính sách giao hàng");
    }
  });
});

