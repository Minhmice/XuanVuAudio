"use server";

import { requireAdminRole } from "@xuanvu/shared/auth/role";
import { createSupabaseAdminClient } from "@xuanvu/shared/supabase/admin";

import type { SpecValueType } from "@/app/actions/product-specs";

export type SpecAttributeSummary = {
  id: string;
  slug: string;
  labelVi: string;
  groupName: string;
  valueType: SpecValueType;
  sortOrder: number;
  isActive: boolean;
};

export type SpecAttributeActionError = {
  code: "FORBIDDEN" | "UNAUTHENTICATED" | "SYSTEM_ERROR" | "NOT_FOUND" | "CONFLICT" | "VALIDATION_ERROR";
  message: string;
};

export type SpecAttributeActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: SpecAttributeActionError };

function unauthenticatedError(): SpecAttributeActionResult<never> {
  return { ok: false, error: { code: "UNAUTHENTICATED", message: "Vui lòng đăng nhập." } };
}

function forbiddenError(): SpecAttributeActionResult<never> {
  return {
    ok: false,
    error: { code: "FORBIDDEN", message: "Bạn không có quyền thực hiện hành động này." },
  };
}

function systemError(): SpecAttributeActionResult<never> {
  return {
    ok: false,
    error: { code: "SYSTEM_ERROR", message: "Lỗi hệ thống. Vui lòng thử lại sau." },
  };
}

function notFoundError(message: string): SpecAttributeActionResult<never> {
  return { ok: false, error: { code: "NOT_FOUND", message } };
}

function conflictError(message: string): SpecAttributeActionResult<never> {
  return { ok: false, error: { code: "CONFLICT", message } };
}

function validationError(message: string): SpecAttributeActionResult<never> {
  return { ok: false, error: { code: "VALIDATION_ERROR", message } };
}

function mapGuardError(
  guard: Awaited<ReturnType<typeof requireAdminRole>>,
): SpecAttributeActionResult<never> | null {
  if (guard.ok) return null;
  if (guard.reason === "unauthenticated") return unauthenticatedError();
  if (guard.reason === "forbidden") return forbiddenError();
  return systemError();
}

const SLUG_RE = /^[a-z][a-z0-9_]*$/;

type AttrRow = {
  id: string;
  slug: string;
  label_vi: string;
  group_name: string;
  value_type: string;
  sort_order: number;
  is_active: boolean;
};

function mapRow(row: AttrRow): SpecAttributeSummary {
  return {
    id: row.id,
    slug: row.slug,
    labelVi: row.label_vi,
    groupName: row.group_name,
    valueType: row.value_type as SpecValueType,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

export async function listSpecAttributeDefinitions(): Promise<SpecAttributeActionResult<SpecAttributeSummary[]>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("catalog_spec_attributes")
      .select("id, slug, label_vi, group_name, value_type, sort_order, is_active")
      .order("group_name", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) return systemError();
    return { ok: true, data: ((data ?? []) as AttrRow[]).map(mapRow) };
  } catch {
    return systemError();
  }
}

export async function getSpecAttributeById(id: string): Promise<SpecAttributeActionResult<SpecAttributeSummary>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("catalog_spec_attributes")
      .select("id, slug, label_vi, group_name, value_type, sort_order, is_active")
      .eq("id", id)
      .maybeSingle();

    if (error) return systemError();
    if (!data) return notFoundError("Thuộc tính không tồn tại.");
    return { ok: true, data: mapRow(data as AttrRow) };
  } catch {
    return systemError();
  }
}

export async function createSpecAttribute(input: {
  slug: string;
  labelVi: string;
  groupName: string;
  valueType: SpecValueType;
  sortOrder: number;
}): Promise<SpecAttributeActionResult<{ id: string }>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  const slug = input.slug.trim().toLowerCase();
  if (!SLUG_RE.test(slug)) return validationError("Slug chỉ gồm chữ thường, số và dấu gạch dưới.");
  const labelVi = input.labelVi.trim();
  const groupName = input.groupName.trim();
  if (!labelVi || !groupName) return validationError("Nhãn và nhóm không được để trống.");
  if (!["text", "number", "boolean"].includes(input.valueType)) return validationError("Kiểu giá trị không hợp lệ.");

  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("catalog_spec_attributes")
      .insert({
        slug,
        label_vi: labelVi,
        group_name: groupName,
        value_type: input.valueType,
        sort_order: input.sortOrder,
        is_active: true,
      })
      .select("id")
      .maybeSingle();

    if (error) {
      if (error.code === "23505") return conflictError("Slug đã tồn tại.");
      return systemError();
    }
    if (!data?.id) return systemError();
    return { ok: true, data: { id: data.id as string } };
  } catch {
    return systemError();
  }
}

export async function updateSpecAttribute(
  id: string,
  input: {
    labelVi: string;
    groupName: string;
    sortOrder: number;
    isActive: boolean;
  },
): Promise<SpecAttributeActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  const labelVi = input.labelVi.trim();
  const groupName = input.groupName.trim();
  if (!labelVi || !groupName) return validationError("Nhãn và nhóm không được để trống.");

  try {
    const admin = createSupabaseAdminClient();
    const { data: existing, error: exError } = await admin
      .from("catalog_spec_attributes")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (exError) return systemError();
    if (!existing) return notFoundError("Thuộc tính không tồn tại.");

    const { error } = await admin
      .from("catalog_spec_attributes")
      .update({
        label_vi: labelVi,
        group_name: groupName,
        sort_order: input.sortOrder,
        is_active: input.isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return systemError();
    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}
