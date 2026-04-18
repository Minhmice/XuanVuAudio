import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { HomepageData } from "@/app/lib/storefront/homepage";
import { HomePage } from "@/components/storefront/HomePage";

const emptyData: HomepageData = {
  brands: [],
  featuredProducts: [],
  newProducts: [],
  recommendedProducts: [],
  articles: [],
  showrooms: [],
  policyLinks: [],
};

const sampleData: HomepageData = {
  brands: [{ id: "1", name: "Brand A", slug: "brand-a", logoUrl: null }],
  featuredProducts: [
    {
      id: "p1",
      name: "Product One",
      slug: "product-one",
      imageUrl: null,
      priceSellingVnd: 100000,
      priceCompareAtVnd: null,
      brandName: "Brand B",
    },
  ],
  newProducts: [],
  recommendedProducts: [],
  articles: [
    {
      id: "a1",
      title: "News",
      slug: "news",
      excerpt: "Excerpt",
      coverImageUrl: null,
      publishedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  showrooms: [{ id: "s1", name: "Showroom 1", address: "Addr", phone: "0900" }],
  policyLinks: [{ key: "contact", title: "Liên hệ", slug: "lien-he" }],
};

afterEach(() => {
  cleanup();
});

describe("HomePage (storefront)", () => {
  it("renders hero and empty sections", () => {
    render(<HomePage data={emptyData} />);
    expect(screen.getByTestId("home-hero")).toBeInTheDocument();
    expect(screen.getByText("Chưa có thương hiệu hiển thị.")).toBeInTheDocument();
  });

  it("renders populated brands, products, articles, showrooms, policy links", () => {
    render(<HomePage data={sampleData} />);
    expect(screen.getByText("Brand A")).toBeInTheDocument();
    expect(screen.getByText("Product One")).toBeInTheDocument();
    expect(screen.getByText("Brand B")).toBeInTheDocument();
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Showroom 1")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Liên hệ" })).toHaveAttribute("href", "/policy/lien-he");
  });
});
