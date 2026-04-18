import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdminRole } from "@/app/lib/auth/role";
import {
  createSpecAttribute,
  getSpecAttributeById,
  listSpecAttributeDefinitions,
} from "@/app/actions/spec-attribute-definitions";

vi.mock("@/app/lib/auth/role", () => ({
  requireAdminRole: vi.fn(),
}));

const mockFrom = vi.fn();

vi.mock("@/app/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

const ATTR_ROW = {
  id: "attr-1",
  slug: "weight_g",
  label_vi: "Trọng lượng",
  group_name: "Thân máy",
  value_type: "number",
  sort_order: 2,
  is_active: true,
};

function listSelectChain(data: unknown[]) {
  return {
    select: vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data, error: null }),
      }),
    }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockFrom.mockReset();
});

describe("listSpecAttributeDefinitions", () => {
  it("returns FORBIDDEN when caller is not admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "forbidden" });

    const result = await listSpecAttributeDefinitions();

    expect(result).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
  });

  it("returns rows for admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockFrom.mockReturnValue(listSelectChain([ATTR_ROW]));

    const result = await listSpecAttributeDefinitions();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0]).toMatchObject({
        id: "attr-1",
        slug: "weight_g",
        isActive: true,
      });
    }
  });
});

describe("getSpecAttributeById", () => {
  it("returns NOT_FOUND when row missing", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    });

    const result = await getSpecAttributeById("missing");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("createSpecAttribute", () => {
  it("returns CONFLICT on unique violation", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockFrom.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: { code: "23505", message: "unique violation" },
          }),
        }),
      }),
    });

    const result = await createSpecAttribute({
      slug: "dup",
      labelVi: "Dup",
      groupName: "G",
      valueType: "text",
      sortOrder: 0,
    });

    expect(result).toMatchObject({ ok: false, error: { code: "CONFLICT" } });
  });
});
