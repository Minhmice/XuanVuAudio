import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { HomeProduct } from "@/app/lib/storefront/homepage";
import { ProductSearchView } from "@/components/storefront/ProductSearchView";

const sampleProduct: HomeProduct = {
  id: "1",
  name: "Sample",
  slug: "sample",
  description: null,
  imageUrl: null,
  priceSellingVnd: 100000,
  priceCompareAtVnd: null,
  brandName: "Brand",
};

describe("ProductSearchView", () => {
  it("shows hint when query is empty", () => {
    render(
      <ProductSearchView products={[]} normalizedQuery="" />,
    );
    expect(screen.getByTestId("search-hint")).toBeInTheDocument();
  });

  it("shows empty state when no products", () => {
    render(<ProductSearchView products={[]} normalizedQuery="tai" />);
    expect(screen.getByTestId("search-empty")).toBeInTheDocument();
  });

  it("renders grid when products exist", () => {
    render(
      <ProductSearchView products={[sampleProduct]} normalizedQuery="sam" />,
    );
    expect(screen.getByTestId("search-grid")).toBeInTheDocument();
    expect(screen.getByText("Sample")).toBeInTheDocument();
  });
});
