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

    expect(result).toEqual({
      ok: false,
      error: {
        code: "UNAUTHENTICATED",
        message: expect.stringContaining("u0111u0103ng nhu1eadp"),
      },
    });
  });

  it("returns FORBIDDEN error when staff caller invokes the action", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "forbidden" });

    const result = await listInternalUsers();

    expect(result).toEqual({
      ok: false,
      error: {
        code: "FORBIDDEN",
        message: expect.stringContaining("khu00f4ng cu00f3 quyu1ec1n"),
      },
    });
  });

  it("returns SYSTEM_ERROR when system error occurs during role resolution", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: false, reason: "system" });

    const result = await listInternalUsers();

    expect(result).toEqual({
      ok: false,
      error: {
        code: "SYSTEM_ERROR",
        message: expect.stringContaining("hu1ec7 thu1ed1ng"),
      },
    });
  });

  it("returns ok with empty data array for authorized admin caller", async () => {
    vi.mocked(requireAdminRole).mockResolvedValue({ ok: true });

    const result = await listInternalUsers();

    expect(result).toEqual({ ok: true, data: [] });
  });
});
