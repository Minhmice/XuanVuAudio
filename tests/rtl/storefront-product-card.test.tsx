import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(() => {
  cleanup();
});

import type { HomeProduct } from "@/app/lib/storefront/homepage";
import { StorefrontProductCard } from "@/components/storefront/StorefrontProductCard";

const base: HomeProduct = {
  id: "1",
  name: "Sample",
  slug: "sample",
  description: null,
  imageUrl: null,
  priceSellingVnd: 100000,
  priceCompareAtVnd: null,
  brandName: "Brand",
};

describe("StorefrontProductCard", () => {
  it("renders availability when set", () => {
    render(
      <StorefrontProductCard product={{ ...base, availabilityLabelVi: "Còn hàng" }} />,
    );
    expect(screen.getByTestId("product-availability")).toHaveTextContent("Còn hàng");
  });

  it("renders Hết hàng", () => {
    render(
      <StorefrontProductCard product={{ ...base, availabilityLabelVi: "Hết hàng" }} />,
    );
    expect(screen.getByTestId("product-availability")).toHaveTextContent("Hết hàng");
  });

  it("omits line when availability omitted", () => {
    render(<StorefrontProductCard product={base} />);
    expect(screen.queryByTestId("product-availability")).not.toBeInTheDocument();
  });
});
