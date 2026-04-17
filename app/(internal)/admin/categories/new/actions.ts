"use server";

import { redirect } from "next/navigation";

import { createCategory } from "@/app/actions/catalog";

export type CreateCategoryFormState = {
  error?: string;
} | null;

export async function createCategoryFormAction(
  _prevState: CreateCategoryFormState,
  formData: FormData,
): Promise<CreateCategoryFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const slug = (formData.get("slug") as string | null)?.trim() ?? "";
  const description = (formData.get("description") as string | null)?.trim() ?? "";

  if (!name || !slug) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }

  const result = await createCategory({
    name,
    slug,
    description: description || null,
  });

  if (!result.ok) {
    if (result.error.code === "CONFLICT") {
      return { error: "Slug danh mục đã tồn tại." };
    }
    if (result.error.code === "FORBIDDEN") {
      return { error: "Bạn không có quyền tạo danh mục." };
    }
    if (result.error.code === "UNAUTHENTICATED") {
      return { error: "Vui lòng đăng nhập." };
    }
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }

  redirect("/admin/categories");
}

