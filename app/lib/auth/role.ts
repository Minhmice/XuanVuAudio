import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";
import { createSupabaseServerClient } from "@/app/lib/supabase/server";

export type InternalUserRole = "admin" | "staff";

export type GetCurrentUserRoleResult =
  | { role: InternalUserRole }
  | { error: "unauthenticated" | "not_found" | "system" };

export type RequireAdminRoleResult =
  | { ok: true }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "system" };

export type RequireStaffRoleResult =
  | { ok: true }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "system" };

type RoleProfileRow = {
  role: string;
};

/**
 * Resolves the role of the currently authenticated internal user.
 *
 * Uses `getUser()` (not `getSession()`) for authoritative server-side permission checks.
 * Fetches the `role` column from `internal_user_profiles` via the admin client.
 *
 * @returns `{ role }` on success, or `{ error }` describing the failure kind.
 */
export async function getCurrentUserRole(): Promise<GetCurrentUserRoleResult> {
  let userId: string;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "unauthenticated" };
    }

    userId = user.id;
  } catch {
    return { error: "system" };
  }

  try {
    const adminClient = createSupabaseAdminClient();

    const { data, error: dbError } = await adminClient
      .from("internal_user_profiles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle<RoleProfileRow>();

    if (dbError) {
      return { error: "system" };
    }

    if (!data) {
      return { error: "not_found" };
    }

    const role = data.role as InternalUserRole;

    return { role };
  } catch {
    return { error: "system" };
  }
}

/**
 * Guards admin-only server actions.
 *
 * Calls `getCurrentUserRole()` and maps the result to an access decision.
 * Returns `{ ok: true }` only for authenticated admin users.
 *
 * @returns `{ ok: true }` or `{ ok: false, reason }` explaining why access is denied.
 */
export async function requireAdminRole(): Promise<RequireAdminRoleResult> {
  const result = await getCurrentUserRole();

  if ("error" in result) {
    if (result.error === "unauthenticated") {
      return { ok: false, reason: "unauthenticated" };
    }

    // not_found or system
    return { ok: false, reason: "system" };
  }

  if (result.role !== "admin") {
    return { ok: false, reason: "forbidden" };
  }

  return { ok: true };
}

/**
 * Guards staff-accessible internal server actions and pages.
 *
 * Returns `{ ok: true }` for authenticated internal users with either `staff` or `admin` role.
 */
export async function requireStaffRole(): Promise<RequireStaffRoleResult> {
  const result = await getCurrentUserRole();

  if ("error" in result) {
    if (result.error === "unauthenticated") {
      return { ok: false, reason: "unauthenticated" };
    }
    // not_found or system
    return { ok: false, reason: "system" };
  }

  if (result.role !== "admin" && result.role !== "staff") {
    return { ok: false, reason: "forbidden" };
  }

  return { ok: true };
}
