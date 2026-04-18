export type ShowroomInventoryLine = {
  productId: string;
  name: string;
  slug: string;
  quantityOnHand: number;
};

export type InventoryAdjustmentListItem = {
  id: string;
  createdAt: string;
  productName: string;
  productSlug: string;
  quantityBefore: number;
  quantityAfter: number;
  note: string | null;
  actorLabel: string;
};

/** Sparse ledger rows for order-ops UI (one row per showroom × product with inventory). */
export type OrderInventoryShowroomRow = {
  productId: string;
  productName: string;
  productSlug: string;
  showroomId: string;
  showroomName: string;
  quantityOnHand: number;
};
