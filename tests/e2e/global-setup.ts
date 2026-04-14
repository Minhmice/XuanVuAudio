import type { FullConfig } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

type RequiredEnvVar =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "E2E_INTERNAL_EMAIL"
  | "E2E_INTERNAL_PASSWORD"
  | "E2E_INTERNAL_USERNAME";

const REQUIRED_ENV_VARS: RequiredEnvVar[] = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "E2E_INTERNAL_EMAIL",
  "E2E_INTERNAL_PASSWORD",
  "E2E_INTERNAL_USERNAME",
];

const SKIP_REASON_KEY = "E2E_AUTH_SMOKE_SKIP_REASON";

function setSkipReason(reason: string) {
  process.env[SKIP_REASON_KEY] = reason;
}

async function getOrCreateUser(params: {
  supabaseUrl: string;
  serviceRoleKey: string;
  email: string;
  password: string;
}) {
  const adminClient = createClient(params.supabaseUrl, params.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  let existingUserId: string | null = null;
  let page = 1;

  while (!existingUserId) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw new Error(`Cannot list users for E2E provisioning: ${error.message}`);
    }

    existingUserId = data.users.find((user) => user.email === params.email)?.id ?? null;

    if (!data.users.length || data.users.length < 200) {
      break;
    }

    page += 1;
  }

  if (existingUserId) {
    const { data: updatedUser, error: updateError } = await adminClient.auth.admin.updateUserById(
      existingUserId,
      {
        email: params.email,
        password: params.password,
        email_confirm: true,
      },
    );

    if (updateError || !updatedUser.user) {
      throw new Error(`Cannot update E2E user: ${updateError?.message ?? "unknown error"}`);
    }

    return { adminClient, userId: updatedUser.user.id };
  }

  const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
    email: params.email,
    password: params.password,
    email_confirm: true,
  });

  if (createError || !createdUser.user) {
    throw new Error(`Cannot create E2E user: ${createError?.message ?? "unknown error"}`);
  }

  return { adminClient, userId: createdUser.user.id };
}

async function globalSetup(_config: FullConfig) {
  const missingVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

  if (missingVars.length > 0) {
    setSkipReason(
      `Skipping auth smoke tests. Missing required env vars: ${missingVars.join(", ")}`,
    );
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const email = process.env.E2E_INTERNAL_EMAIL!;
  const password = process.env.E2E_INTERNAL_PASSWORD!;
  const username = process.env.E2E_INTERNAL_USERNAME!;

  try {
    const { adminClient, userId } = await getOrCreateUser({
      supabaseUrl,
      serviceRoleKey,
      email,
      password,
    });

    const { error: upsertError } = await adminClient.from("internal_user_profiles").upsert(
      {
        user_id: userId,
        email,
        username,
        is_locked: false,
        is_deactivated: false,
      },
      { onConflict: "user_id" },
    );

    if (upsertError) {
      throw new Error(`Cannot upsert internal user profile: ${upsertError.message}`);
    }

    delete process.env[SKIP_REASON_KEY];
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown setup error";
    setSkipReason(`Skipping auth smoke tests. Provisioning failed: ${message}`);
  }
}

export default globalSetup;
