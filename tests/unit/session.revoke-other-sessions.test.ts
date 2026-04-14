import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";
import {
  getSessionIdFromAccessToken,
  revokeOtherSessionsKeepCurrent,
} from "@/app/lib/auth/session";

vi.mock("@/app/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function buildToken(payload: Record<string, unknown>): string {
  const header = toBase64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = toBase64Url(JSON.stringify(payload));

  return `${header}.${body}.signature`;
}

describe("session revoke helper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("extracts session id from access token session_id claim", () => {
    const token = buildToken({
      sub: "00000000-0000-0000-0000-000000000001",
      session_id: "11111111-1111-1111-1111-111111111111",
    });

    expect(getSessionIdFromAccessToken(token)).toBe(
      "11111111-1111-1111-1111-111111111111",
    );
  });

  it("returns null when token payload cannot be decoded", () => {
    expect(getSessionIdFromAccessToken("not-a-jwt")).toBeNull();
  });

  it("calls admin rpc with user id and current session id", async () => {
    const rpc = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(createSupabaseAdminClient).mockReturnValue({
      rpc,
    } as unknown as ReturnType<typeof createSupabaseAdminClient>);

    const currentAccessToken = buildToken({
      sub: "00000000-0000-0000-0000-000000000001",
      session_id: "22222222-2222-2222-2222-222222222222",
    });

    await revokeOtherSessionsKeepCurrent({
      userId: "00000000-0000-0000-0000-000000000001",
      currentAccessToken,
    });

    expect(rpc).toHaveBeenCalledWith("internal_revoke_other_sessions", {
      p_user_id: "00000000-0000-0000-0000-000000000001",
      p_current_session_id: "22222222-2222-2222-2222-222222222222",
    });
  });
});
