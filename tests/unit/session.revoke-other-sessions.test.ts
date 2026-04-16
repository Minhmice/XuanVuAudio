import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";
import { revokeOtherSessionsKeepCurrent } from "@/app/lib/auth/session";

vi.mock("@/app/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

describe("session revoke helper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls admin rpc with user id and current session id", async () => {
    const rpc = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(createSupabaseAdminClient).mockReturnValue({
      rpc,
    } as unknown as ReturnType<typeof createSupabaseAdminClient>);

    await revokeOtherSessionsKeepCurrent({
      userId: "00000000-0000-0000-0000-000000000001",
      currentSessionId: "22222222-2222-2222-2222-222222222222",
    });

    expect(rpc).toHaveBeenCalledWith("internal_revoke_other_sessions", {
      p_user_id: "00000000-0000-0000-0000-000000000001",
      p_current_session_id: "22222222-2222-2222-2222-222222222222",
    });
  });

  it("throws when current session id is missing", async () => {
    await expect(
      revokeOtherSessionsKeepCurrent({
        userId: "00000000-0000-0000-0000-000000000001",
        currentSessionId: "",
      }),
    ).rejects.toThrow("currentSessionId is required");
  });
});
