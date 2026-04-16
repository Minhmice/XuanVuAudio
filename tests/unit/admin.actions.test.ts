import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAdminRole } from "@/app/lib/auth/role";
import { listInternalUsers } from "@/app/actions/admin";

vi.mock("@/app/lib/auth/role", () => ({
  requireAdminRole: vi.fn(),
}));

describe("listInternalUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns UNAUTHENTICATED error when caller is not authenticated", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "unauthenticated" });

    const result = await listInternalUsers();

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "UNAUTHENTICATED",
      },
    });
  });

  it("returns FORBIDDEN error when staff caller invokes the action", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "forbidden" });

    const result = await listInternalUsers();

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "FORBIDDEN",
      },
    });
  });

  it("returns SYSTEM_ERROR when system error occurs during role resolution", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "system" });

    const result = await listInternalUsers();

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SYSTEM_ERROR",
      },
    });
  });

  it("returns ok with empty data array for authorized admin caller", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await listInternalUsers();

    expect(result).toEqual({ ok: true, data: [] });
  });
});
