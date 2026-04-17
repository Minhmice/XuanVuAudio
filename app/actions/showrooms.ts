"use server";

import { requireStaffRole } from "@/app/lib/auth/role";
import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";

export type ShowroomActionError = {
  code: "FORBIDDEN" | "UNAUTHENTICATED" | "SYSTEM_ERROR" | "NOT_FOUND" | "CONFLICT";
  message: string;
};

export type ShowroomActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ShowroomActionError };

export type ShowroomRecord = {
  id: string;
  name: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
};

function unauthenticatedError(): ShowroomActionResult<never> {
  return {
    ok: false,
    error: { code: "UNAUTHENTICATED", message: "Vui lòng đăng nhập." },
  };
}

function forbiddenError(): ShowroomActionResult<never> {
  return {
    ok: false,
    error: { code: "FORBIDDEN", message: "Bạn không có quyền thực hiện hành động này." },
  };
}

function systemError(): ShowroomActionResult<never> {
  return {
    ok: false,
    error: { code: "SYSTEM_ERROR", message: "Lỗi hệ thống. Vui lòng thử lại sau." },
  };
}

function notFoundError(): ShowroomActionResult<never> {
  return {
    ok: false,
    error: { code: "NOT_FOUND", message: "Showroom không tồn tại." },
  };
}

function conflictError(): ShowroomActionResult<never> {
  return {
    ok: false,
    error: { code: "CONFLICT", message: "Showroom đã tồn tại." },
  };
}

function mapGuardError(
  guard: Awaited<ReturnType<typeof requireStaffRole>>,
): ShowroomActionResult<never> | null {
  if (guard.ok) return null;
  if (guard.reason === "unauthenticated") return unauthenticatedError();
  if (guard.reason === "forbidden") return forbiddenError();
  return systemError();
}

type ShowroomRow = {
  id: string;
  name: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export async function listShowrooms(): Promise<ShowroomActionResult<ShowroomRecord[]>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("showrooms")
      .select("id, name, address, phone, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) return systemError();

    const showrooms: ShowroomRecord[] = (data as ShowroomRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      phone: row.phone,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { ok: true, data: showrooms };
  } catch {
    return systemError();
  }
}

export async function getShowroomById(
  id: string,
): Promise<ShowroomActionResult<ShowroomRecord>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError();

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("showrooms")
      .select("id, name, address, phone, created_at, updated_at")
      .eq("id", id)
      .maybeSingle<ShowroomRow>();

    if (error) return systemError();
    if (!data) return notFoundError();

    return {
      ok: true,
      data: {
        id: data.id,
        name: data.name,
        address: data.address,
        phone: data.phone,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  } catch {
    return systemError();
  }
}

export async function createShowroom(input: {
  name: string;
  address: string;
  phone: string;
}): Promise<ShowroomActionResult<{ id: string }>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  const name = input.name.trim();
  const address = input.address.trim();
  const phone = input.phone.trim();

  if (!name || !address || !phone) {
    return { ok: false, error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." } };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await adminClient
      .from("showrooms")
      .insert({ name, address, phone, updated_at: now })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError();
      }
      return systemError();
    }

    if (!data) return systemError();

    return { ok: true, data: { id: data.id } };
  } catch {
    return systemError();
  }
}

export async function updateShowroom(
  id: string,
  input: { name: string; address: string; phone: string },
): Promise<ShowroomActionResult<null>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError();

  const name = input.name.trim();
  const address = input.address.trim();
  const phone = input.phone.trim();

  if (!name || !address || !phone) {
    return { ok: false, error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." } };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await adminClient
      .from("showrooms")
      .update({ name, address, phone, updated_at: now })
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError();
      }
      return systemError();
    }
    if (!data) return notFoundError();

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function deleteShowroom(id: string): Promise<ShowroomActionResult<null>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError();

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("showrooms")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) return systemError();
    if (!data) return notFoundError();

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

