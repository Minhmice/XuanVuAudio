"use server";

import { requireStaffRole } from "@xuanvu/shared/auth/role";
import { createSupabaseAdminClient } from "@xuanvu/shared/supabase/admin";

export type ArticleCategoryActionError = {
  code: "FORBIDDEN" | "UNAUTHENTICATED" | "SYSTEM_ERROR" | "CONFLICT" | "NOT_FOUND";
  message: string;
};

export type ArticleCategoryActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ArticleCategoryActionError };

function unauthenticatedError(): ArticleCategoryActionResult<never> {
  return { ok: false, error: { code: "UNAUTHENTICATED", message: "Vui lòng đăng nhập." } };
}

function forbiddenError(): ArticleCategoryActionResult<never> {
  return {
    ok: false,
    error: { code: "FORBIDDEN", message: "Bạn không có quyền thực hiện hành động này." },
  };
}

function systemError(): ArticleCategoryActionResult<never> {
  return {
    ok: false,
    error: { code: "SYSTEM_ERROR", message: "Lỗi hệ thống. Vui lòng thử lại sau." },
  };
}

function notFoundError(message: string): ArticleCategoryActionResult<never> {
  return { ok: false, error: { code: "NOT_FOUND", message } };
}

function conflictError(message: string): ArticleCategoryActionResult<never> {
  return { ok: false, error: { code: "CONFLICT", message } };
}

function mapGuardError(
  guard: Awaited<ReturnType<typeof requireStaffRole>>,
): ArticleCategoryActionResult<never> | null {
  if (guard.ok) return null;
  if (guard.reason === "unauthenticated") return unauthenticatedError();
  if (guard.reason === "forbidden") return forbiddenError();
  return systemError();
}

export type ArticleCategorySummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
};

type ArticleCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export async function listArticleCategories(): Promise<
  ArticleCategoryActionResult<ArticleCategorySummary[]>
> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("article_categories")
      .select("id, name, slug, description, created_at")
      .order("created_at", { ascending: false });

    if (error) return systemError();

    const categories = (data as ArticleCategoryRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      createdAt: row.created_at,
    }));

    return { ok: true, data: categories };
  } catch {
    return systemError();
  }
}

export async function getArticleCategoryById(
  id: string,
): Promise<ArticleCategoryActionResult<ArticleCategorySummary>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Danh mục bài viết không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("article_categories")
      .select("id, name, slug, description, created_at")
      .eq("id", id)
      .maybeSingle<ArticleCategoryRow>();

    if (error) return systemError();
    if (!data) return notFoundError("Danh mục bài viết không tồn tại.");

    return {
      ok: true,
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        createdAt: data.created_at,
      },
    };
  } catch {
    return systemError();
  }
}

export async function createArticleCategory(input: {
  name: string;
  slug: string;
  description?: string | null;
}): Promise<ArticleCategoryActionResult<{ id: string }>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  const name = input.name.trim();
  const slug = input.slug.trim();
  const description = input.description?.trim() ?? null;

  if (!name || !slug) {
    return {
      ok: false,
      error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." },
    };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await adminClient
      .from("article_categories")
      .insert({
        name,
        slug,
        description: description || null,
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError("Tên hoặc slug danh mục đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return systemError();
    return { ok: true, data: { id: data.id } };
  } catch {
    return systemError();
  }
}

export async function updateArticleCategory(
  id: string,
  input: { name: string; slug: string; description?: string | null },
): Promise<ArticleCategoryActionResult<null>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Danh mục bài viết không tồn tại.");

  const name = input.name.trim();
  const slug = input.slug.trim();
  const description = input.description?.trim() ?? null;

  if (!name || !slug) {
    return {
      ok: false,
      error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." },
    };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("article_categories")
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
        return conflictError("Tên hoặc slug danh mục đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return notFoundError("Danh mục bài viết không tồn tại.");
    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function deleteArticleCategory(
  id: string,
): Promise<ArticleCategoryActionResult<null>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Danh mục bài viết không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("article_categories")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) return systemError();
    if (!data) return notFoundError("Danh mục bài viết không tồn tại.");

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

