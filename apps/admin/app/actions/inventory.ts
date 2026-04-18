"use server";

import { revalidatePath } from "next/cache";

import { requireStaffRole } from "@xuanvu/shared/auth/role";
import { inventoryQuantityChanged } from "@xuanvu/shared/inventory/adjustment-logic";
import type {
  InventoryAdjustmentListItem,
  OrderInventoryShowroomRow,
  ShowroomInventoryLine,
} from "@xuanvu/shared/inventory/types";
import { isUuidString, parseNonNegativeInt } from "@xuanvu/shared/inventory/validation";
import { createSupabaseAdminClient } from "@xuanvu/shared/supabase/admin";
import { createSupabaseServerClient } from "@xuanvu/shared/supabase/server";

export type { InventoryAdjustmentListItem, ShowroomInventoryLine } from "@xuanvu/shared/inventory/types";

export type InventoryActionError = {
  code: "FORBIDDEN" | "UNAUTHENTICATED" | "SYSTEM_ERROR" | "NOT_FOUND" | "VALIDATION";
  message: string;
};

export type InventoryActionResult<T> = { ok: true; data: T } | { ok: false; error: InventoryActionError };

const ADJUSTMENT_LIST_DEFAULT_LIMIT = 50;
const ADJUSTMENT_LIST_MAX = 100;
/** Max distinct product IDs per order-ops inventory query (Phase 18). */
const ORDER_OPS_PRODUCT_IDS_MAX = 50;

function unauthenticatedError(): InventoryActionResult<never> {
  return {
    ok: false,
    error: { code: "UNAUTHENTICATED", message: "Vui lòng đăng nhập." },
  };
}

function forbiddenError(): InventoryActionResult<never> {
  return {
    ok: false,
    error: { code: "FORBIDDEN", message: "Bạn không có quyền thực hiện hành động này." },
  };
}

function systemError(): InventoryActionResult<never> {
  return {
    ok: false,
    error: { code: "SYSTEM_ERROR", message: "Lỗi hệ thống. Vui lòng thử lại sau." },
  };
}

function notFoundError(): InventoryActionResult<never> {
  return {
    ok: false,
    error: { code: "NOT_FOUND", message: "Không tìm thấy dữ liệu." },
  };
}

function validationError(message: string): InventoryActionResult<never> {
  return {
    ok: false,
    error: { code: "VALIDATION", message },
  };
}

function mapGuardError(
  guard: Awaited<ReturnType<typeof requireStaffRole>>,
): InventoryActionResult<never> | null {
  if (guard.ok) return null;
  if (guard.reason === "unauthenticated") return unauthenticatedError();
  if (guard.reason === "forbidden") return forbiddenError();
  return systemError();
}

type ProductRow = {
  id: string;
  name: string;
  slug: string;
};

type InventoryRow = {
  product_id: string;
  quantity_on_hand: number;
};

type AdjustmentRowDb = {
  id: string;
  created_at: string;
  quantity_before: number;
  quantity_after: number;
  note: string | null;
  created_by: string;
  catalog_products: { name: string; slug: string } | null;
};

type ProfileRow = {
  user_id: string;
  email: string;
  username: string;
};

function actorLabelFromProfile(p: ProfileRow | undefined, userId: string): string {
  if (!p) return userId.slice(0, 8);
  return p.email || p.username || userId.slice(0, 8);
}

/**
 * Non-archived products with coalesced quantity for one showroom (missing row → 0).
 */
