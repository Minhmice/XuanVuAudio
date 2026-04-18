"use server";

import { requireAdminRole } from "@xuanvu/shared/auth/role";
import { createSupabaseAdminClient } from "@xuanvu/shared/supabase/admin";

export type PolicyPageActionError = {
  code: "FORBIDDEN" | "UNAUTHENTICATED" | "SYSTEM_ERROR" | "CONFLICT" | "NOT_FOUND";
  message: string;
};

export type PolicyPageActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: PolicyPageActionError };

function unauthenticatedError(): PolicyPageActionResult<never> {
  return { ok: false, error: { code: "UNAUTHENTICATED", message: "Vui lòng đăng nhập." } };
}

function forbiddenError(): PolicyPageActionResult<never> {
  return {
    ok: false,
    error: { code: "FORBIDDEN", message: "Bạn không có quyền thực hiện hành động này." },
  };
}

function systemError(): PolicyPageActionResult<never> {
  return {
    ok: false,
    error: { code: "SYSTEM_ERROR", message: "Lỗi hệ thống. Vui lòng thử lại sau." },
  };
}

function notFoundError(message: string): PolicyPageActionResult<never> {
  return { ok: false, error: { code: "NOT_FOUND", message } };
}

function conflictError(message: string): PolicyPageActionResult<never> {
  return { ok: false, error: { code: "CONFLICT", message } };
}

function mapGuardError(
  guard: Awaited<ReturnType<typeof requireAdminRole>>,
): PolicyPageActionResult<never> | null {
  if (guard.ok) return null;
  if (guard.reason === "unauthenticated") return unauthenticatedError();
  if (guard.reason === "forbidden") return forbiddenError();
  return systemError();
}

export type PolicyPageSummary = {
  id: string;
  key: string;
  title: string;
  slug: string;
  isPublished: boolean;
  updatedAt: string;
};

export type PolicyPageDetail = PolicyPageSummary & {
  excerpt: string | null;
  contentMarkdown: string;
  publishedAt: string | null;
  createdAt: string;
};

type PolicyPageRow = {
  id: string;
  key: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_markdown: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function listPolicyPages(): Promise<PolicyPageActionResult<PolicyPageSummary[]>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("policy_pages")
      .select("id, key, title, slug, is_published, updated_at")
      .order("updated_at", { ascending: false });

    if (error) return systemError();

    const pages = (data as Pick<
      PolicyPageRow,
      "id" | "key" | "title" | "slug" | "is_published" | "updated_at"
    >[]).map((row) => ({
      id: row.id,
      key: row.key,
      title: row.title,
      slug: row.slug,
      isPublished: row.is_published,
      updatedAt: row.updated_at,
    }));

    return { ok: true, data: pages };
  } catch {
    return systemError();
  }
}

export async function getPolicyPageById(id: string): Promise<PolicyPageActionResult<PolicyPageDetail>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Trang chính sách không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("policy_pages")
      .select(
        "id, key, title, slug, excerpt, content_markdown, is_published, published_at, created_at, updated_at",
      )
      .eq("id", id)
      .maybeSingle<PolicyPageRow>();

    if (error) return systemError();
    if (!data) return notFoundError("Trang chính sách không tồn tại.");

    return {
      ok: true,
      data: {
        id: data.id,
        key: data.key,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        contentMarkdown: data.content_markdown,
        isPublished: data.is_published,
        publishedAt: data.published_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  } catch {
    return systemError();
  }
}

export async function createPolicyPage(input: {
  key: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  contentMarkdown?: string;
  isPublished?: boolean;
}): Promise<PolicyPageActionResult<{ id: string }>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  const key = input.key.trim();
  const title = input.title.trim();
  const slug = input.slug.trim();
  const excerpt = input.excerpt?.trim() ?? null;
  const contentMarkdown = input.contentMarkdown?.trim() ?? "";
  const isPublished = Boolean(input.isPublished);

  if (!key || !title || !slug) {
    return {
      ok: false,
      error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." },
    };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await adminClient
      .from("policy_pages")
      .insert({
        key,
        title,
        slug,
        excerpt,
        content_markdown: contentMarkdown,
        is_published: isPublished,
        published_at: isPublished ? now : null,
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError("Key hoặc slug đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return systemError();
    return { ok: true, data: { id: data.id } };
  } catch {
    return systemError();
  }
}

export async function updatePolicyPage(
  id: string,
  input: {
    key: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    contentMarkdown?: string;
    isPublished?: boolean;
  },
): Promise<PolicyPageActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Trang chính sách không tồn tại.");

  const key = input.key.trim();
  const title = input.title.trim();
  const slug = input.slug.trim();
  const excerpt = input.excerpt?.trim() ?? null;
  const contentMarkdown = input.contentMarkdown?.trim() ?? "";
  const isPublished = Boolean(input.isPublished);

  if (!key || !title || !slug) {
    return {
      ok: false,
      error: { code: "SYSTEM_ERROR", message: "Vui lòng điền đầy đủ thông tin." },
    };
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await adminClient
      .from("policy_pages")
      .update({
        key,
        title,
        slug,
        excerpt,
        content_markdown: contentMarkdown,
        is_published: isPublished,
        published_at: isPublished ? now : null,
        updated_at: now,
      })
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
        return conflictError("Key hoặc slug đã tồn tại.");
      }
      return systemError();
    }

    if (!data) return notFoundError("Trang chính sách không tồn tại.");
    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

export async function deletePolicyPage(id: string): Promise<PolicyPageActionResult<null>> {
  const guard = await requireAdminRole();
  const guardError = mapGuardError(guard);
  if (guardError) return guardError;

  if (!id) return notFoundError("Trang chính sách không tồn tại.");

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("policy_pages")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) return systemError();
    if (!data) return notFoundError("Trang chính sách không tồn tại.");

    return { ok: true, data: null };
  } catch {
    return systemError();
  }
}

