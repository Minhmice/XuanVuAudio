"use server";

import { redirect } from "next/navigation";

import { createBrand } from "@/app/actions/catalog";

export type CreateBrandFormState = {
  error?: string;
} | null;

export async function createBrandFormAction(
  _prevState: CreateBrandFormState,
  formData: FormData,
): Promise<CreateBrandFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const slug = (formData.get("slug") as string | null)?.trim() ?? "";
  const logoUrl = (formData.get("logoUrl") as string | null)?.trim() ?? "";

  if (!name || !slug) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }

  const result = await createBrand({ name, slug, logoUrl: logoUrl || null });

  if (!result.ok) {
    if (result.error.code === "CONFLICT") {
      return { error: "Slug thương hiệu đã tồn tại." };
    }
    if (result.error.code === "FORBIDDEN") {
      return { error: "Bạn không có quyền tạo thương hiệu." };
    }
    if (result.error.code === "UNAUTHENTICATED") {
      return { error: "Vui lòng đăng nhập." };
    }
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }

  redirect("/admin/brands");
}

