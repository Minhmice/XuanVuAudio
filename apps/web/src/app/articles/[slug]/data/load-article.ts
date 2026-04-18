import { createSupabaseServerClient } from "@xuanvu/shared/supabase/server";

import type { ArticlePageData } from "../components/article-page-view";

export async function loadPublishedArticleBySlug(slug: string): Promise<ArticlePageData | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select("title, excerpt, cover_image_url, author_name, content, published_at, updated_at")
    .eq("slug", slug.trim())
    .eq("is_published", true)
    .maybeSingle<{
      title: string;
      excerpt: string | null;
      cover_image_url: string | null;
      author_name: string | null;
      content: string;
      published_at: string | null;
      updated_at: string;
    }>();

  if (error || !data) return null;

  return {
    title: data.title,
    excerpt: data.excerpt,
    cover_image_url: data.cover_image_url,
    author_name: data.author_name,
    content: data.content,
  };
}
