import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/danh-muc/tai-nghe",
}));

import type { CategoryListingData } from "@/app/lib/storefront/category-listing";
import { CategoryListingPage } from "@/components/storefront/CategoryListingPage";

const minimal: CategoryListingData = {
  category: { id: "1", name: "Tai nghe", slug: "tai-nghe" },
  products: [],
  brandFacets: [],
  priceExtent: { min: null, max: null },
  connectionFacets: [],
  physicalFacets: [],
  featureFacets: [],
  filters: { brandSlugs: [], minPrice: null, maxPrice: null, spec: {} },
  sort: "featured",
};

describe("CategoryListingPage", () => {
  it("renders title and empty state", () => {
    render(<CategoryListingPage data={minimal} />);
    expect(screen.getByTestId("category-title")).toHaveTextContent("Tai nghe");
    expect(screen.getByTestId("listing-empty")).toBeInTheDocument();
  });
});
