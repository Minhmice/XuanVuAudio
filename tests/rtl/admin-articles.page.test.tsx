import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RequireStaffRoleResult } from "@/app/lib/auth/role";

let mockedGuardResult: RequireStaffRoleResult = { ok: true };

vi.mock("@/app/lib/auth/role", () => ({
  requireStaffRole: vi.fn(() => Promise.resolve(mockedGuardResult)),
}));

const listArticles = vi.fn();

vi.mock("@/app/actions/articles", () => ({
  listArticles: (...args: unknown[]) => listArticles(...args),
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
  listArticles.mockResolvedValue({ ok: true, data: [] });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("/admin/articles page", () => {
  it("renders forbidden message when guard fails", async () => {
    mockedGuardResult = { ok: false, reason: "forbidden" };

    const Page = (await import("@/app/(internal)/admin/articles/page")).default;
    render(await Page());

    expect(screen.getByTestId("forbidden-message")).toBeInTheDocument();
  });

  it("renders empty state when no articles", async () => {
    mockedGuardResult = { ok: true };
    listArticles.mockResolvedValue({ ok: true, data: [] });

    const Page = (await import("@/app/(internal)/admin/articles/page")).default;
    render(await Page());

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("renders table when articles exist", async () => {
    mockedGuardResult = { ok: true };
    listArticles.mockResolvedValue({
      ok: true,
      data: [
        {
          id: "art-1",
          title: "Bài viết",
          slug: "bai-viet",
          status: "draft",
          authorName: null,
          categoryId: null,
          publishedAt: null,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-02T00:00:00Z",
        },
      ],
    });

    const Page = (await import("@/app/(internal)/admin/articles/page")).default;
    render(await Page());

    expect(screen.getByTestId("articles-table")).toBeInTheDocument();
    expect(screen.getAllByTestId("article-row")).toHaveLength(1);
  });
});

