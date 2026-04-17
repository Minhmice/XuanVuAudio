"use server";

import { redirect } from "next/navigation";

import type { ProductStatus } from "@/app/actions/products";
import { createProduct } from "@/app/actions/products";

export type CreateProductFormState = {
  error?: string;
} | null;

export async function createProductFormAction(
  _prevState: CreateProductFormState,
  formData: FormData,
): Promise<CreateProductFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const slug = (formData.get("slug") as string | null)?.trim() ?? "";
  const brandId = (formData.get("brandId") as string | null)?.trim() ?? "";
  const categoryId = (formData.get("categoryId") as string | null)?.trim() ?? "";
  const statusRaw = (formData.get("status") as string | null)?.trim() ?? "active";
  const description = (formData.get("description") as string | null)?.trim() ?? "";
  const imageUrlsRaw = (formData.get("imageUrls") as string | null) ?? "";

  if (!name || !slug || !brandId || !categoryId) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }

  const imageUrls = imageUrlsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const status: ProductStatus | null =
    statusRaw === "active" || statusRaw === "inactive" || statusRaw === "archived"
      ? (statusRaw satisfies ProductStatus)
      : null;

  if (!status) {
    return { error: "Trạng thái không hợp lệ." };
  }

  const result = await createProduct({
    name,
    slug,
    brandId,
    categoryId,
    status,
    description: description || null,
    imageUrls,
  });

  if (!result.ok) {
    if (result.error.code === "CONFLICT") {
      return { error: "Slug sản phẩm đã tồn tại." };
    }
    if (result.error.code === "FORBIDDEN") {
      return { error: "Bạn không có quyền tạo sản phẩm." };
    }
    if (result.error.code === "UNAUTHENTICATED") {
      return { error: "Vui lòng đăng nhập." };
    }
    return { error: result.error.message };
  }

  redirect("/admin/products");
}

