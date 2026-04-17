import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";
import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { getCurrentUserRole, requireAdminRole, requireStaffRole } from "@/app/lib/auth/role";

vi.mock("@/app/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/app/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

// Helpers to build mock clients
function makeServerClient(userResult: { user: { id: string } | null; error?: unknown }) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: userResult.user },
        error: userResult.error ?? null,
      }),
    },
  };
}

function makeAdminClient(queryResult: {
  data: { role: string } | null;
  error: unknown | null;
}) {
  const maybeSingle = vi.fn().mockResolvedValue(queryResult);
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });

  return { from };
}

describe("getCurrentUserRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthenticated error when no user in session", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: null }) as unknown as ReturnType<typeof createSupabaseServerClient>,
    );

    const result = await getCurrentUserRole();

    expect(result).toEqual({ error: "unauthenticated" });
  });

  it("returns unauthenticated error when auth.getUser returns an error", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({
        user: null,
        error: new Error("JWT expired"),
      }) as unknown as ReturnType<typeof createSupabaseServerClient>,
    );

    const result = await getCurrentUserRole();

    expect(result).toEqual({ error: "unauthenticated" });
  });

  it("returns not_found when no profile row exists for the user", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: { id: "user-123" } }) as unknown as ReturnType<
        typeof createSupabaseServerClient
      >,
    );

    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeAdminClient({ data: null, error: null }) as unknown as ReturnType<
        typeof createSupabaseAdminClient
      >,
    );

    const result = await getCurrentUserRole();

    expect(result).toEqual({ error: "not_found" });
  });

  it("returns system error when the DB query fails", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: { id: "user-123" } }) as unknown as ReturnType<
        typeof createSupabaseServerClient
      >,
    );

    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeAdminClient({
        data: null,
        error: { message: "DB connection refused" },
      }) as unknown as ReturnType<typeof createSupabaseAdminClient>,
    );

    const result = await getCurrentUserRole();

    expect(result).toEqual({ error: "system" });
  });

  it("returns admin role for an admin user", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: { id: "user-admin" } }) as unknown as ReturnType<
        typeof createSupabaseServerClient
      >,
    );

    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeAdminClient({ data: { role: "admin" }, error: null }) as unknown as ReturnType<
        typeof createSupabaseAdminClient
      >,
    );

    const result = await getCurrentUserRole();

    expect(result).toEqual({ role: "admin" });
  });

  it("returns staff role for a staff user", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: { id: "user-staff" } }) as unknown as ReturnType<
        typeof createSupabaseServerClient
      >,
    );

    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeAdminClient({ data: { role: "staff" }, error: null }) as unknown as ReturnType<
        typeof createSupabaseAdminClient
      >,
    );

    const result = await getCurrentUserRole();

    expect(result).toEqual({ role: "staff" });
  });
});

describe("requireAdminRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthenticated reason when not authenticated", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: null }) as unknown as ReturnType<typeof createSupabaseServerClient>,
    );

    const result = await requireAdminRole();

    expect(result).toEqual({ ok: false, reason: "unauthenticated" });
  });

  it("returns system reason when DB error occurs", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: { id: "user-123" } }) as unknown as ReturnType<
        typeof createSupabaseServerClient
      >,
    );

    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeAdminClient({
        data: null,
        error: { message: "DB connection refused" },
      }) as unknown as ReturnType<typeof createSupabaseAdminClient>,
    );

    const result = await requireAdminRole();

    expect(result).toEqual({ ok: false, reason: "system" });
  });

  it("returns forbidden reason for staff users", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: { id: "user-staff" } }) as unknown as ReturnType<
        typeof createSupabaseServerClient
      >,
    );

    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeAdminClient({ data: { role: "staff" }, error: null }) as unknown as ReturnType<
        typeof createSupabaseAdminClient
      >,
    );

    const result = await requireAdminRole();

    expect(result).toEqual({ ok: false, reason: "forbidden" });
  });

  it("returns ok: true for admin users", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: { id: "user-admin" } }) as unknown as ReturnType<
        typeof createSupabaseServerClient
      >,
    );

    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeAdminClient({ data: { role: "admin" }, error: null }) as unknown as ReturnType<
        typeof createSupabaseAdminClient
      >,
    );

    const result = await requireAdminRole();

    expect(result).toEqual({ ok: true });
  });

  it("returns system reason when profile not found", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: { id: "user-orphan" } }) as unknown as ReturnType<
        typeof createSupabaseServerClient
      >,
    );

    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeAdminClient({ data: null, error: null }) as unknown as ReturnType<
        typeof createSupabaseAdminClient
      >,
    );

    const result = await requireAdminRole();

    // not_found maps to system in requireAdminRole
    expect(result).toEqual({ ok: false, reason: "system" });
  });
});

describe("requireStaffRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthenticated reason when not authenticated", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: null }) as unknown as ReturnType<typeof createSupabaseServerClient>,
    );

    const result = await requireStaffRole();

    expect(result).toEqual({ ok: false, reason: "unauthenticated" });
  });

  it("returns system reason when DB error occurs", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: { id: "user-123" } }) as unknown as ReturnType<
        typeof createSupabaseServerClient
      >,
    );

    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeAdminClient({
        data: null,
        error: { message: "DB connection refused" },
      }) as unknown as ReturnType<typeof createSupabaseAdminClient>,
    );

    const result = await requireStaffRole();

    expect(result).toEqual({ ok: false, reason: "system" });
  });

  it("returns ok: true for staff users", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: { id: "user-staff" } }) as unknown as ReturnType<
        typeof createSupabaseServerClient
      >,
    );

    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeAdminClient({ data: { role: "staff" }, error: null }) as unknown as ReturnType<
        typeof createSupabaseAdminClient
      >,
    );

    const result = await requireStaffRole();

    expect(result).toEqual({ ok: true });
  });

  it("returns ok: true for admin users", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeServerClient({ user: { id: "user-admin" } }) as unknown as ReturnType<
        typeof createSupabaseServerClient
      >,
    );

    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeAdminClient({ data: { role: "admin" }, error: null }) as unknown as ReturnType<
        typeof createSupabaseAdminClient
      >,
    );

    const result = await requireStaffRole();

    expect(result).toEqual({ ok: true });
  });
});
