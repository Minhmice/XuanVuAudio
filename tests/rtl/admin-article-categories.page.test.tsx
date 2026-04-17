import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RequireStaffRoleResult } from "@/app/lib/auth/role";

let mockedGuardResult: RequireStaffRoleResult = { ok: true };

vi.mock("@/app/lib/auth/role", () => ({
  requireStaffRole: vi.fn(() => Promise.resolve(mockedGuardResult)),
}));

const listArticleCategories = vi.fn();

vi.mock("@/app/actions/article-categories", () => ({
  listArticleCategories: (...args: unknown[]) => listArticleCategories(...args),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}));

beforeEach(() => {
  mockedGuardResult = { ok: true };
  listArticleCategories.mockResolvedValue({ ok: true, data: [] });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("/admin/article-categories page", () => {
  it("renders forbidden message when guard fails", async () => {
    mockedGuardResult = { ok: false, reason: "forbidden" };

    const Page = (await import("@/app/(internal)/admin/article-categories/page")).default;
    render(await Page());

    expect(screen.getByTestId("forbidden-message")).toBeInTheDocument();
  });

  it("renders empty state when no categories", async () => {
    mockedGuardResult = { ok: true };
    listArticleCategories.mockResolvedValue({ ok: true, data: [] });

    const Page = (await import("@/app/(internal)/admin/article-categories/page")).default;
    render(await Page());

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("renders table when categories exist", async () => {
    mockedGuardResult = { ok: true };
    listArticleCategories.mockResolvedValue({
      ok: true,
      data: [
        {
          id: "cat-1",
          name: "Tin tức",
          slug: "tin-tuc",
          description: null,
          createdAt: "2026-01-01T00:00:00Z",
        },
      ],
    });

    const Page = (await import("@/app/(internal)/admin/article-categories/page")).default;
    render(await Page());

    expect(screen.getByTestId("article-categories-table")).toBeInTheDocument();
    expect(screen.getAllByTestId("article-category-row")).toHaveLength(1);
  });
});

