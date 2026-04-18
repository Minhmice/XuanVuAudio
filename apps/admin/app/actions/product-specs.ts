"use server";

import { requireStaffRole } from "@xuanvu/shared/auth/role";
import { createSupabaseAdminClient } from "@xuanvu/shared/supabase/admin";

export type SpecValueType = "text" | "number" | "boolean";

export type SpecAttributeDefinition = {
  id: string;
  slug: string;
  labelVi: string;
  groupName: string;
  valueType: SpecValueType;
  sortOrder: number;
};

export type ProductSpecValueRow = {
  attributeId: string;
  valueType: SpecValueType;
  valueText: string | null;
  valueNumber: number | null;
  valueBoolean: boolean | null;
};

export type ProductSpecEditorGroup = {
  groupName: string;
  attributes: Array<
    SpecAttributeDefinition & {
      valueText: string | null;
      valueNumber: number | null;
      valueBoolean: boolean | null;
    }
  >;
};

export type ProductSpecActionError = {
  code: "FORBIDDEN" | "UNAUTHENTICATED" | "SYSTEM_ERROR" | "NOT_FOUND" | "CONFLICT" | "VALIDATION_ERROR";
  message: string;
};

export type ProductSpecActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ProductSpecActionError };

const MAX_SPECS_PER_PRODUCT = 50;

function unauthenticatedError(): ProductSpecActionResult<never> {
  return { ok: false, error: { code: "UNAUTHENTICATED", message: "Vui lòng đăng nhập." } };
}

function forbiddenError(): ProductSpecActionResult<never> {
  return {
    ok: false,
    error: { code: "FORBIDDEN", message: "Bạn không có quyền thực hiện hành động này." },
  };
}

function systemError(): ProductSpecActionResult<never> {
  return {
    ok: false,
    error: { code: "SYSTEM_ERROR", message: "Lỗi hệ thống. Vui lòng thử lại sau." },
  };
}

function notFoundError(message: string): ProductSpecActionResult<never> {
  return { ok: false, error: { code: "NOT_FOUND", message } };
}

function validationError(message: string): ProductSpecActionResult<never> {
  return { ok: false, error: { code: "VALIDATION_ERROR", message } };
}

function mapGuardError(
  guard: Awaited<ReturnType<typeof requireStaffRole>>,
): ProductSpecActionResult<never> | null {
  if (guard.ok) return null;
  if (guard.reason === "unauthenticated") return unauthenticatedError();
  if (guard.reason === "forbidden") return forbiddenError();
  return systemError();
}

type AttributeRow = {
  id: string;
  slug: string;
  label_vi: string;
  group_name: string;
  value_type: string;
  sort_order: number;
};

type ValueRow = {
  attribute_id: string;
  value_text: string | null;
  value_number: number | null;
  value_boolean: boolean | null;
  catalog_spec_attributes: { value_type: string };
};

function mapAttributeRow(row: AttributeRow): SpecAttributeDefinition {
  return {
    id: row.id,
    slug: row.slug,
    labelVi: row.label_vi,
    groupName: row.group_name,
    valueType: row.value_type as SpecValueType,
    sortOrder: row.sort_order,
  };
}

export async function listActiveSpecAttributes(): Promise<ProductSpecActionResult<SpecAttributeDefinition[]>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("catalog_spec_attributes")
      .select("id, slug, label_vi, group_name, value_type, sort_order")
      .eq("is_active", true)
      .order("group_name", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) return systemError();
    const rows = (data ?? []) as AttributeRow[];
    return { ok: true, data: rows.map(mapAttributeRow) };
  } catch {
    return systemError();
  }
}

export async function getProductSpecEditorState(
  productId: string,
): Promise<ProductSpecActionResult<ProductSpecEditorGroup[]>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!productId) return validationError("Sản phẩm không hợp lệ.");

  try {
    const admin = createSupabaseAdminClient();

    const { data: attrData, error: attrError } = await admin
      .from("catalog_spec_attributes")
      .select("id, slug, label_vi, group_name, value_type, sort_order")
      .eq("is_active", true)
      .order("group_name", { ascending: true })
      .order("sort_order", { ascending: true });

    if (attrError) return systemError();

    const { data: valData, error: valError } = await admin
      .from("catalog_product_spec_values")
      .select("attribute_id, value_text, value_number, value_boolean, catalog_spec_attributes(value_type)")
      .eq("product_id", productId);

    if (valError) return systemError();

    const attrs = (attrData ?? []) as AttributeRow[];
    const valRows = (valData ?? []) as unknown as ValueRow[];
    const byAttr = new Map<string, ValueRow>();
    for (const v of valRows) {
      byAttr.set(v.attribute_id, v);
    }

    const groupMap = new Map<string, ProductSpecEditorGroup["attributes"]>();

    for (const a of attrs) {
      const v = byAttr.get(a.id);
      const entry = {
        ...mapAttributeRow(a),
        valueText: v?.value_text ?? null,
        valueNumber: v?.value_number != null ? Number(v.value_number) : null,
        valueBoolean: v?.value_boolean ?? null,
      };
      const g = a.group_name;
      if (!groupMap.has(g)) groupMap.set(g, []);
      groupMap.get(g)!.push(entry);
    }

    const groups: ProductSpecEditorGroup[] = [...groupMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b, "vi"))
      .map(([groupName, attributes]) => ({ groupName, attributes }));

    return { ok: true, data: groups };
  } catch {
    return systemError();
  }
}

