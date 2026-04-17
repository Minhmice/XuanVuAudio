"use server";

import { requireStaffRole } from "@/app/lib/auth/role";
import { createSupabaseAdminClient } from "@/app/lib/supabase/admin";

export type ArticleActionError = {
  code: "FORBIDDEN" | "UNAUTHENTICATED" | "SYSTEM_ERROR" | "CONFLICT" | "NOT_FOUND";
  message: string;
};

export type ArticleActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ArticleActionError };

function unauthenticatedError(): ArticleActionResult<never> {
  return { ok: false, error: { code: "UNAUTHENTICATED", message: "Vui lòng đăng nhập." } };
}

function forbiddenError(): ArticleActionResult<never> {
  return {
    ok: false,
    error: { code: "FORBIDDEN", message: "Bạn không có quyền thực hiện hành động này." },
  };
}

function systemError(): ArticleActionResult<never> {
  return {
    ok: false,
    error: { code: "SYSTEM_ERROR", message: "Lỗi hệ thống. Vui lòng thử lại sau." },
  };
}

function notFoundError(message: string): ArticleActionResult<never> {
  return { ok: false, error: { code: "NOT_FOUND", message } };
}

function conflictError(message: string): ArticleActionResult<never> {
  return { ok: false, error: { code: "CONFLICT", message } };
}

function mapGuardError(
  guard: Awaited<ReturnType<typeof requireStaffRole>>,
): ArticleActionResult<never> | null {
  if (guard.ok) return null;
  if (guard.reason === "unauthenticated") return unauthenticatedError();
  if (guard.reason === "forbidden") return forbiddenError();
  return systemError();
}

export type ArticleStatus = "draft" | "published";

export type ArticleSummary = {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  authorName: string | null;
  categoryId: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArticleDetail = ArticleSummary & {
  excerpt: string | null;
  coverImageUrl: string | null;
  content: string;
};

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  category_id: string | null;
  content: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapRowToSummary(row: ArticleRow): ArticleSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.is_published ? "published" : "draft",
    authorName: row.author_name,
    categoryId: row.category_id,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRowToDetail(row: ArticleRow): ArticleDetail {
  return {
    ...mapRowToSummary(row),
    excerpt: row.excerpt,
    coverImageUrl: row.cover_image_url,
    content: row.content ?? "",
  };
}

export async function listArticles(): Promise<ArticleActionResult<ArticleSummary[]>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("articles")
      .select(
        "id, title, slug, author_name, category_id, is_published, published_at, created_at, updated_at",
      )
      .order("updated_at", { ascending: false });

    if (error) return systemError();

    const rows = (data ?? []) as ArticleRow[];
    return { ok: true, data: rows.map(mapRowToSummary) };
  } catch {
    return systemError();
  }
}

export async function getArticleById(id: string): Promise<ArticleActionResult<ArticleDetail>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Bài viết không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("articles")
      .select(
        "id, title, slug, excerpt, cover_image_url, author_name, category_id, content, is_published, published_at, created_at, updated_at",
      )
      .eq("id", id)
      .maybeSingle<ArticleRow>();

    if (error) return systemError();
    if (!data) return notFoundError("Bài viết không tồn tại.");

    return { ok: true, data: mapRowToDetail(data) };
  } catch {
    return systemError();
  }
}

export async function createArticle(input: {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  authorName?: string | null;
  categoryId?: string | null;
  content?: string | null;
}): Promise<ArticleActionResult<{ id: string }>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  const title = input.title.trim();
  const slug = input.slug.trim();
  const excerpt = input.excerpt?.trim() ?? null;
  const coverImageUrl = input.coverImageUrl?.trim() ?? null;
  const authorName = input.authorName?.trim() ?? null;
  const categoryId = input.categoryId?.trim() ?? null;
  const content = input.content?.trim() ?? "";

  if (!title || !slug) {
    return {
      ok: false,
      error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." },
    };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const now = new Date().toISOString();

    const { data, error } = await adminClient
      .from("articles")
      .insert({
        title,
        slug,
        excerpt,
        cover_image_url: coverImageUrl,
        author_name: authorName,
        category_id: categoryId,
        content,
        is_published: false,
        published_at: null,
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError("Tiêu đề hoặc slug bài viết đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return systemError();
    return { ok: true, data: { id: data.id } };
  } catch {
    return systemError();
  }
}

export async function updateArticle(
  id: string,
  input: {
    title: string;
    slug: string;
    excerpt?: string | null;
    coverImageUrl?: string | null;
    authorName?: string | null;
    categoryId?: string | null;
    content?: string | null;
  },
): Promise<ArticleActionResult<null>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Bài viết không tồn tại.");

  const title = input.title.trim();
  const slug = input.slug.trim();
  const excerpt = input.excerpt?.trim() ?? null;
  const coverImageUrl = input.coverImageUrl?.trim() ?? null;
  const authorName = input.authorName?.trim() ?? null;
  const categoryId = input.categoryId?.trim() ?? null;
  const content = input.content?.trim() ?? "";

  if (!title || !slug) {
    return {
      ok: false,
      error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." },
    };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("articles")
      .update({
        title,
        slug,
        excerpt,
        cover_image_url: coverImageUrl,
        author_name: authorName,
        category_id: categoryId,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, title, slug, excerpt, cover_image_url, author_name, category_id, content, is_published, published_at, created_at, updated_at",
      )
      .maybeSingle<ArticleRow>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError("Tiêu đề hoặc slug bài viết đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return notFoundError("Bài viết không tồn tại.");
    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function publishArticle(id: string): Promise<ArticleActionResult<null>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Bài viết không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await adminClient
      .from("articles")
      .update({
        is_published: true,
        published_at: now,
        updated_at: now,
      })
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) return systemError();
    if (!data) return notFoundError("Bài viết không tồn tại.");

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function unpublishArticle(id: string): Promise<ArticleActionResult<null>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Bài viết không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await adminClient
      .from("articles")
      .update({
        is_published: false,
        updated_at: now,
      })
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) return systemError();
    if (!data) return notFoundError("Bài viết không tồn tại.");

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function deleteArticle(id: string): Promise<ArticleActionResult<null>> {
  const guard = await requireStaffRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Bài viết không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("articles")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) return systemError();
    if (!data) return notFoundError("Bài viết không tồn tại.");

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

