"use server";

import { revalidatePath } from "next/cache";

import {
  getBrandById,
  setBrandPublished,
  updateBrand,
} from "@/app/actions/catalog";

export type BrandDetailFormState = {
  error?: string;
} | null;

export async function brandDetailFormAction(
  _prevState: BrandDetailFormState,
  formData: FormData,
): Promise<BrandDetailFormState> {
  const id = (formData.get("id") as string | null) ?? "";
  const intent = (formData.get("intent") as string | null) ?? "";

  if (!id) return { error: "Thương hiệu không tồn tại." };

  const existing = await getBrandById(id);
  if (!existing.ok) return { error: existing.error.message };

  if (intent === "save") {
    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const slug = (formData.get("slug") as string | null)?.trim() ?? "";
    const logoUrl = (formData.get("logoUrl") as string | null)?.trim() ?? "";

    if (!name || !slug) return { error: "Vui lòng điền đầy đủ thông tin." };

    const result = await updateBrand(id, { name, slug, logoUrl: logoUrl || null });
    if (!result.ok) return { error: result.error.message };

    revalidatePath(`/admin/brands/${id}`);
    return null;
  }

  if (intent === "publish") {
    const result = await setBrandPublished(id, true);
    if (!result.ok) return { error: result.error.message };
    revalidatePath(`/admin/brands/${id}`);
    return null;
  }

  if (intent === "unpublish") {
    const result = await setBrandPublished(id, false);
    if (!result.ok) return { error: result.error.message };
    revalidatePath(`/admin/brands/${id}`);
    return null;
  }

  return { error: "Hành động không hợp lệ." };
}

