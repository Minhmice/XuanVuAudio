import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { GetCurrentUserRoleResult } from "@/app/lib/auth/role";

let mockedRoleResult: GetCurrentUserRoleResult = { role: "staff" };

vi.mock("@/app/lib/auth/role", () => ({
  getCurrentUserRole: vi.fn(() => Promise.resolve(mockedRoleResult)),
}));

// Suppress Next.js server-only module errors in jsdom
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}));

beforeEach(() => {
  mockedRoleResult = { role: "staff" };
});

afterEach(() => {
  cleanup();
});

describe("dashboard role badge", () => {
  it("renders admin role badge for admin role", async () => {
    mockedRoleResult = { role: "admin" };

    const DashboardPage = (await import("@/app/(internal)/dashboard/page")).default;
    render(await DashboardPage());

    const badge = screen.getByTestId("role-badge");
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toBe("Quản trị viên");
  });

  it("renders staff role badge for staff role", async () => {
    mockedRoleResult = { role: "staff" };

    const DashboardPage = (await import("@/app/(internal)/dashboard/page")).default;
    render(await DashboardPage());

    const badge = screen.getByTestId("role-badge");
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toBe("Nhân viên");
  });

  it("renders without badge when role resolution returns an error", async () => {
    mockedRoleResult = { error: "unauthenticated" };

    const DashboardPage = (await import("@/app/(internal)/dashboard/page")).default;
    render(await DashboardPage());

    expect(screen.queryByTestId("role-badge")).not.toBeInTheDocument();
  });

  it("renders the dashboard heading regardless of role", async () => {
    mockedRoleResult = { role: "admin" };

    const DashboardPage = (await import("@/app/(internal)/dashboard/page")).default;
    render(await DashboardPage());

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe("Bảng điều khiển nội bộ");
  });
});
