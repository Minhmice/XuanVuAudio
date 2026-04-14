"use server";

import { redirect } from "next/navigation";

import { getSessionMaxAgeSeconds } from "@/app/lib/auth/session-duration";
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
    fieldErrors.identifier = "Vui lòng nhập email hoặc tên đăng nhập.";
  }

  if (!password) {
    fieldErrors.password = "Vui lòng nhập mật khẩu.";
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

function mapSupabaseErrorToSignInResult(errorMessage: string): SignInResult {
  const normalized = errorMessage.toLowerCase();

  if (normalized.includes("locked")) {
    return {
      ok: false,
      error: {
        code: "LOCKED_ACCOUNT",
        message: "Tài khoản của bạn đang bị khóa. Vui lòng liên hệ quản trị viên.",
      },
    };
  }

  if (normalized.includes("deactivated") || normalized.includes("disabled")) {
    return {
      ok: false,
      error: {
        code: "DEACTIVATED_ACCOUNT",
        message: "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.",
      },
    };
  }

  if (normalized.includes("invalid") || normalized.includes("credentials")) {
    return {
      ok: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Thông tin đăng nhập không đúng. Vui lòng thử lại.",
      },
    };
  }

  return {
    ok: false,
    error: {
      code: "SYSTEM_ERROR",
      message:
        "Không thể đăng nhập lúc này. Vui lòng thử lại sau hoặc liên hệ quản trị viên.",
    },
  };
}

export async function signIn(formDataOrPayload: FormData | SignInPayload): Promise<SignInResult> {
  const { identifier, password, rememberMe } = getSignInPayload(formDataOrPayload);

  if (!identifier || !password) {
    return buildValidationError(identifier, password);
  }

  const sessionMaxAgeSeconds = getSessionMaxAgeSeconds({ rememberMe });
  const supabase = await createSupabaseServerClient({ sessionMaxAgeSeconds });

  const { error } = await supabase.auth.signInWithPassword({
    email: identifier,
    password,
  });

  if (error) {
    return mapSupabaseErrorToSignInResult(error.message);
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
