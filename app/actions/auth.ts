"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { getSessionMaxAgeSeconds } from "@/app/lib/auth/session-duration";
import {
  mapAuthFailureToUi,
  normalizeIdentifier,
  resolveIdentifierToEmail,
} from "@/app/lib/auth/identifier";
import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";
import { createSupabaseServerClient } from "@/app/lib/supabase/server";

export type SignInErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "LOCKED_ACCOUNT"
  | "DEACTIVATED_ACCOUNT"
  | "SYSTEM_ERROR";

export type SignInError = {
  code: SignInErrorCode;
  message: string;
  fieldErrors?: {
    identifier?: string;
    password?: string;
  };
};

export type SignInResult =
  | {
      ok: false;
      error: SignInError;
    }
  | {
      ok: true;
    };

export type SignInPayload = {
  identifier?: string;
  password?: string;
  rememberMe?: boolean;
};

type InternalUserProfile = {
  is_locked: boolean;
  is_deactivated: boolean;
};

const signInSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().min(1),
  rememberMe: z.boolean(),
});

function toBoolean(value: FormDataEntryValue | boolean | undefined): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return ["on", "true", "1", "yes"].includes(value.toLowerCase());
  }

  return false;
}

function getSignInPayload(formDataOrPayload: FormData | SignInPayload): {
  identifier: string;
  password: string;
  rememberMe: boolean;
} {
  if (formDataOrPayload instanceof FormData) {
    return {
      identifier: String(formDataOrPayload.get("identifier") ?? "").trim(),
      password: String(formDataOrPayload.get("password") ?? ""),
      rememberMe: toBoolean(formDataOrPayload.get("rememberMe") ?? undefined),
    };
  }

  return {
    identifier: String(formDataOrPayload.identifier ?? "").trim(),
    password: String(formDataOrPayload.password ?? ""),
    rememberMe: toBoolean(formDataOrPayload.rememberMe),
  };
}

function buildValidationError(identifier: string, password: string): SignInResult {
  const fieldErrors: SignInError["fieldErrors"] = {};

  if (!identifier) {
    fieldErrors.identifier = mapAuthFailureToUi({
      kind: "validation",
      field: "identifier",
    }).message;
  }

  if (!password) {
    fieldErrors.password = mapAuthFailureToUi({
      kind: "validation",
      field: "password",
    }).message;
  }

  return {
    ok: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Dữ liệu đăng nhập không hợp lệ.",
      fieldErrors,
    },
  };
}

function buildAuthFailure(code: SignInErrorCode, message: string): SignInResult {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  };
}

function mapSupabaseErrorToSignInResult(): SignInResult {
  return buildAuthFailure(
    "INVALID_CREDENTIALS",
    mapAuthFailureToUi({ kind: "invalid_credentials" }).message,
  );
}

async function getAccountStateByEmail(email: string): Promise<
  | { profile: InternalUserProfile }
  | { errorCode: "invalid_credentials" | "system" }
> {
  const adminClient = createSupabaseAdminClient();

  const { data, error } = await adminClient
    .from("internal_user_profiles")
    .select("is_locked, is_deactivated")
    .eq("email", email)
    .maybeSingle<InternalUserProfile>();

  if (error) {
    return { errorCode: "system" };
  }

  if (!data) {
    return { errorCode: "invalid_credentials" };
  }

  return { profile: data };
}

export async function signIn(formDataOrPayload: FormData | SignInPayload): Promise<SignInResult> {
  const payload = getSignInPayload(formDataOrPayload);
  const parsed = signInSchema.safeParse(payload);

  if (!parsed.success) {
    return buildValidationError(payload.identifier, payload.password);
  }

  const normalizedIdentifier = normalizeIdentifier(parsed.data.identifier);
  const resolvedIdentifier = await resolveIdentifierToEmail({ identifier: normalizedIdentifier });

  if ("errorCode" in resolvedIdentifier) {
    if (resolvedIdentifier.errorCode === "invalid_credentials") {
      return buildAuthFailure(
        "INVALID_CREDENTIALS",
        mapAuthFailureToUi({ kind: "invalid_credentials" }).message,
      );
    }

    return buildAuthFailure("SYSTEM_ERROR", mapAuthFailureToUi({ kind: "system" }).message);
  }

  const sessionMaxAgeSeconds = getSessionMaxAgeSeconds({ rememberMe: parsed.data.rememberMe });
  const supabase = await createSupabaseServerClient({ sessionMaxAgeSeconds });

  const { error } = await supabase.auth.signInWithPassword({
    email: resolvedIdentifier.email,
    password: parsed.data.password,
  });

  if (error) {
    return mapSupabaseErrorToSignInResult();
  }

  const accountState = await getAccountStateByEmail(resolvedIdentifier.email);

  if ("errorCode" in accountState) {
    await supabase.auth.signOut();

    if (accountState.errorCode === "invalid_credentials") {
      return buildAuthFailure(
        "INVALID_CREDENTIALS",
        mapAuthFailureToUi({ kind: "invalid_credentials" }).message,
      );
    }

    return buildAuthFailure("SYSTEM_ERROR", mapAuthFailureToUi({ kind: "system" }).message);
  }

  if (accountState.profile.is_locked) {
    await supabase.auth.signOut();
    return buildAuthFailure("LOCKED_ACCOUNT", mapAuthFailureToUi({ kind: "locked" }).message);
  }

  if (accountState.profile.is_deactivated) {
    await supabase.auth.signOut();
    return buildAuthFailure(
      "DEACTIVATED_ACCOUNT",
      mapAuthFailureToUi({ kind: "deactivated" }).message,
    );
  }

  redirect("/dashboard");
}

export async function signInWithState(
  _previousState: SignInResult | null,
  formData: FormData,
): Promise<SignInResult> {
  return signIn(formData);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
