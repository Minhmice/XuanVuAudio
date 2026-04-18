import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RequireStaffRoleResult } from "@/app/lib/auth/role";

let mockedGuardResult: RequireStaffRoleResult = { ok: true };

vi.mock("@/app/lib/auth/role", () => ({
  requireStaffRole: vi.fn(() => Promise.resolve(mockedGuardResult)),
}));

const listShowrooms = vi.fn();

vi.mock("@/app/actions/showrooms", () => ({
  listShowrooms: (...args: unknown[]) => listShowrooms(...args),
}));

vi.mock("server-only", () => ({}));

beforeEach(() => {
  mockedGuardResult = { ok: true };
  listShowrooms.mockResolvedValue({ ok: true, data: [] });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("/admin/inventory page", () => {
  it("renders forbidden when guard fails", async () => {
    mockedGuardResult = { ok: false, reason: "forbidden" };

    const Page = (await import("@/app/(internal)/admin/inventory/page")).default;
    render(await Page());

    expect(screen.getByTestId("forbidden-message")).toBeInTheDocument();
  });

  it("renders empty state when no showrooms", async () => {
    mockedGuardResult = { ok: true };
    listShowrooms.mockResolvedValue({ ok: true, data: [] });

    const Page = (await import("@/app/(internal)/admin/inventory/page")).default;
    render(await Page());

    expect(screen.getByTestId("inventory-index-empty")).toBeInTheDocument();
  });

  it("renders showroom links", async () => {
    mockedGuardResult = { ok: true };
    listShowrooms.mockResolvedValue({
      ok: true,
      data: [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "HCM",
          address: "Q1",
          phone: "090",
          createdAt: "2020-01-01T00:00:00.000Z",
          updatedAt: "2020-01-01T00:00:00.000Z",
        },
      ],
    });

    const Page = (await import("@/app/(internal)/admin/inventory/page")).default;
    render(await Page());

    expect(screen.getByTestId("inventory-showrooms-table")).toBeInTheDocument();
    const link = screen.getByTestId("inventory-showroom-link");
    expect(link).toHaveAttribute("href", "/admin/inventory/550e8400-e29b-41d4-a716-446655440001");
  });
});
