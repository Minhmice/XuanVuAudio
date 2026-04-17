"use server";

import { redirect } from "next/navigation";

import { createArticle } from "@/app/actions/articles";

export type CreateArticleFormState = {
  error?: string;
} | null;

export async function createArticleFormAction(
  _prevState: CreateArticleFormState,
  formData: FormData,
): Promise<CreateArticleFormState> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const slug = (formData.get("slug") as string | null)?.trim() ?? "";
  const excerpt = (formData.get("excerpt") as string | null)?.trim() ?? "";
  const coverImageUrl = (formData.get("coverImageUrl") as string | null)?.trim() ?? "";
  const authorName = (formData.get("authorName") as string | null)?.trim() ?? "";
  const categoryId = (formData.get("categoryId") as string | null)?.trim() ?? "";
  const content = (formData.get("content") as string | null)?.trim() ?? "";

  if (!title || !slug) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }

  const result = await createArticle({
    title,
    slug,
    excerpt: excerpt ? excerpt : null,
    coverImageUrl: coverImageUrl ? coverImageUrl : null,
    authorName: authorName ? authorName : null,
    categoryId: categoryId ? categoryId : null,
    content: content ? content : "",
  });

  if (!result.ok) {
    if (result.error.code === "CONFLICT") {
      return { error: "Tiêu đề hoặc slug bài viết đã tồn tại." };
    }
    if (result.error.code === "FORBIDDEN") {
      return { error: "Bạn không có quyền tạo bài viết." };
    }
    if (result.error.code === "UNAUTHENTICATED") {
      return { error: "Vui lòng đăng nhập." };
    }
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }

  redirect(`/admin/articles/${result.data.id}`);
}

