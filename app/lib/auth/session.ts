import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";

type RevokeOtherSessionsParams = {
  userId: string;
  currentAccessToken: string;
};

function decodeJwtPayload(accessToken: string): Record<string, unknown> | null {
  const segments = accessToken.split(".");

  if (segments.length < 2) {
    return null;
  }

  try {
    const payload = segments[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(segments[1].length / 4) * 4, "=");

    const decoded = Buffer.from(payload, "base64").toString("utf8");
    const parsed = JSON.parse(decoded) as unknown;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getSessionIdFromAccessToken(accessToken: string): string | null {
  const payload = decodeJwtPayload(accessToken);

  if (!payload) {
    return null;
  }

  const sessionId = payload.session_id;

  return typeof sessionId === "string" && sessionId.length > 0 ? sessionId : null;
}

export async function revokeOtherSessionsKeepCurrent({
  userId,
  currentAccessToken,
}: RevokeOtherSessionsParams): Promise<void> {
  const currentSessionId = getSessionIdFromAccessToken(currentAccessToken);

  if (!currentSessionId) {
    throw new Error("Unable to determine current session id from access token");
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
