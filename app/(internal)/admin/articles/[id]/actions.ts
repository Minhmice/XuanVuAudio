"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteArticle,
  getArticleById,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from "@/app/actions/articles";

export type ArticleDetailFormState = {
  error?: string;
} | null;

export async function articleDetailFormAction(
  _prevState: ArticleDetailFormState,
  formData: FormData,
): Promise<ArticleDetailFormState> {
  const id = (formData.get("id") as string | null) ?? "";
  const intent = (formData.get("intent") as string | null) ?? "";

  if (!id) return { error: "Bài viết không tồn tại." };

  const existing = await getArticleById(id);
  if (!existing.ok) return { error: existing.error.message };

  if (intent === "update") {
    const title = (formData.get("title") as string | null)?.trim() ?? "";
    const slug = (formData.get("slug") as string | null)?.trim() ?? "";
    const excerpt = (formData.get("excerpt") as string | null)?.trim() ?? "";
    const coverImageUrl = (formData.get("coverImageUrl") as string | null)?.trim() ?? "";
    const authorName = (formData.get("authorName") as string | null)?.trim() ?? "";
    const categoryId = (formData.get("categoryId") as string | null)?.trim() ?? "";
    const content = (formData.get("content") as string | null)?.trim() ?? "";

    if (!title || !slug) return { error: "Vui lòng điền đầy đủ thông tin." };

    const result = await updateArticle(id, {
      title,
      slug,
      excerpt: excerpt ? excerpt : null,
      coverImageUrl: coverImageUrl ? coverImageUrl : null,
      authorName: authorName ? authorName : null,
      categoryId: categoryId ? categoryId : null,
      content,
    });

    if (!result.ok) {
      if (result.error.code === "CONFLICT") {
        return { error: "Tiêu đề hoặc slug bài viết đã tồn tại." };
      }
      return { error: result.error.message };
    }

    revalidatePath(`/admin/articles/${id}`);
    revalidatePath("/admin/articles");
    return null;
  }

  if (intent === "publish") {
    const result = await publishArticle(id);
    if (!result.ok) return { error: result.error.message };
    revalidatePath(`/admin/articles/${id}`);
    revalidatePath("/admin/articles");
    return null;
  }

  if (intent === "unpublish") {
    const result = await unpublishArticle(id);
    if (!result.ok) return { error: result.error.message };
    revalidatePath(`/admin/articles/${id}`);
    revalidatePath("/admin/articles");
    return null;
  }

  if (intent === "delete") {
    const result = await deleteArticle(id);
    if (!result.ok) return { error: result.error.message };

    revalidatePath("/admin/articles");
    redirect("/admin/articles");
  }

  return { error: "Hành động không hợp lệ." };
}