export async function listShowroomInventoryLines(
  showroomId: string,
): Promise<InventoryActionResult<ShowroomInventoryLine[]>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!showroomId || !isUuidString(showroomId)) {
    return validationError("Showroom không hợp lệ.");
  }

  try {
    const admin = createSupabaseAdminClient();

    const { data: showroom, error: srErr } = await admin
      .from("showrooms")
      .select("id")
      .eq("id", showroomId)
      .maybeSingle<{ id: string }>();

    if (srErr) return systemError();
    if (!showroom) return notFoundError();

    const { data: products, error: pErr } = await admin
      .from("catalog_products")
      .select("id, name, slug")
      .in("status", ["active", "inactive"])
      .order("name", { ascending: true });

    if (pErr) return systemError();

    const productList = (products ?? []) as ProductRow[];
    if (productList.length === 0) {
      return { ok: true, data: [] };
    }

    const ids = productList.map((p) => p.id);

    const { data: invRows, error: iErr } = await admin
      .from("showroom_inventory")
      .select("product_id, quantity_on_hand")
      .eq("showroom_id", showroomId)
      .in("product_id", ids);

    if (iErr) return systemError();

    const qtyByProduct = new Map<string, number>();
    for (const r of (invRows ?? []) as InventoryRow[]) {
      qtyByProduct.set(r.product_id, r.quantity_on_hand);
    }

    const lines: ShowroomInventoryLine[] = productList.map((p) => ({
      productId: p.id,
      name: p.name,
      slug: p.slug,
      quantityOnHand: qtyByProduct.get(p.id) ?? 0,
    }));

    return { ok: true, data: lines };
  } catch {
    return systemError();
  }
}

/**
 * Per-showroom on-hand rows for a set of products (sparse: only pairs that exist in `showroom_inventory`).
 * Staff-only; used by order operations UI (Phase 18).
 */
export async function listInventoryByProductsForOrderOps(
  productIds: string[],
): Promise<InventoryActionResult<OrderInventoryShowroomRow[]>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  const unique = [...new Set(productIds.map((id) => String(id).trim()).filter(Boolean))];
  const validIds = unique.filter((id) => isUuidString(id)).slice(0, ORDER_OPS_PRODUCT_IDS_MAX);

  if (validIds.length === 0) {
    return { ok: true, data: [] };
  }

  try {
    const admin = createSupabaseAdminClient();

    const { data, error } = await admin.from("showroom_inventory").select(`
        product_id,
        quantity_on_hand,
        showrooms ( id, name ),
        catalog_products ( id, name, slug )
      `).in("product_id", validIds);

    if (error) return systemError();

    type InvEmbedRow = {
      product_id: string;
      quantity_on_hand: number;
      showrooms: { id: string; name: string } | null;
      catalog_products: { id: string; name: string; slug: string } | null;
    };

    const raw = (data ?? []) as unknown as InvEmbedRow[];
    const out: OrderInventoryShowroomRow[] = [];

    for (const row of raw) {
      const sr = row.showrooms;
      const pr = row.catalog_products;
      if (!sr || !pr) continue;
      out.push({
        productId: row.product_id,
        productName: pr.name,
        productSlug: pr.slug,
        showroomId: sr.id,
        showroomName: sr.name,
        quantityOnHand: row.quantity_on_hand,
      });
    }

    out.sort((a, b) => {
      const byProduct = a.productName.localeCompare(b.productName, "vi");
      if (byProduct !== 0) return byProduct;
      return a.showroomName.localeCompare(b.showroomName, "vi");
    });

    return { ok: true, data: out };
  } catch {
    return systemError();
  }
}

/**
 * Recent adjustment events for a showroom (newest first).
 */
