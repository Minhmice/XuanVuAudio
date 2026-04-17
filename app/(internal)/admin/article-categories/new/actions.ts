"use server";

import { redirect } from "next/navigation";

import { createArticleCategory } from "@/app/actions/article-categories";

export type CreateArticleCategoryFormState = {
  error?: string;
} | null;

export async function createArticleCategoryFormAction(
  _prevState: CreateArticleCategoryFormState,
  formData: FormData,
): Promise<CreateArticleCategoryFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const slug = (formData.get("slug") as string | null)?.trim() ?? "";
  const description = (formData.get("description") as string | null)?.trim() ?? "";

  if (!name || !slug) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }

  const result = await createArticleCategory({
    name,
    slug,
    description: description ? description : null,
  });

  if (!result.ok) {
    if (result.error.code === "CONFLICT") {
      return { error: "Tên hoặc slug danh mục đã tồn tại." };
    }
    if (result.error.code === "FORBIDDEN") {
      return { error: "Bạn không có quyền tạo danh mục." };
    }
    if (result.error.code === "UNAUTHENTICATED") {
      return { error: "Vui lòng đăng nhập." };
    }
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }

  redirect("/admin/article-categories");
}

