import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireStaffRole } from "@/app/lib/auth/role";
import {
  getProductSpecEditorState,
  listActiveSpecAttributes,
  saveProductSpecsFromForm,
} from "@/app/actions/product-specs";

vi.mock("@/app/lib/auth/role", () => ({
  requireStaffRole: vi.fn(),
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
};

function attributesSelectChain(data: unknown[]) {
  return {
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data, error: null }),
        }),
      }),
    }),
  };
}

function valuesSelectChain(data: unknown[]) {
  return {
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data, error: null }),
    }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockFrom.mockReset();
});

describe("listActiveSpecAttributes", () => {
  it("returns UNAUTHENTICATED when caller is not authenticated", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await listActiveSpecAttributes();

    expect(result).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED" } });
  });

  it("returns mapped definitions for authorized staff", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    mockFrom.mockReturnValue(attributesSelectChain([ATTR_ROW]));

    const result = await listActiveSpecAttributes();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0]).toMatchObject({
        id: "attr-1",
        slug: "weight_g",
        labelVi: "Trọng lượng",
        groupName: "Thân máy",
        valueType: "number",
        sortOrder: 2,
      });
    }
  });
});

describe("getProductSpecEditorState", () => {
  it("returns grouped editor state", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });

    mockFrom.mockImplementation((table: string) => {
      if (table === "catalog_spec_attributes") {
        return attributesSelectChain([ATTR_ROW]);
      }
      if (table === "catalog_product_spec_values") {
        return valuesSelectChain([
          {
            attribute_id: "attr-1",
            value_text: null,
            value_number: 320,
            value_boolean: null,
            catalog_spec_attributes: { value_type: "number" },
          },
        ]);
      }
      throw new Error(`unexpected table ${table}`);
    });

    const result = await getProductSpecEditorState("prod-1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0].groupName).toBe("Thân máy");
      expect(result.data[0].attributes[0]).toMatchObject({
        id: "attr-1",
        valueNumber: 320,
      });
    }
  });
});

describe("saveProductSpecsFromForm", () => {
  it("returns VALIDATION_ERROR when more than 50 non-empty values", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });

    const entries = Array.from({ length: 51 }, (_, i) => ({
      attributeId: `a-${i}`,
      rawValue: "x",
    }));

    const result = await saveProductSpecsFromForm("prod-1", entries);

    expect(result).toMatchObject({ ok: false, error: { code: "VALIDATION_ERROR" } });
    expect(mockFrom).not.toHaveBeenCalled();
  });
});
