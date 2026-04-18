type IdentifierKind = "email" | "username";

type ValidationField = "identifier" | "password";

type UiErrorCode =
  | "validation"
  | "invalid_credentials"
  | "locked"
  | "deactivated"
  | "system";

export type UiMappedError = {
  type: "field" | "alert";
  code: UiErrorCode;
  message: string;
};

type AuthFailureInput =
  | { kind: "validation"; field: ValidationField }
  | { kind: "invalid_credentials" }
  | { kind: "locked" }
  | { kind: "deactivated" }
  | { kind: "system" };

export type NormalizedIdentifier = {
  kind: IdentifierKind;
  value: string;
};

type UsernameLookupRow = {
  email: string | null;
};

type UsernameLookupResult = {
  data: UsernameLookupRow | null;
  error: { message?: string } | null;
};

type IdentifierLookupClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<UsernameLookupResult>;
      };
    };
  };
};

type ResolveIdentifierParams = {
  identifier: NormalizedIdentifier;
  adminClient?: IdentifierLookupClient;
};

const UI_MESSAGES = {
  validation: {
    identifier: "Vui lòng nhập email hoặc tên đăng nhập.",
    password: "Vui lòng nhập mật khẩu.",
  },
  invalidCredentials: "Thông tin đăng nhập không đúng. Vui lòng thử lại.",
  locked: "Tài khoản của bạn đang bị khóa. Vui lòng liên hệ quản trị viên.",
  deactivated: "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.",
  system: "Không thể đăng nhập lúc này. Vui lòng thử lại sau hoặc liên hệ quản trị viên.",
} as const;

export function normalizeIdentifier(raw: string): NormalizedIdentifier {
  const trimmed = raw.trim();

  if (trimmed.includes("@")) {
    return {
      kind: "email",
      value: trimmed.toLowerCase(),
    };
  }

  return {
    kind: "username",
    value: trimmed,
  };
}

export function mapAuthFailureToUi(input: AuthFailureInput): UiMappedError {
  switch (input.kind) {
    case "validation":
      return {
        type: "field",
        code: "validation",
        message: UI_MESSAGES.validation[input.field],
      };
    case "invalid_credentials":
      return {
        type: "alert",
        code: "invalid_credentials",
        message: UI_MESSAGES.invalidCredentials,
      };
    case "locked":
      return {
        type: "alert",
        code: "locked",
        message: UI_MESSAGES.locked,
      };
    case "deactivated":
      return {
        type: "alert",
        code: "deactivated",
        message: UI_MESSAGES.deactivated,
      };
    default:
      return {
        type: "alert",
        code: "system",
        message: UI_MESSAGES.system,
      };
  }
}

async function getLookupClient(): Promise<IdentifierLookupClient> {
  const { createSupabaseAdminClient } = await import("../supabase/admin");
  return createSupabaseAdminClient() as unknown as IdentifierLookupClient;
}

export async function resolveIdentifierToEmail(
  params: ResolveIdentifierParams,
): Promise<{ email: string } | { errorCode: "invalid_credentials" | "system" }> {
  if (params.identifier.kind === "email") {
    return { email: params.identifier.value };
  }

  const client = params.adminClient ?? (await getLookupClient());

  const { data, error } = await client
    .from("internal_user_profiles")
    .select("email")
    .eq("username", params.identifier.value)
    .maybeSingle();

  if (error) {
    return { errorCode: "system" };
  }

  if (!data?.email) {
    return { errorCode: "invalid_credentials" };
  }

  return { email: data.email.toLowerCase() };
}
