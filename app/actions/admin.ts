"use server";

import { requireAdminRole } from "@/app/lib/auth/role";

export type AdminActionError = {
  code: "FORBIDDEN" | "UNAUTHENTICATED" | "SYSTEM_ERROR";
  message: string;
};

export type AdminActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AdminActionError };

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

/**
 * Admin-only action: list internal users.
 *
 * Enforces admin role gate via requireAdminRole. Returns an empty stub
 * for now - Phase 3 will implement real user listing from internal_user_profiles.
 *
 * Staff callers receive FORBIDDEN. Unauthenticated callers receive UNAUTHENTICATED.
 */
export async function listInternalUsers(): Promise<AdminActionResult<unknown[]>> {
  const guard = await requireAdminRole();

  if (!guard.ok) {
    if (guard.reason === "unauthenticated") {
      return unauthenticatedError();
    }

    if (guard.reason === "forbidden") {
      return forbiddenError();
    }

    return systemError();
  }

  // Phase 3 will implement real user listing.
  // Returning empty stub to establish the action contract.
  return { ok: true, data: [] };
}
