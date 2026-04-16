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
      message: "Vui lu00f2ng u0111u0103ng nhu1eadp.",
    },
  };
}

function forbiddenError(): AdminActionResult<never> {
  return {
    ok: false,
    error: {
      code: "FORBIDDEN",
      message: "Bu1ea1n khu00f4ng cu00f3 quyu1ec1n thu1ef1c hiu1ec7n hu00e0nh u0111u1ed9ng nu00e0y.",
    },
  };
}

function systemError(): AdminActionResult<never> {
  return {
    ok: false,
    error: {
      code: "SYSTEM_ERROR",
      message: "Lu1ed7i hu1ec7 thu1ed1ng. Vui lu00f2ng thu1eed lu1ea1i sau.",
    },
  };
}

/**
 * Admin-only action: list internal users.
 *
 * Enforces admin role gate via `requireAdminRole`. Returns an empty stub
 * for now u2014 Phase 3 will implement real user listing from `internal_user_profiles`.
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
