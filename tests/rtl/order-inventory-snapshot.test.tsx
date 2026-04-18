import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { OrderInventoryShowroomRow } from "@/app/lib/inventory/types";
import { OrderInventorySnapshot } from "@/components/admin/OrderInventorySnapshot";

afterEach(() => {
  cleanup();
});

const rowsSample: OrderInventoryShowroomRow[] = [
  {
    productId: "p1",
    productName: "Tai nghe A",
    productSlug: "tai-nghe-a",
    showroomId: "s1",
    showroomName: "HCM",
    quantityOnHand: 2,
  },
];

describe("OrderInventorySnapshot", () => {
  it("renders table when rows exist", () => {
    render(
      <OrderInventorySnapshot
        rows={rowsSample}
        orderLines={[{ productId: "p1", name: "Tai nghe A" }]}
      />,
    );
    expect(screen.getByTestId("order-inventory-snapshot")).toBeInTheDocument();
    expect(screen.getByText("HCM")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows missing ledger message when product has no rows", () => {
    render(
      <OrderInventorySnapshot
        rows={[]}
        orderLines={[{ productId: "p9", name: "Loa B" }]}
      />,
    );
    expect(screen.getByText("Loa B")).toBeInTheDocument();
    expect(screen.getByText(/Chưa có bản ghi tồn kho/)).toBeInTheDocument();
  });

  it("shows empty order copy", () => {
    render(<OrderInventorySnapshot rows={[]} orderLines={[]} />);
    expect(screen.getByText(/Không có sản phẩm trên đơn/)).toBeInTheDocument();
  });
});
