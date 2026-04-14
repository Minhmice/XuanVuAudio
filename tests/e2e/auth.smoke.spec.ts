import { expect, test } from "@playwright/test";

const skipReason = process.env.E2E_AUTH_SMOKE_SKIP_REASON;
const email = process.env.E2E_INTERNAL_EMAIL;
const password = process.env.E2E_INTERNAL_PASSWORD;

test.describe("auth smoke", () => {
  test.beforeEach(() => {
    test.skip(Boolean(skipReason), skipReason ?? "");
  });

  test("redirects unauthenticated user from /dashboard to /login", async ({ page }) => {
    await page.context().clearCookies();

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Đăng nhập nội bộ" })).toBeVisible();
  });

  test("logs in with provisioned credentials and lands on /dashboard", async ({ page }) => {
    test.skip(!email || !password, "E2E credentials are unavailable");

    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await page.getByLabel("Email hoặc tên đăng nhập").fill(email!);
    await page.getByLabel("Mật khẩu").fill(password!);
    await page.getByLabel("Ghi nhớ đăng nhập").check();
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: "Bảng điều khiển nội bộ" })).toBeVisible();
  });
});
