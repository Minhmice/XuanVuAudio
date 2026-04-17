import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireStaffRole } from "@/app/lib/auth/role";
import {
  createShowroom,
  deleteShowroom,
  getShowroomById,
  listShowrooms,
  updateShowroom,
} from "@/app/actions/showrooms";

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

const SHOWROOM_ROW = {
  id: "showroom-1",
  name: "Showroom Quận 1",
  address: "123 Nguyễn Huệ, Q.1, TP.HCM",
  phone: "0900 000 000",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();

  mockOrder.mockResolvedValue({ data: [SHOWROOM_ROW], error: null });
  mockMaybeSingle.mockResolvedValue({ data: SHOWROOM_ROW, error: null });

  mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle, select: vi.fn(() => ({ maybeSingle: mockMaybeSingle })) });

  mockSelect.mockReturnValue({ order: mockOrder, eq: mockEq, maybeSingle: mockMaybeSingle });
  mockInsert.mockReturnValue({ select: vi.fn(() => ({ maybeSingle: mockMaybeSingle })) });
  mockUpdate.mockReturnValue({ eq: mockEq });
  mockDelete.mockReturnValue({ eq: mockEq });

  mockFrom.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  });
});

describe("listShowrooms", () => {
  it("returns UNAUTHENTICATED when caller is not authenticated", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await listShowrooms();

    expect(result).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED" } });
  });

  it("returns typed showrooms for authorized staff", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });

    const result = await listShowrooms();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0]).toMatchObject({
        id: "showroom-1",
        name: "Showroom Quận 1",
        address: "123 Nguyễn Huệ, Q.1, TP.HCM",
        phone: "0900 000 000",
      });
    }
  });
});

describe("getShowroomById", () => {
  it("returns NOT_FOUND when showroom does not exist", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await getShowroomById("missing");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("createShowroom", () => {
  it("returns CONFLICT on unique violation", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { code: "23505", message: "unique violation" },
    });

    const result = await createShowroom({
      name: "Showroom Quận 1",
      address: "123 Nguyễn Huệ",
      phone: "0900",
    });

    expect(result).toMatchObject({ ok: false, error: { code: "CONFLICT" } });
  });
});

describe("updateShowroom", () => {
  it("returns NOT_FOUND when showroom does not exist", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await updateShowroom("missing", {
      name: "a",
      address: "b",
      phone: "c",
    });

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

describe("deleteShowroom", () => {
  it("returns NOT_FOUND when showroom does not exist", async () => {
    vi.mocked(requireStaffRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await deleteShowroom("missing");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