export async function listShowroomInventoryAdjustments(
  showroomId: string,
  options: { limit?: number } = {},
): Promise<InventoryActionResult<InventoryAdjustmentListItem[]>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!showroomId || !isUuidString(showroomId)) {
    return validationError("Showroom không hợp lệ.");
  }

  const limit = Math.min(
    Math.max(options.limit ?? ADJUSTMENT_LIST_DEFAULT_LIMIT, 1),
    ADJUSTMENT_LIST_MAX,
  );

  try {
    const admin = createSupabaseAdminClient();

    const { data: showroom, error: srErr } = await admin
      .from("showrooms")
      .select("id")
      .eq("id", showroomId)
      .maybeSingle<{ id: string }>();

    if (srErr) return systemError();
    if (!showroom) return notFoundError();

    const { data: rows, error: adjErr } = await admin
      .from("showroom_inventory_adjustments")
      .select(
        "id, created_at, quantity_before, quantity_after, note, created_by, catalog_products(name, slug)",
      )
      .eq("showroom_id", showroomId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (adjErr) return systemError();

    const list = (rows ?? []) as unknown as AdjustmentRowDb[];
    if (list.length === 0) {
      return { ok: true, data: [] };
    }

    const actorIds = [...new Set(list.map((r) => r.created_by))];

    const { data: profiles, error: prErr } = await admin
      .from("internal_user_profiles")
      .select("user_id, email, username")
      .in("user_id", actorIds);

    if (prErr) return systemError();

    const profileByUser = new Map<string, ProfileRow>();
    for (const p of (profiles ?? []) as ProfileRow[]) {
      profileByUser.set(p.user_id, p);
    }

    const items: InventoryAdjustmentListItem[] = list.map((r) => {
      const prod = r.catalog_products;
      return {
        id: r.id,
        createdAt: r.created_at,
        productName: prod?.name ?? "—",
        productSlug: prod?.slug ?? "",
        quantityBefore: r.quantity_before,
        quantityAfter: r.quantity_after,
        note: r.note,
        actorLabel: actorLabelFromProfile(profileByUser.get(r.created_by), r.created_by),
      };
    });

    return { ok: true, data: items };
  } catch {
    return systemError();
  }
}

export async function upsertShowroomInventoryLine(input: {
  showroomId: string;
  productId: string;
  quantityOnHand: number;
  note?: string | null;
}): Promise<InventoryActionResult<null>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  const { showroomId, productId } = input;
  if (!showroomId || !isUuidString(showroomId) || !productId || !isUuidString(productId)) {
    return validationError("Dữ liệu không hợp lệ.");
  }

  const qty = input.quantityOnHand;
  if (!Number.isInteger(qty) || qty < 0) {
    return validationError("Số lượng phải là số nguyên ≥ 0.");
  }

  const noteRaw = input.note == null ? "" : String(input.note);
  const noteTrimmed = noteRaw.trim();
  const note = noteTrimmed === "" ? null : noteTrimmed;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return unauthenticatedError();
    }

    const admin = createSupabaseAdminClient();

    const { data: priorRow, error: priorErr } = await admin
      .from("showroom_inventory")
      .select("quantity_on_hand")
      .eq("showroom_id", showroomId)
      .eq("product_id", productId)
      .maybeSingle<{ quantity_on_hand: number }>();

    if (priorErr) return systemError();

    const priorQty = priorRow?.quantity_on_hand ?? 0;

    if (!inventoryQuantityChanged(priorQty, qty)) {
      return { ok: true, data: null };
    }

    const { error: insErr } = await admin.from("showroom_inventory_adjustments").insert({
      showroom_id: showroomId,
      product_id: productId,
      quantity_before: priorQty,
      quantity_after: qty,
      note,
      created_by: user.id,
    });

    if (insErr) return systemError();

    const now = new Date().toISOString();

    const { error: upErr } = await admin.from("showroom_inventory").upsert(
      {
        showroom_id: showroomId,
        product_id: productId,
        quantity_on_hand: qty,
        updated_at: now,
      },
      { onConflict: "showroom_id,product_id" },
    );

    if (upErr) return systemError();

    revalidatePath("/admin/inventory");
    revalidatePath(`/admin/inventory/${showroomId}`);

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function upsertShowroomInventoryLineFormAction(
  formData: FormData,
): Promise<InventoryActionResult<null>> {
  const showroomId = String(formData.get("showroomId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  const qty = parseNonNegativeInt(formData.get("quantityOnHand"));
  if (qty === null) {
    return validationError("Số lượng không hợp lệ.");
  }
  const noteRaw = String(formData.get("note") ?? "");
  return upsertShowroomInventoryLine({
    showroomId,
    productId,
    quantityOnHand: qty,
    note: noteRaw,
  });
}