function parseValueForType(
  valueType: SpecValueType,
  raw: string,
): { valueText: string | null; valueNumber: number | null; valueBoolean: boolean | null } | null {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { valueText: null, valueNumber: null, valueBoolean: null };
  }
  if (valueType === "text") {
    return { valueText: trimmed, valueNumber: null, valueBoolean: null };
  }
  if (valueType === "number") {
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return null;
    return { valueText: null, valueNumber: n, valueBoolean: null };
  }
  if (valueType === "boolean") {
    if (trimmed === "true" || trimmed === "1" || trimmed === "có" || trimmed === "yes")
      return { valueText: null, valueNumber: null, valueBoolean: true };
    if (trimmed === "false" || trimmed === "0" || trimmed === "không" || trimmed === "no")
      return { valueText: null, valueNumber: null, valueBoolean: false };
    return null;
  }
  return null;
}

export async function upsertProductSpecValue(
  productId: string,
  attributeId: string,
  rawValue: string,
): Promise<ProductSpecActionResult<null>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!productId || !attributeId) return validationError("Thiếu thông tin sản phẩm hoặc thuộc tính.");

  try {
    const admin = createSupabaseAdminClient();

    const { count, error: cntError } = await admin
      .from("catalog_product_spec_values")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId);

    if (cntError) return systemError();

    const { data: attrRow, error: attrError } = await admin
      .from("catalog_spec_attributes")
      .select("id, value_type, is_active")
      .eq("id", attributeId)
      .maybeSingle();

    if (attrError) return systemError();
    if (!attrRow || !attrRow.is_active) return notFoundError("Thuộc tính không tồn tại hoặc đã tắt.");

    const valueType = attrRow.value_type as SpecValueType;
    const parsed = parseValueForType(valueType, rawValue);
    if (parsed === null) return validationError("Giá trị không đúng kiểu dữ liệu.");

    const isEmpty =
      parsed.valueText === null && parsed.valueNumber === null && parsed.valueBoolean === null;

    if (isEmpty) {
      const { error: delError } = await admin
        .from("catalog_product_spec_values")
        .delete()
        .eq("product_id", productId)
        .eq("attribute_id", attributeId);
      if (delError) return systemError();
      return { ok: true, data: null };
    }

    const { data: existing, error: existingError } = await admin
      .from("catalog_product_spec_values")
      .select("id")
      .eq("product_id", productId)
      .eq("attribute_id", attributeId)
      .maybeSingle();

    if (existingError) return systemError();

    if (!existing && (count ?? 0) >= MAX_SPECS_PER_PRODUCT) {
      return validationError(`Tối đa ${MAX_SPECS_PER_PRODUCT} thông số trên một sản phẩm.`);
    }

    const payload = {
      product_id: productId,
      attribute_id: attributeId,
      value_text: parsed.valueText,
      value_number: parsed.valueNumber,
      value_boolean: parsed.valueBoolean,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      const { error: upError } = await admin
        .from("catalog_product_spec_values")
        .update({
          value_text: payload.value_text,
          value_number: payload.value_number,
          value_boolean: payload.value_boolean,
          updated_at: payload.updated_at,
        })
        .eq("id", existing.id);
      if (upError) return systemError();
    } else {
      const { error: insError } = await admin.from("catalog_product_spec_values").insert(payload);
      if (insError) return systemError();
    }

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function saveProductSpecsFromForm(
  productId: string,
  entries: Array<{ attributeId: string; rawValue: string }>,
): Promise<ProductSpecActionResult<null>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!productId) return validationError("Sản phẩm không hợp lệ.");

  const nonEmpty = entries.filter((e) => e.rawValue.trim() !== "");
  if (nonEmpty.length > MAX_SPECS_PER_PRODUCT) {
    return validationError(`Tối đa ${MAX_SPECS_PER_PRODUCT} thông số có giá trị.`);
  }

  for (const e of entries) {
    const r = await upsertProductSpecValue(productId, e.attributeId, e.rawValue);
    if (!r.ok) return r;
  }

  return { ok: true, data: null };
}
