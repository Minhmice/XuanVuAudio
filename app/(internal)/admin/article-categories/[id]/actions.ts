"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteArticleCategory,
  getArticleCategoryById,
  updateArticleCategory,
} from "@/app/actions/article-categories";

export type ArticleCategoryDetailFormState = {
  error?: string;
} | null;

export async function articleCategoryDetailFormAction(
  _prevState: ArticleCategoryDetailFormState,
  formData: FormData,
): Promise<ArticleCategoryDetailFormState> {
  const id = (formData.get("id") as string | null) ?? "";
  const intent = (formData.get("intent") as string | null) ?? "";

  if (!id) return { error: "Danh mục bài viết không tồn tại." };

  // Ensure the record exists for nicer errors.
  const existing = await getArticleCategoryById(id);
  if (!existing.ok) {
    return { error: existing.error.message };
  }

  if (intent === "update") {
    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const slug = (formData.get("slug") as string | null)?.trim() ?? "";
    const description = (formData.get("description") as string | null)?.trim() ?? "";

    if (!name || !slug) return { error: "Vui lòng điền đầy đủ thông tin." };

    const result = await updateArticleCategory(id, {
      name,
      slug,
      description: description ? description : null,
    });

    if (!result.ok) {
      if (result.error.code === "CONFLICT") {
        return { error: "Tên hoặc slug danh mục đã tồn tại." };
      }
      return { error: result.error.message };
    }

    revalidatePath(`/admin/article-categories/${id}`);
    return null;
  }

  if (intent === "delete") {
    const result = await deleteArticleCategory(id);
    if (!result.ok) return { error: result.error.message };

    revalidatePath("/admin/article-categories");
    redirect("/admin/article-categories");
  }

  return { error: "Hành động không hợp lệ." };
}

