"use server";

import { revalidatePath } from "next/cache";

import {
  getCategoryById,
  setCategoryPublished,
  updateCategory,
} from "@/app/actions/catalog";

export type CategoryDetailFormState = {
  error?: string;
} | null;

export async function categoryDetailFormAction(
  _prevState: CategoryDetailFormState,
  formData: FormData,
): Promise<CategoryDetailFormState> {
  const id = (formData.get("id") as string | null) ?? "";
  const intent = (formData.get("intent") as string | null) ?? "";

  if (!id) return { error: "Danh mục không tồn tại." };

  const existing = await getCategoryById(id);
  if (!existing.ok) return { error: existing.error.message };

  if (intent === "save") {
    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const slug = (formData.get("slug") as string | null)?.trim() ?? "";
    const description = (formData.get("description") as string | null)?.trim() ?? "";

    if (!name || !slug) return { error: "Vui lòng điền đầy đủ thông tin." };

    const result = await updateCategory(id, {
      name,
      slug,
      description: description || null,
    });
    if (!result.ok) return { error: result.error.message };

    revalidatePath(`/admin/categories/${id}`);
    return null;
  }

  if (intent === "publish") {
    const result = await setCategoryPublished(id, true);
    if (!result.ok) return { error: result.error.message };
    revalidatePath(`/admin/categories/${id}`);
    return null;
  }

  if (intent === "unpublish") {
    const result = await setCategoryPublished(id, false);
    if (!result.ok) return { error: result.error.message };
    revalidatePath(`/admin/categories/${id}`);
    return null;
  }

  return { error: "Hành động không hợp lệ." };
}

