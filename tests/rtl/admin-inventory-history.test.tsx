import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { InventoryAdjustmentListItem } from "@/app/lib/inventory/types";
import { ShowroomAdjustmentHistory } from "@/components/admin/ShowroomAdjustmentHistory";

const sample: InventoryAdjustmentListItem[] = [
  {
    id: "a1",
    createdAt: "2026-04-18T12:00:00.000Z",
    productName: "SP A",
    productSlug: "sp-a",
    quantityBefore: 1,
    quantityAfter: 2,
    note: "Nhập hàng",
    actorLabel: "staff@example.com",
  },
];

describe("ShowroomAdjustmentHistory", () => {
  it("shows empty state", () => {
    render(<ShowroomAdjustmentHistory items={[]} />);
    expect(screen.getByTestId("adjustment-history-empty")).toBeInTheDocument();
  });

  it("renders rows", () => {
    render(<ShowroomAdjustmentHistory items={sample} />);
    expect(screen.getByTestId("adjustment-history")).toBeInTheDocument();
    expect(screen.getByText("SP A")).toBeInTheDocument();
    expect(screen.getByText("Nhập hàng")).toBeInTheDocument();
    expect(screen.getByText("1 → 2")).toBeInTheDocument();
  });
});
