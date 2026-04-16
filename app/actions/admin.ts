"use server";

import { requireAdminRole } from "@/app/lib/auth/role";
import type { InternalUserRole } from "@/app/lib/auth/role";
import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";

export type AdminActionError = {
  code:
    | "FORBIDDEN"
    | "UNAUTHENTICATED"
    | "SYSTEM_ERROR"
    | "CONFLICT"
    | "NOT_FOUND";
  message: string;
};

export type AdminActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AdminActionError };

export type InternalUserSummary = {
  userId: string;
  email: string;
  username: string;
  role: InternalUserRole;
  isLocked: boolean;
  isDeactivated: boolean;
  createdAt: string;
};

function unauthenticatedError(): AdminActionResult<never> {
  return {
    ok: false,
    error: {
      code: "UNAUTHENTICATED",
      message: "Vui lòng đăng nhập.",
    },
  };
}

function forbiddenError(): AdminActionResult<never> {
  return {
    ok: false,
    error: {
      code: "FORBIDDEN",
      message: "Bạn không có quyền thực hiện hành động này.",
    },
  };
}

function systemError(): AdminActionResult<never> {
  return {
    ok: false,
    error: {
      code: "SYSTEM_ERROR",
      message: "Lỗi hệ thống. Vui lòng thử lại sau.",
    },
  };
}

function notFoundError(): AdminActionResult<never> {
  return {
    ok: false,
    error: {
      code: "NOT_FOUND",
      message: "Người dùng không tồn tại.",
    },
  };
}

function conflictError(): AdminActionResult<never> {
  return {
    ok: false,
    error: {
      code: "CONFLICT",
      message: "Email hoặc tên đăng nhập đã tồn tại.",
    },
  };
}

function mapGuardError(
  guard: Awaited<ReturnType<typeof requireAdminRole>>,
): AdminActionResult<never> | null {
  if (guard.ok) return null;
  if (guard.reason === "unauthenticated") return unauthenticatedError();
  if (guard.reason === "forbidden") return forbiddenError();
  return systemError();
}

type ProfileRow = {
  user_id: string;
  email: string;
  username: string;
  role: string;
  is_locked: boolean;
  is_deactivated: boolean;
  created_at: string;
};

/**
 * Admin-only action: list all internal users.
 *
 * Returns an array of InternalUserSummary records ordered by creation date descending.
 * Staff callers receive FORBIDDEN. Unauthenticated callers receive UNAUTHENTICATED.
 */
export async function listInternalUsers(): Promise<
  AdminActionResult<InternalUserSummary[]>
> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("internal_user_profiles")
      .select(
        "user_id, email, username, role, is_locked, is_deactivated, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) return systemError();

    const summaries: InternalUserSummary[] = (data as ProfileRow[]).map(
      (row) => ({
        userId: row.user_id,
        email: row.email,
        username: row.username,
        role: row.role as InternalUserRole,
        isLocked: row.is_locked,
        isDeactivated: row.is_deactivated,
        createdAt: row.created_at,
      }),
    );

    return { ok: true, data: summaries };
  } catch {
    return systemError();
  }
}

/**
 * Admin-only action: create a new internal user.
 *
 * Creates the auth.users record via Supabase admin API, then upserts the profile row.
 * Returns CONFLICT if email or username already exists.
 */
export async function createInternalUser(
  email: string,
  username: string,
  password: string,
  role: InternalUserRole,
): Promise<AdminActionResult<{ userId: string }>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!email || !username || !password) {
    return {
      ok: false,
      error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." },
    };
  }

  try {
    const adminClient = createSupabaseAdminClient();

    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      if (
        authError.message?.toLowerCase().includes("already registered") ||
        authError.message?.toLowerCase().includes("already exists") ||
        authError.code === "email_exists"
      ) {
        return conflictError();
      }
      return systemError();
    }

    const userId = authData.user.id;

    const { error: profileError } = await adminClient
      .from("internal_user_profiles")
      .upsert(
        {
          user_id: userId,
          email,
          username,
          role,
          is_locked: false,
          is_deactivated: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

    if (profileError) {
      // Attempt to clean up the auth user to avoid orphan
      await adminClient.auth.admin.deleteUser(userId);

      if (
        profileError.code === "23505" ||
        profileError.message?.toLowerCase().includes("unique")
      ) {
        return conflictError();
      }
      return systemError();
    }

    return { ok: true, data: { userId } };
  } catch {
    return systemError();
  }
}

/**
 * Admin-only action: update the role of an internal user.
 *
 * Updates the role column on internal_user_profiles.
 * Returns NOT_FOUND if the user does not exist.
 */
export async function updateUserRole(
  userId: string,
  newRole: InternalUserRole,
): Promise<AdminActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!userId) return notFoundError();

  try {
    const adminClient = createSupabaseAdminClient();

    const { data, error } = await adminClient
      .from("internal_user_profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select("user_id")
      .maybeSingle<{ user_id: string }>();

    if (error) return systemError();
    if (!data) return notFoundError();

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

/**
 * Admin-only action: deactivate an internal user.
 *
 * Sets is_deactivated = true on the profile and bans the user in Supabase auth
 * (prevents active sessions from refreshing).
 */
export async function deactivateUser(
  userId: string,
): Promise<AdminActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!userId) return notFoundError();

  try {
    const adminClient = createSupabaseAdminClient();

    const { error: profileError } = await adminClient
      .from("internal_user_profiles")
      .update({ is_deactivated: true, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (profileError) return systemError();

    const { error: authError } = await adminClient.auth.admin.updateUserById(
      userId,
      { ban_duration: "876600h" },
    );

    if (authError) return systemError();

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

/**
 * Admin-only action: reactivate a deactivated internal user.
 *
 * Sets is_deactivated = false on the profile and removes the auth ban.
 */
export async function reactivateUser(
  userId: string,
): Promise<AdminActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!userId) return notFoundError();

  try {
    const adminClient = createSupabaseAdminClient();

    const { error: profileError } = await adminClient
      .from("internal_user_profiles")
      .update({ is_deactivated: false, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (profileError) return systemError();

    const { error: authError } = await adminClient.auth.admin.updateUserById(
      userId,
      { ban_duration: "none" },
    );

    if (authError) return systemError();

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}
