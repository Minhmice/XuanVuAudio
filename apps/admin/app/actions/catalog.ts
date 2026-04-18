"use server";

import { requireAdminRole } from "@xuanvu/shared/auth/role";
import { createSupabaseAdminClient } from "@xuanvu/shared/supabase/admin";

export type CatalogActionError = {
  code: "FORBIDDEN" | "UNAUTHENTICATED" | "SYSTEM_ERROR" | "CONFLICT" | "NOT_FOUND";
  message: string;
};

export type CatalogActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: CatalogActionError };

function unauthenticatedError(): CatalogActionResult<never> {
  return {
    ok: false,
    error: { code: "UNAUTHENTICATED", message: "Vui lòng đăng nhập." },
  };
}

function forbiddenError(): CatalogActionResult<never> {
  return {
    ok: false,
    error: {
      code: "FORBIDDEN",
      message: "Bạn không có quyền thực hiện hành động này.",
    },
  };
}

function systemError(): CatalogActionResult<never> {
  return {
    ok: false,
    error: { code: "SYSTEM_ERROR", message: "Lỗi hệ thống. Vui lòng thử lại sau." },
  };
}

function notFoundError(message: string): CatalogActionResult<never> {
  return { ok: false, error: { code: "NOT_FOUND", message } };
}

function conflictError(message: string): CatalogActionResult<never> {
  return { ok: false, error: { code: "CONFLICT", message } };
}

function mapGuardError(
  guard: Awaited<ReturnType<typeof requireAdminRole>>,
): CatalogActionResult<never> | null {
  if (guard.ok) return null;
  if (guard.reason === "unauthenticated") return unauthenticatedError();
  if (guard.reason === "forbidden") return forbiddenError();
  return systemError();
}

export type BrandSummary = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isPublished: boolean;
  createdAt: string;
};

type BrandRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_published: boolean;
  created_at: string;
};

export async function listBrands(): Promise<CatalogActionResult<BrandSummary[]>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_brands")
      .select("id, name, slug, logo_url, is_published, created_at")
      .order("created_at", { ascending: false });

    if (error) return systemError();

    const brands = (data as BrandRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      logoUrl: row.logo_url,
      isPublished: row.is_published,
      createdAt: row.created_at,
    }));

    return { ok: true, data: brands };
  } catch {
    return systemError();
  }
}

export async function getBrandById(id: string): Promise<CatalogActionResult<BrandSummary>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Thương hiệu không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_brands")
      .select("id, name, slug, logo_url, is_published, created_at")
      .eq("id", id)
      .maybeSingle<BrandRow>();

    if (error) return systemError();
    if (!data) return notFoundError("Thương hiệu không tồn tại.");

    return {
      ok: true,
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        logoUrl: data.logo_url,
        isPublished: data.is_published,
        createdAt: data.created_at,
      },
    };
  } catch {
    return systemError();
  }
}

export async function createBrand(input: {
  name: string;
  slug: string;
  logoUrl?: string | null;
}): Promise<CatalogActionResult<{ id: string }>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  const name = input.name.trim();
  const slug = input.slug.trim();
  const logoUrl = input.logoUrl?.trim() ?? null;

  if (!name || !slug) {
    return { ok: false, error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." } };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await adminClient
      .from("catalog_brands")
      .insert({
        name,
        slug,
        logo_url: logoUrl || null,
        is_published: false,
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError("Slug thương hiệu đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return systemError();

    return { ok: true, data: { id: data.id } };
  } catch {
    return systemError();
  }
}

export async function updateBrand(
  id: string,
  input: { name: string; slug: string; logoUrl?: string | null },
): Promise<CatalogActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Thương hiệu không tồn tại.");

  const name = input.name.trim();
  const slug = input.slug.trim();
  const logoUrl = input.logoUrl?.trim() ?? null;

  if (!name || !slug) {
    return { ok: false, error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." } };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_brands")
      .update({
        name,
        slug,
        logo_url: logoUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError("Slug thương hiệu đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return notFoundError("Thương hiệu không tồn tại.");

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function setBrandPublished(
  id: string,
  isPublished: boolean,
): Promise<CatalogActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Thương hiệu không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_brands")
      .update({ is_published: isPublished, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) return systemError();
    if (!data) return notFoundError("Thương hiệu không tồn tại.");

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isPublished: boolean;
  createdAt: string;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
};

export async function listCategories(): Promise<CatalogActionResult<CategorySummary[]>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_categories")
      .select("id, name, slug, description, is_published, created_at")
      .order("created_at", { ascending: false });

    if (error) return systemError();

    const categories = (data as CategoryRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      isPublished: row.is_published,
      createdAt: row.created_at,
    }));

    return { ok: true, data: categories };
  } catch {
    return systemError();
  }
}

export async function getCategoryById(id: string): Promise<CatalogActionResult<CategorySummary>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Danh mục không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_categories")
      .select("id, name, slug, description, is_published, created_at")
      .eq("id", id)
      .maybeSingle<CategoryRow>();

    if (error) return systemError();
    if (!data) return notFoundError("Danh mục không tồn tại.");

    return {
      ok: true,
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        isPublished: data.is_published,
        createdAt: data.created_at,
      },
    };
  } catch {
    return systemError();
  }
}

export async function createCategory(input: {
  name: string;
  slug: string;
  description?: string | null;
}): Promise<CatalogActionResult<{ id: string }>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  const name = input.name.trim();
  const slug = input.slug.trim();
  const description = input.description?.trim() ?? null;

  if (!name || !slug) {
    return { ok: false, error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." } };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await adminClient
      .from("catalog_categories")
      .insert({
        name,
        slug,
        description: description || null,
        is_published: false,
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError("Slug danh mục đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return systemError();
    return { ok: true, data: { id: data.id } };
  } catch {
    return systemError();
  }
}

export async function updateCategory(
  id: string,
  input: { name: string; slug: string; description?: string | null },
): Promise<CatalogActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Danh mục không tồn tại.");

  const name = input.name.trim();
  const slug = input.slug.trim();
  const description = input.description?.trim() ?? null;

  if (!name || !slug) {
    return { ok: false, error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." } };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_categories")
      .update({
        name,
        slug,
        description: description || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError("Slug danh mục đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return notFoundError("Danh mục không tồn tại.");
    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function setCategoryPublished(
  id: string,
  isPublished: boolean,
): Promise<CatalogActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Danh mục không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_categories")
      .update({ is_published: isPublished, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) return systemError();
    if (!data) return notFoundError("Danh mục không tồn tại.");

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

