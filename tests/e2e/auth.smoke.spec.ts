import { test, expect } from "@playwright/test";

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "E2E_INTERNAL_EMAIL",
  "E2E_INTERNAL_PASSWORD",
] as const;

const missingVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
const shouldSkip = missingVars.length > 0;

test.describe("auth smoke placeholder", () => {
  test("launches and reaches local root when env is configured", async ({ page }) => {
    test.skip(
      shouldSkip,
      `Skipping smoke placeholder. Missing required env vars: ${missingVars.join(", ")}`,
    );

    const response = await page.goto("http://localhost:3000/", {
      waitUntil: "domcontentloaded",
    });

    expect(response).not.toBeNull();
  });
});
