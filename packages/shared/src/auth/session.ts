import { createSupabaseAdminClient } from "../supabase/admin";

type RevokeOtherSessionsParams = {
  userId: string;
  currentSessionId: string;
};

export async function revokeOtherSessionsKeepCurrent({
  userId,
  currentSessionId,
}: RevokeOtherSessionsParams): Promise<void> {
  if (!currentSessionId) {
    throw new Error("currentSessionId is required");
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const { error } = await supabaseAdmin.rpc("internal_revoke_other_sessions", {
    p_user_id: userId,
    p_current_session_id: currentSessionId,
  });

  if (error) {
    throw new Error(`Failed to revoke other sessions: ${error.message}`);
  }
}
