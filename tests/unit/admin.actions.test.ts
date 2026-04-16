import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdminRole } from "@/app/lib/auth/role";
import {
  createInternalUser,
  deactivateUser,
  getInternalUserById,
  listInternalUsers,
  reactivateUser,
  updateUserRole,
} from "@/app/actions/admin";

// Mock requireAdminRole
vi.mock("@/app/lib/auth/role", () => ({
  requireAdminRole: vi.fn(),
}));

// Mock Supabase admin client
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockUpdate = vi.fn();
const mockUpsert = vi.fn();
const mockEq = vi.fn();
const mockMaybeSingle = vi.fn();
const mockCreateUser = vi.fn();
const mockUpdateUserById = vi.fn();
const mockDeleteUser = vi.fn();

vi.mock("@/app/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(() => ({
    from: mockFrom,
    auth: {
      admin: {
        createUser: mockCreateUser,
        updateUserById: mockUpdateUserById,
        deleteUser: mockDeleteUser,
      },
    },
  })),
}));

const ADMIN_USER_ROW = {
  user_id: "uuid-1",
  email: "admin@tainghe.local",
  username: "admin",
  role: "admin",
  is_locked: false,
  is_deactivated: false,
  created_at: "2026-01-01T00:00:00Z",
};

const STAFF_USER_ROW = {
  user_id: "uuid-2",
  email: "staff@tainghe.local",
  username: "staff",
  role: "staff",
  is_locked: false,
  is_deactivated: false,
  created_at: "2026-01-02T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();

  // Default chain setup: from().select().order() returns data
  mockOrder.mockResolvedValue({ data: [ADMIN_USER_ROW, STAFF_USER_ROW], error: null });
  mockMaybeSingle.mockResolvedValue({ data: ADMIN_USER_ROW, error: null });
  mockEq.mockReturnValue({
    // Used by getInternalUserById(): select(...).eq(...).maybeSingle(...)
    maybeSingle: mockMaybeSingle,
    // Used by updateUserRole(): update(...).eq(...).select(...).maybeSingle(...)
    select: vi.fn(() => ({ maybeSingle: mockMaybeSingle })),
    // Used by listInternalUsers(): select(...).order(...)
    order: mockOrder,
  });
  mockUpdate.mockReturnValue({ eq: mockEq });
  mockUpsert.mockResolvedValue({ data: null, error: null });
  mockSelect.mockReturnValue({ order: mockOrder, maybeSingle: mockMaybeSingle, eq: mockEq });
  mockFrom.mockReturnValue({
    select: mockSelect,
    update: mockUpdate,
    upsert: mockUpsert,
  });

  // Default auth admin mocks
  mockCreateUser.mockResolvedValue({ data: { user: { id: "new-uuid" } }, error: null });
  mockUpdateUserById.mockResolvedValue({ data: {}, error: null });
  mockDeleteUser.mockResolvedValue({ data: {}, error: null });
});

// -------------------------------------------------------
// listInternalUsers
// -------------------------------------------------------
describe("listInternalUsers", () => {
  it("returns UNAUTHENTICATED when caller is not authenticated", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await listInternalUsers();

    expect(result).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED" } });
  });

  it("returns FORBIDDEN when staff caller invokes the action", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "forbidden" });

    const result = await listInternalUsers();

    expect(result).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
  });

  it("returns SYSTEM_ERROR when role resolution fails", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "system" });

    const result = await listInternalUsers();

    expect(result).toMatchObject({ ok: false, error: { code: "SYSTEM_ERROR" } });
  });

  it("returns typed user summaries for authorized admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await listInternalUsers();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toMatchObject({
        userId: "uuid-1",
        email: "admin@tainghe.local",
        username: "admin",
        role: "admin",
        isLocked: false,
        isDeactivated: false,
      });
    }
  });

  it("returns SYSTEM_ERROR when DB query fails", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockOrder.mockResolvedValue({ data: null, error: { message: "db error" } });

    const result = await listInternalUsers();

    expect(result).toMatchObject({ ok: false, error: { code: "SYSTEM_ERROR" } });
  });
});

// -------------------------------------------------------
// createInternalUser
// -------------------------------------------------------
describe("createInternalUser", () => {
  it("returns UNAUTHENTICATED when caller is not authenticated", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await createInternalUser("a@b.com", "user", "pass", "staff");

    expect(result).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED" } });
  });

  it("returns FORBIDDEN when staff caller invokes the action", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "forbidden" });

    const result = await createInternalUser("a@b.com", "user", "pass", "staff");

    expect(result).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
  });

  it("creates user and returns userId for authorized admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await createInternalUser(
      "new@tainghe.local",
      "newuser",
      "secret123",
      "staff",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.userId).toBe("new-uuid");
    }
    expect(mockCreateUser).toHaveBeenCalledWith({
      email: "new@tainghe.local",
      password: "secret123",
      email_confirm: true,
    });
  });

  it("returns CONFLICT when email is already registered", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockCreateUser.mockResolvedValue({
      data: null,
      error: { message: "User already registered", code: "email_exists" },
    });

    const result = await createInternalUser(
      "existing@tainghe.local",
      "existinguser",
      "pass",
      "staff",
    );

    expect(result).toMatchObject({ ok: false, error: { code: "CONFLICT" } });
  });

  it("returns CONFLICT when username is already taken (profile upsert fails)", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockUpsert.mockResolvedValue({
      data: null,
      error: { code: "23505", message: "unique violation" },
    });

    const result = await createInternalUser(
      "new2@tainghe.local",
      "taken-username",
      "pass",
      "staff",
    );

    expect(result).toMatchObject({ ok: false, error: { code: "CONFLICT" } });
    // Should have attempted to clean up the auth user
    expect(mockDeleteUser).toHaveBeenCalledWith("new-uuid");
  });

  it("returns SYSTEM_ERROR on auth creation failure", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockCreateUser.mockResolvedValue({
      data: null,
      error: { message: "internal error" },
    });

    const result = await createInternalUser("a@b.com", "user", "pass", "staff");

    expect(result).toMatchObject({ ok: false, error: { code: "SYSTEM_ERROR" } });
  });
});

