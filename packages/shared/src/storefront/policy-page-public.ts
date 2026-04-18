import "server-only";

import { createSupabaseServerClient } from "../supabase/server";

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

export type PublicPolicyPage = {
  title: string;
  slug: string;
  excerpt: string | null;
  contentMarkdown: string;
  publishedAt: string | null;
  updatedAt: string;
};

export async function getPublishedPolicyPageBySlug(
  slug: string,
): Promise<{ ok: true; data: PublicPolicyPage } | { ok: false; error: "NOT_FOUND" | "SYSTEM" }> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) return { ok: false, error: "NOT_FOUND" };

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("policy_pages")
      .select("title, slug, excerpt, content_markdown, published_at, updated_at, is_published")
      .eq("slug", normalizedSlug)
      .eq("is_published", true)
      .maybeSingle<
        Pick<
          PolicyPageRow,
          "title" | "slug" | "excerpt" | "content_markdown" | "published_at" | "updated_at" | "is_published"
        >
      >();

    if (error) return { ok: false, error: "SYSTEM" };
    if (!data) return { ok: false, error: "NOT_FOUND" };

    return {
      ok: true,
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        contentMarkdown: data.content_markdown,
        publishedAt: data.published_at,
        updatedAt: data.updated_at,
      },
    };
  } catch {
    return { ok: false, error: "SYSTEM" };
  }
}
