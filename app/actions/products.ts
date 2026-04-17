"use server";

import { requireAdminRole } from "@/app/lib/auth/role";
import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";

export type ProductActionError = {
  code: "FORBIDDEN" | "UNAUTHENTICATED" | "SYSTEM_ERROR" | "CONFLICT" | "NOT_FOUND";
  message: string;
};

export type ProductActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ProductActionError };

function unauthenticatedError(): ProductActionResult<never> {
  return { ok: false, error: { code: "UNAUTHENTICATED", message: "Vui lòng đăng nhập." } };
}

function forbiddenError(): ProductActionResult<never> {
  return {
    ok: false,
    error: { code: "FORBIDDEN", message: "Bạn không có quyền thực hiện hành động này." },
  };
}

function systemError(): ProductActionResult<never> {
  return {
    ok: false,
    error: { code: "SYSTEM_ERROR", message: "Lỗi hệ thống. Vui lòng thử lại sau." },
  };
}

function notFoundError(message: string): ProductActionResult<never> {
  return { ok: false, error: { code: "NOT_FOUND", message } };
}

function conflictError(message: string): ProductActionResult<never> {
  return { ok: false, error: { code: "CONFLICT", message } };
}

function mapGuardError(
  guard: Awaited<ReturnType<typeof requireAdminRole>>,
): ProductActionResult<never> | null {
  if (guard.ok) return null;
  if (guard.reason === "unauthenticated") return unauthenticatedError();
  if (guard.reason === "forbidden") return forbiddenError();
  return systemError();
}

export type ProductStatus = "active" | "inactive" | "archived";

export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  isPublished: boolean;
  brandName: string;
  categoryName: string;
  createdAt: string;
};

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  description: string | null;
  status: ProductStatus;
  imageUrls: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  category_id: string;
  description: string | null;
  status: string;
  image_urls: string[] | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

type ProductSummaryRow = {
  id: string;
  name: string;
  slug: string;
  status: string;
  is_published: boolean;
  created_at: string;
  catalog_brands?: { name: string } | null;
  catalog_categories?: { name: string } | null;
};

function normalizeImageUrls(raw: string[] | undefined): string[] {
  const cleaned = (raw ?? [])
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
  return cleaned;
}

function isValidStatus(status: string): status is ProductStatus {
  return status === "active" || status === "inactive" || status === "archived";
}

export async function listProducts(): Promise<ProductActionResult<ProductSummary[]>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_products")
      .select(
        "id, name, slug, status, is_published, created_at, catalog_brands(name), catalog_categories(name)",
      )
      .order("created_at", { ascending: false });

    if (error) return systemError();

    const products = (data as ProductSummaryRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      status: (isValidStatus(row.status) ? row.status : "active") as ProductStatus,
      isPublished: row.is_published,
      brandName: row.catalog_brands?.name ?? "—",
      categoryName: row.catalog_categories?.name ?? "—",
      createdAt: row.created_at,
    }));

    return { ok: true, data: products };
  } catch {
    return systemError();
  }
}

export async function getProductById(id: string): Promise<ProductActionResult<ProductRecord>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Sản phẩm không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_products")
      .select(
        "id, name, slug, brand_id, category_id, description, status, image_urls, is_published, created_at, updated_at",
      )
      .eq("id", id)
      .maybeSingle<ProductRow>();

    if (error) return systemError();
    if (!data) return notFoundError("Sản phẩm không tồn tại.");

    const status = isValidStatus(data.status) ? data.status : "active";

    return {
      ok: true,
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        brandId: data.brand_id,
        categoryId: data.category_id,
        description: data.description,
        status,
        imageUrls: data.image_urls ?? [],
        isPublished: data.is_published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  } catch {
    return systemError();
  }
}

export async function createProduct(input: {
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  description?: string | null;
  status?: ProductStatus;
  imageUrls?: string[];
}): Promise<ProductActionResult<{ id: string }>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  const name = input.name.trim();
  const slug = input.slug.trim();
  const brandId = input.brandId.trim();
  const categoryId = input.categoryId.trim();
  const description = input.description?.trim() ?? null;
  const status = input.status ?? "active";
  const imageUrls = normalizeImageUrls(input.imageUrls);

  if (!name || !slug || !brandId || !categoryId) {
    return { ok: false, error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." } };
  }

  if (!isValidStatus(status)) {
    return { ok: false, error: { code: "SYSTEM_ERROR", message: "Trạng thái không hợp lệ." } };
  }

  if (imageUrls.length > 12) {
    return {
      ok: false,
      error: { code: "SYSTEM_ERROR", message: "Tối đa 12 ảnh trong bộ sưu tập." },
    };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await adminClient
      .from("catalog_products")
      .insert({
        name,
        slug,
        brand_id: brandId,
        category_id: categoryId,
        description: description || null,
        status,
        image_urls: imageUrls,
        is_published: false,
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError("Slug sản phẩm đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return systemError();

    return { ok: true, data: { id: data.id } };
  } catch {
    return systemError();
  }
}

export async function updateProduct(
  id: string,
  input: {
    name: string;
    slug: string;
    brandId: string;
    categoryId: string;
    description?: string | null;
    status: ProductStatus;
    imageUrls?: string[];
  },
): Promise<ProductActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Sản phẩm không tồn tại.");

  const name = input.name.trim();
  const slug = input.slug.trim();
  const brandId = input.brandId.trim();
  const categoryId = input.categoryId.trim();
  const description = input.description?.trim() ?? null;
  const status = input.status;
  const imageUrls = normalizeImageUrls(input.imageUrls);

  if (!name || !slug || !brandId || !categoryId) {
    return { ok: false, error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." } };
  }

  if (!isValidStatus(status)) {
    return { ok: false, error: { code: "SYSTEM_ERROR", message: "Trạng thái không hợp lệ." } };
  }

  if (imageUrls.length > 12) {
    return {
      ok: false,
      error: { code: "SYSTEM_ERROR", message: "Tối đa 12 ảnh trong bộ sưu tập." },
    };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_products")
      .update({
        name,
        slug,
        brand_id: brandId,
        category_id: categoryId,
        description: description || null,
        status,
        image_urls: imageUrls,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError("Slug sản phẩm đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return notFoundError("Sản phẩm không tồn tại.");

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function setProductPublished(
  id: string,
  isPublished: boolean,
): Promise<ProductActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Sản phẩm không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_products")
      .update({ is_published: isPublished, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) return systemError();
    if (!data) return notFoundError("Sản phẩm không tồn tại.");

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function deleteProduct(id: string): Promise<ProductActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Sản phẩm không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("catalog_products")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) return systemError();
    if (!data) return notFoundError("Sản phẩm không tồn tại.");

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