// -------------------------------------------------------
// getInternalUserById
// -------------------------------------------------------
describe("getInternalUserById", () => {
  it("returns FORBIDDEN when staff caller invokes the action", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "forbidden" });

    const result = await getInternalUserById("uuid-1");

    expect(result).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
  });

  it("returns NOT_FOUND when profile row does not exist", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await getInternalUserById("missing");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });

  it("returns a typed user summary for authorized admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await getInternalUserById("uuid-1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toMatchObject({
        userId: "uuid-1",
        email: "admin@tainghe.local",
        username: "admin",
        role: "admin",
        isLocked: false,
        isDeactivated: false,
      });
    }
  });
});

// -------------------------------------------------------
// updateUserRole
// -------------------------------------------------------
describe("updateUserRole", () => {
  beforeEach(() => {
    // setup update chain: from().update().eq().select().maybeSingle()
    mockMaybeSingle.mockResolvedValue({ data: { user_id: "uuid-1" }, error: null });
    const mockSelectInner = vi.fn(() => ({ maybeSingle: mockMaybeSingle }));
    mockEq.mockReturnValue({ select: mockSelectInner });
    mockUpdate.mockReturnValue({ eq: mockEq });
  });

  it("returns UNAUTHENTICATED when caller is not authenticated", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await updateUserRole("uuid-1", "admin");

    expect(result).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED" } });
  });

  it("returns FORBIDDEN when staff caller invokes the action", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "forbidden" });

    const result = await updateUserRole("uuid-1", "admin");

    expect(result).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
  });

  it("updates role and returns ok for authorized admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await updateUserRole("uuid-1", "admin");

    expect(result).toEqual({ ok: true, data: null });
  });

  it("returns NOT_FOUND when user does not exist", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await updateUserRole("nonexistent", "staff");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });

  it("returns NOT_FOUND when userId is empty", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await updateUserRole("", "staff");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

// -------------------------------------------------------
// deactivateUser
// -------------------------------------------------------
describe("deactivateUser", () => {
  beforeEach(() => {
    // update chain for deactivate: from().update().eq()
    mockEq.mockResolvedValue({ error: null });
    mockUpdate.mockReturnValue({ eq: mockEq });
  });

  it("returns UNAUTHENTICATED when caller is not authenticated", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await deactivateUser("uuid-1");

    expect(result).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED" } });
  });

  it("returns FORBIDDEN when staff caller invokes the action", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "forbidden" });

    const result = await deactivateUser("uuid-1");

    expect(result).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
  });

  it("deactivates user and returns ok for authorized admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await deactivateUser("uuid-1");

    expect(result).toEqual({ ok: true, data: null });
    expect(mockUpdateUserById).toHaveBeenCalledWith("uuid-1", {
      ban_duration: "876600h",
    });
  });

  it("returns SYSTEM_ERROR when DB update fails", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockEq.mockResolvedValue({ error: { message: "db error" } });

    const result = await deactivateUser("uuid-1");

    expect(result).toMatchObject({ ok: false, error: { code: "SYSTEM_ERROR" } });
  });

  it("returns SYSTEM_ERROR when auth ban call fails", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockEq.mockResolvedValue({ error: null });
    mockUpdateUserById.mockResolvedValue({ data: null, error: { message: "auth error" } });

    const result = await deactivateUser("uuid-1");

    expect(result).toMatchObject({ ok: false, error: { code: "SYSTEM_ERROR" } });
  });

  it("returns NOT_FOUND when userId is empty", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await deactivateUser("");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});

// -------------------------------------------------------
// reactivateUser
// -------------------------------------------------------
describe("reactivateUser", () => {
  beforeEach(() => {
    // update chain for reactivate: from().update().eq()
    mockEq.mockResolvedValue({ error: null });
    mockUpdate.mockReturnValue({ eq: mockEq });
  });

  it("returns UNAUTHENTICATED when caller is not authenticated", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await reactivateUser("uuid-1");

    expect(result).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED" } });
  });

  it("returns FORBIDDEN when staff caller invokes the action", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "forbidden" });

    const result = await reactivateUser("uuid-1");

    expect(result).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
  });

  it("reactivates user and returns ok for authorized admin", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await reactivateUser("uuid-1");

    expect(result).toEqual({ ok: true, data: null });
    expect(mockUpdateUserById).toHaveBeenCalledWith("uuid-1", {
      ban_duration: "none",
    });
  });

  it("returns SYSTEM_ERROR when DB update fails", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockEq.mockResolvedValue({ error: { message: "db error" } });

    const result = await reactivateUser("uuid-1");

    expect(result).toMatchObject({ ok: false, error: { code: "SYSTEM_ERROR" } });
  });

  it("returns SYSTEM_ERROR when auth un-ban call fails", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });
    mockEq.mockResolvedValue({ error: null });
    mockUpdateUserById.mockResolvedValue({ data: null, error: { message: "auth error" } });

    const result = await reactivateUser("uuid-1");

    expect(result).toMatchObject({ ok: false, error: { code: "SYSTEM_ERROR" } });
  });

  it("returns NOT_FOUND when userId is empty", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await reactivateUser("");

    expect(result).toMatchObject({ ok: false, error: { code: "NOT_FOUND" } });
  });
});
