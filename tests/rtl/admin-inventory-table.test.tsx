import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/inventory", () => ({
  upsertShowroomInventoryLineFormAction: vi.fn(),
}));

import type { ShowroomInventoryLine } from "@/app/lib/inventory/types";
import { ShowroomInventoryTable } from "@/components/admin/ShowroomInventoryTable";

afterEach(() => {
  cleanup();
});

const lines: ShowroomInventoryLine[] = [
  { productId: "p1", name: "Tai nghe A", slug: "tai-nghe-a", quantityOnHand: 3 },
];

describe("ShowroomInventoryTable", () => {
  it("renders filter and rows", () => {
    render(<ShowroomInventoryTable showroomId="550e8400-e29b-41d4-a716-446655440000" lines={lines} />);

    expect(screen.getByTestId("inventory-filter")).toBeInTheDocument();
    expect(screen.getByTestId("inventory-table")).toBeInTheDocument();
    expect(screen.getByText("Tai nghe A")).toBeInTheDocument();
  });

  it("filters by name", () => {
    render(
      <ShowroomInventoryTable
        showroomId="550e8400-e29b-41d4-a716-446655440000"
        lines={[
          ...lines,
          { productId: "p2", name: "Loa B", slug: "loa-b", quantityOnHand: 0 },
        ]}
      />,
    );

    const input = screen.getByTestId("inventory-filter");
    fireEvent.change(input, { target: { value: "Loa" } });
    expect(screen.queryByText("Tai nghe A")).not.toBeInTheDocument();
    expect(screen.getByText("Loa B")).toBeInTheDocument();
  });
});
